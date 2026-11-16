import type { Snapshot } from "../mobile-sensors/capture";
import {
  poseAngles,
  RAD,
  norm,
  type Vec,
  type Quat,
} from "../mobile-sensors/math";
export type Device = {
  id: string;
  name: string;
  model: string;
  connected: boolean;
  lastSeen: number | null;
  camera: boolean;
};
export type Telemetry = {
  type: "telemetry";
  seq: number;
  at: number;
  receivedAt: number;
  accel: Vec | null;
  gyro: Vec | null;
  mag: Vec | null;
  q: Quat | null;
  referenceQ: Quat | null;
  predictedQ: Quat | null;
  absolute: boolean;
  screenAngle: number;
  battery: number | null;
  relay: boolean;
  gps: Snapshot["gps"];
  filter: {
    innovation: Vec;
    correction: Vec;
    covariance: number[][];
    gain: number[][];
    nis: number;
    sigma: number;
  };
};
export type CameraFrame = {
  shortFovDegrees?: number;
  url: string;
  at: number;
  receivedAt: number;
  q: Quat | null;
  absolute: boolean;
  screenAngle: number;
  width: number;
  height: number;
};
export function remoteSnapshot(
  history: Telemetry[],
  connected: boolean,
  now = Date.now(),
): Snapshot {
  const latest = history.at(-1),
    fresh = !!latest && connected && now - latest.receivedAt < 3500;
  const timed = (at: number) => performance.now() - (now - at);
  const samples = {
    accel: [],
    gyro: [],
    mag: [],
    orientation: [],
    attitude: [],
  } as Snapshot["samples"];
  for (const p of history.slice(-300)) {
    for (const key of ["accel", "gyro", "mag"] as const)
      if (p[key]) {
        const previous = samples[key].at(-1)?.filtered ?? p[key]!;
        const filtered = p[key]!.map(
          (v, i) => previous[i] + 0.45 * (v - previous[i]),
        ) as Vec;
        samples[key].push({ at: timed(p.receivedAt), raw: p[key]!, filtered });
      }
    if (p.referenceQ && p.q) {
      const raw = poseAngles(p.referenceQ),
        q = poseAngles(p.q);
      samples.attitude.push({
        at: timed(p.receivedAt),
        raw: [raw.yaw, raw.pitch, raw.roll],
        filtered: [q.yaw, q.pitch, q.roll],
      });
    }
  }
  const status: Snapshot["status"] = {
    accel: !fresh ? "stale" : latest.accel ? "live" : "unsupported",
    gyro: !fresh ? "stale" : latest.gyro ? "live" : "unsupported",
    mag: !fresh ? "stale" : latest.mag ? "live" : "unsupported",
    orientation: !fresh ? "stale" : latest.q ? "live" : "unsupported",
    gps: !latest?.gps
      ? "waiting"
      : now - latest.gps.at > 30000
        ? "stale"
        : "live",
  };
  return {
    running: fresh,
    status,
    sources: {
      accel: "Android native",
      gyro: "Android native",
      mag: "Android native",
      orientation: "Android rotation vector",
      gps: "Android location",
    },
    samples,
    gps: latest?.gps ?? null,
    gpsHistory: history
      .filter((p) => p.gps)
      .map((p) => p.gps!)
      .filter((p, i, a) => i === 0 || p.at !== a[i - 1].at)
      .slice(-300),
    q: fresh ? latest.q : null,
    poseAt: performance.now(),
    rate: fresh ? latest.gyro : null,
    absolute: !!latest?.absolute,
    sigma: latest?.filter.sigma ?? 0,
    mode: "browser",
    calibration: "idle",
    progress: 0,
    gyroCalibrated: false,
    magCalibrated: false,
    bias: [0, 0, 0],
    magneticNorm: latest?.mag ? norm(latest.mag) : null,
    magneticHeading: null,
    covariance: latest?.filter.covariance ?? [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    quaternions: history
      .filter((p) => p.q && p.referenceQ)
      .slice(-300)
      .map((p) => ({
        at: timed(p.receivedAt),
        measured: p.referenceQ!,
        predicted: p.predictedQ ?? p.q!,
        filtered: p.q!,
      })),
    diagnostics: history.slice(-300).map((p) => ({
      at: timed(p.receivedAt),
      innovation: p.filter.innovation.map((x) => x / RAD) as Vec,
      correction: p.filter.correction.map((x) => x / RAD) as Vec,
      sigma: p.filter.covariance.map(
        (r, i) => Math.sqrt(Math.max(0, r[i])) / RAD,
      ) as Vec,
      gain: p.filter.gain.map((r, i) => r[i]) as Vec,
      nis: p.filter.nis,
    })),
  };
}
