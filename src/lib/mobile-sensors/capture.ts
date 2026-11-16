import {
  AttitudeKalman,
  calibrateMag,
  correctMag,
  finiteVec,
  fromAccelMag,
  fromOrientation,
  MagCalibration,
  norm,
  Quat,
  RAD,
  poseAngles,
  SourceLock,
  stationaryBias,
  Vec,
} from "./math";

export type Stream = "accel" | "gyro" | "mag" | "orientation" | "gps";
export type Status =
  | "idle"
  | "waiting"
  | "live"
  | "unsupported"
  | "denied"
  | "unavailable"
  | "stale";
export type Sample = { at: number; raw: Vec; filtered: Vec };
export type Fix = {
  lat: number;
  lon: number;
  altitude: number | null;
  accuracy: number;
  altitudeAccuracy: number | null;
  speed: number | null;
  course: number | null;
  at: number;
};
export type Snapshot = {
  running: boolean;
  status: Record<Stream, Status>;
  sources: Partial<Record<Stream, string>>;
  samples: Record<Exclude<Stream, "gps"> | "attitude", Sample[]>;
  gps: Fix | null;
  gpsHistory: Fix[];
  q: Quat | null;
  absolute: boolean;
  sigma: number;
  mode: "browser" | "raw";
  calibration: "idle" | "gyro" | "mag" | "done" | "failed";
  progress: number;
  gyroCalibrated: boolean;
  magCalibrated: boolean;
  bias: Vec;
  magneticNorm: number | null;
};
type Sensor = {
  x: number | null;
  y: number | null;
  z: number | null;
  quaternion?: number[] | null;
  start: () => void;
  stop: () => void;
  addEventListener: (name: string, fn: (e: Event) => void) => void;
};
type SensorConstructor = new (options: {
  frequency: number;
  referenceFrame: string;
}) => Sensor;
type SensorWindow = Window &
  Partial<
    Record<
      | "Accelerometer"
      | "Gyroscope"
      | "Magnetometer"
      | "AbsoluteOrientationSensor",
      SensorConstructor
    >
  >;
type PermissionConstructor = {
  requestPermission?: (absolute?: boolean) => Promise<string>;
};
const streams: Stream[] = ["accel", "gyro", "mag", "orientation", "gps"];
const freshMs = 1500;

/** Local-only, bounded acquisition. No network or persistent location storage. */
export class SensorCapture {
  running = false;
  private generation = 0;
  private cleanups: (() => void)[] = [];
  private last: Partial<Record<Stream, number>> = {};
  private status = Object.fromEntries(
    streams.map((s) => [s, "idle"]),
  ) as Record<Stream, Status>;
  private sources: Snapshot["sources"] = {};
  private histories: Snapshot["samples"] = {
    accel: [],
    gyro: [],
    mag: [],
    orientation: [],
    attitude: [],
  };
  private low: Partial<Record<Stream, Vec>> = {};
  private values: Partial<Record<Stream, Vec>> = {};
  private filter = new AttitudeKalman();
  private lock = new SourceLock();
  private lastUpdate = 0;
  private gyroAt = 0;
  private orientationAt = 0;
  private absolute = false;
  private mode: "browser" | "raw" = "browser";
  private gps: Fix | null = null;
  private gpsHistory: Fix[] = [];
  private bias: Vec = [0, 0, 0];
  private magCalibration: MagCalibration | null = null;
  private gyroCalibrated = false;
  private calibration: Snapshot["calibration"] = "idle";
  private calibrationAt = 0;
  private calibrationSamples: {
    gyro: Vec[];
    accel: Vec[];
    mag: Vec[];
    poses: Quat[];
  } = {
    gyro: [],
    accel: [],
    mag: [],
    poses: [],
  };

  async start() {
    this.stop();
    this.running = true;
    const generation = ++this.generation;
    this.startedAt = performance.now();
    this.last = {};
    this.histories = {
      accel: [],
      gyro: [],
      mag: [],
      orientation: [],
      attitude: [],
    };
    this.low = {};
    this.values = {};
    this.sources = {};
    this.gps = null;
    this.gpsHistory = [];
    this.filter = new AttitudeKalman();
    this.lock = new SourceLock();
    this.lastUpdate = 0;
    this.gyroAt = 0;
    this.orientationAt = 0;
    this.absolute = false;
    streams.forEach((s) => (this.status[s] = "waiting"));
    // Invoke both permission requests in the initial user gesture, before awaiting.
    const request = (
      ctor: PermissionConstructor | undefined,
      absolute = false,
    ) => {
      try {
        return ctor?.requestPermission
          ? ctor.requestPermission(absolute)
          : Promise.resolve("granted");
      } catch {
        return Promise.resolve("denied");
      }
    };
    const orientation = request(
      window.DeviceOrientationEvent as PermissionConstructor | undefined,
      true,
    );
    const motion = request(
      window.DeviceMotionEvent as PermissionConstructor | undefined,
    );
    const [op, mp] = await Promise.allSettled([orientation, motion]);
    if (!this.running || generation !== this.generation) return;
    if (!isSecureContext) {
      streams.forEach((s) => (this.status[s] = "unavailable"));
      this.stop();
      return;
    }
    const permits = (p: PromiseSettledResult<string>) =>
      p.status === "fulfilled" && p.value === "granted";
    if (permits(op)) {
      if (!window.DeviceOrientationEvent)
        this.status.orientation = "unsupported";
      else {
        const handler = (event: Event) =>
          this.orientation(event as DeviceOrientationEvent);
        this.listen(window, "deviceorientationabsolute", handler);
        this.listen(window, "deviceorientation", handler);
      }
    } else this.status.orientation = "denied";
    if (permits(mp)) {
      if (!window.DeviceMotionEvent) {
        this.status.accel = "unsupported";
        this.status.gyro = "unsupported";
      } else
        this.listen(window, "devicemotion", (event) => {
          const e = event as DeviceMotionEvent,
            a = e.accelerationIncludingGravity,
            g = e.rotationRate;
          if (a && finiteVec([a.x, a.y, a.z]))
            this.vector("accel", [a.x!, a.y!, a.z!], "DeviceMotion");
          if (g && finiteVec([g.beta, g.gamma, g.alpha]))
            this.vector(
              "gyro",
              [g.beta! * RAD, g.gamma! * RAD, g.alpha! * RAD],
              "DeviceMotion",
            );
        });
    } else {
      this.status.accel = "denied";
      this.status.gyro = "denied";
    }
    // Raw APIs are optional enhancements; event APIs above remain the fallback.
    for (const [name, key] of [
      ["Accelerometer", "accel"],
      ["Gyroscope", "gyro"],
      ["Magnetometer", "mag"],
    ] as const) {
      if ((key === "accel" || key === "gyro") && !permits(mp)) continue;
      const Constructor = (window as SensorWindow)[name];
      if (!Constructor) {
        if (key === "mag") this.status.mag = "unsupported";
        continue;
      }
      try {
        const sensor = new Constructor({
          frequency: 50,
          referenceFrame: "device",
        });
        sensor.addEventListener("reading", () => {
          if (
            this.running &&
            generation === this.generation &&
            finiteVec([sensor.x, sensor.y, sensor.z])
          )
            this.vector(key, [sensor.x!, sensor.y!, sensor.z!], name);
        });
        sensor.addEventListener("error", (e) => {
          if (!this.running || generation !== this.generation) return;
          // Keep a working DeviceMotion stream when the optional API is blocked.
          if (
            this.sources[key] === name ||
            !(
              this.sources[key] === "DeviceMotion" &&
              this.last[key] !== undefined &&
              performance.now() - this.last[key]! < freshMs
            )
          )
            this.status[key] =
              (e as Event & { error?: { name: string } }).error?.name ===
              "NotAllowedError"
                ? "denied"
                : "unavailable";
          if (this.sources[key] === name) delete this.last[key];
        });
        this.cleanups.push(() => sensor.stop());
        sensor.start();
      } catch {
        if (key === "mag") this.status.mag = "unavailable";
      }
    }
    if (!navigator.geolocation) this.status.gps = "unsupported";
    else {
      const watch = navigator.geolocation.watchPosition(
        (p) => {
          if (!this.running || generation !== this.generation) return;
          const c = p.coords;
          if (!Number.isFinite(c.latitude) || !Number.isFinite(c.longitude))
            return;
          this.gps = {
            lat: c.latitude,
            lon: c.longitude,
            altitude: c.altitude,
            accuracy: c.accuracy,
            altitudeAccuracy: c.altitudeAccuracy,
            speed: c.speed,
            course: c.heading,
            at: p.timestamp,
          };
          this.gpsHistory.push(this.gps);
          this.gpsHistory = this.gpsHistory.slice(-300);
          this.last.gps = performance.now();
          this.status.gps = "live";
          this.sources.gps = "Geolocation";
        },
        (e) => {
          if (this.running && generation === this.generation)
            this.status.gps = e.code === 1 ? "denied" : "unavailable";
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
      );
      this.cleanups.push(() => navigator.geolocation.clearWatch(watch));
    }
    this.listen(document, "visibilitychange", () => {
      if (document.hidden) this.stop();
    });
  }
  private listen(
    target: Window | Document,
    name: string,
    fn: (e: Event) => void,
  ) {
    target.addEventListener(name, fn);
    this.cleanups.push(() => target.removeEventListener(name, fn));
  }
  stop() {
    this.running = false;
    this.generation++;
    this.cleanups.splice(0).forEach((fn) => fn());
    if (this.calibration === "gyro" || this.calibration === "mag")
      this.calibration = "failed";
  }
  setMode(mode: "browser" | "raw") {
    this.mode = mode;
    this.filter = new AttitudeKalman();
    this.absolute = false;
    this.lastUpdate = 0;
    this.orientationAt = 0;
  }
  calibrate(kind: "gyro" | "mag") {
    if (!this.running) return;
    this.calibration = kind;
    this.calibrationAt = performance.now();
    this.calibrationSamples = { gyro: [], accel: [], mag: [], poses: [] };
  }
  resetCalibration() {
    this.bias = [0, 0, 0];
    this.magCalibration = null;
    this.gyroCalibrated = false;
    this.calibration = "idle";
    this.filter = new AttitudeKalman();
    this.orientationAt = 0;
  }
  private vector(key: "accel" | "gyro" | "mag", v: Vec, source: string) {
    if (!this.running || !finiteVec(v)) return;
    const now = performance.now();
    if (
      source === "DeviceMotion" &&
      this.sources[key] !== source &&
      this.last[key] !== undefined &&
      now - this.last[key]! < freshMs
    )
      return;
    const dt =
      this.last[key] === undefined ? 0.02 : (now - this.last[key]!) / 1000;
    this.last[key] = now;
    this.status[key] = "live";
    this.sources[key] = source;
    this.values[key] = v;
    const k = 1 - Math.exp(-Math.min(dt, 0.2) / 0.09),
      previous = this.low[key] ?? v;
    const corrected =
      key === "mag" && this.magCalibration
        ? correctMag(v, this.magCalibration)
        : key === "gyro"
          ? (v.map((x, i) => x - this.bias[i]) as Vec)
          : v;
    this.low[key] = corrected.map(
      (x, i) => previous[i] + k * (x - previous[i]),
    ) as Vec;
    this.record(key, v, this.low[key]!, now);
    if (this.calibration === "gyro" && (key === "accel" || key === "gyro"))
      this.calibrationSamples[key].push(v);
    if (this.calibration === "mag" && key === "mag")
      this.calibrationSamples.mag.push(v);
    if (key === "gyro") {
      this.filter.predict(corrected, (now - this.gyroAt) / 1000);
      this.gyroAt = now;
    }
    if (
      this.mode === "raw" &&
      this.magCalibration &&
      this.values.accel &&
      this.values.mag &&
      now - (this.last.accel ?? 0) < 200 &&
      now - (this.last.mag ?? 0) < 200 &&
      now - this.lastUpdate >= 90
    ) {
      const q = fromAccelMag(
        this.low.accel!,
        correctMag(this.values.mag, this.magCalibration),
      );
      if (q) {
        this.filter.update(
          q,
          7,
          (now - this.lastUpdate) / 1000,
          now - this.gyroAt < 200,
        );
        this.lastUpdate = now;
        this.orientationAt = now;
        this.absolute = true;
        this.recordPose(q, now);
      }
    }
  }
  private record(
    key: Exclude<Stream, "gps"> | "attitude",
    raw: Vec,
    filtered: Vec,
    now: number,
  ) {
    const history = this.histories[key];
    if (history.length && now - history[history.length - 1].at < 95) return;
    history.push({ at: now, raw: [...raw], filtered: [...filtered] });
    if (history.length > 300) history.shift();
  }
  private orientation(e: DeviceOrientationEvent) {
    if (
      !this.running ||
      e.alpha === null ||
      e.beta === null ||
      e.gamma === null ||
      ![e.alpha, e.beta, e.gamma].every(Number.isFinite)
    )
      return;
    const now = performance.now(),
      absolute = e.absolute || e.type === "deviceorientationabsolute";
    const priority =
      e.type === "deviceorientationabsolute" ? 3 : absolute ? 2 : 1;
    if (
      !this.lock.accept(
        e.type + (absolute ? ":absolute" : ":relative"),
        priority,
        now,
      )
    )
      return;
    this.last.orientation = now;
    this.status.orientation = "live";
    this.sources.orientation =
      e.type + (absolute ? " · magnetic" : " · relative");
    const q = fromOrientation(e.alpha, e.beta, e.gamma);
    if (this.calibration === "gyro") this.calibrationSamples.poses.push(q);
    if (this.mode === "browser" && now - this.lastUpdate >= 90) {
      if (this.absolute !== absolute || now - this.orientationAt > freshMs)
        this.filter = new AttitudeKalman();
      this.absolute = absolute;
      this.filter.update(
        q,
        5,
        (now - this.lastUpdate) / 1000,
        now - this.gyroAt < 200,
      );
      this.lastUpdate = now;
      this.orientationAt = now;
      this.recordPose(q, now);
    }
    // Raw alpha/beta/gamma remain angles, not fabricated XYZ magnetic readings.
    this.record(
      "orientation",
      [e.alpha, e.beta, e.gamma],
      [e.alpha, e.beta, e.gamma],
      now,
    );
  }
  private recordPose(measured: Quat, now: number) {
    if (!this.filter.q) return;
    const a = poseAngles(measured),
      b = poseAngles(this.filter.q);
    this.record(
      "attitude",
      [a.yaw, a.pitch, a.roll],
      [b.yaw, b.pitch, b.roll],
      now,
    );
  }
  snapshot(): Snapshot {
    const now = performance.now(),
      elapsed = now - this.calibrationAt;
    if (this.calibration === "gyro" && elapsed >= 5000) {
      const bias = stationaryBias(
        this.calibrationSamples.gyro,
        this.calibrationSamples.accel,
        this.calibrationSamples.poses,
      );
      if (bias) {
        this.bias = bias;
        this.gyroCalibrated = true;
        this.calibration = "done";
      } else this.calibration = "failed";
    }
    if (this.calibration === "mag" && elapsed >= 30000) {
      const c = calibrateMag(this.calibrationSamples.mag);
      if (c) {
        this.magCalibration = c;
        this.calibration = "done";
      } else this.calibration = "failed";
    }
    const status = { ...this.status };
    streams.forEach((s) => {
      if (
        this.running &&
        status[s] === "waiting" &&
        now - (this.last[s] ?? this.startedAt) > 8000
      )
        status[s] = "unavailable";
      if (
        status[s] === "live" &&
        now - (this.last[s] ?? 0) > (s === "gps" ? 30000 : freshMs)
      )
        status[s] = "stale";
    });
    return {
      running: this.running,
      status,
      sources: { ...this.sources },
      samples: Object.fromEntries(
        Object.entries(this.histories).map(([k, v]) => [k, v.slice()]),
      ) as Snapshot["samples"],
      gps: this.gps,
      gpsHistory: this.gpsHistory.slice(),
      q:
        this.running && this.orientationAt && now - this.orientationAt < freshMs
          ? this.filter.q
          : null,
      absolute: this.absolute,
      sigma: this.filter.sigmaDeg,
      mode: this.mode,
      calibration: this.calibration,
      progress:
        this.calibration === "gyro"
          ? Math.min(1, elapsed / 5000)
          : this.calibration === "mag"
            ? Math.min(1, elapsed / 30000)
            : 0,
      gyroCalibrated: this.gyroCalibrated,
      magCalibrated: !!this.magCalibration,
      bias: [...this.bias],
      magneticNorm: this.values.mag
        ? norm(
            this.magCalibration
              ? correctMag(this.values.mag, this.magCalibration)
              : this.values.mag,
          )
        : null,
    };
  }
  private startedAt = 0;
}
