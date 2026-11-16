import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import katex from "katex";
import { expandStars } from "../src/lib/sky/catalog";
import {
  AttitudeKalman,
  calibrateMag,
  conjugate,
  delta,
  exp,
  fromAccelMag,
  fromOrientation,
  HeadingFilter,
  log,
  mul,
  norm,
  rotate,
  skyPoint,
  SourceLock,
  stationaryBias,
  topHeading,
  Vec,
} from "../src/lib/mobile-sensors/math";
import { canUseMobileSensors } from "../src/lib/mobile-sensors/access";
import { SensorCapture } from "../src/lib/mobile-sensors/capture";
import {
  cameraProject,
  extrapolate,
  rearCameraFrame,
  verticalFovFromShortSide,
} from "../src/lib/mobile-sensors/camera";
import { equatorialToHorizontal } from "../src/lib/astronomy/sphere";
import { lstHours } from "../src/lib/astronomy/time";
const near = (a: number, b: number, tol = 1e-6) =>
  assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);
test("Hiding while permission is pending cancels capture before GPS or raw sensors start", async () => {
  const saved = new Map(
    ["window", "document", "navigator"].map((key) => [
      key,
      Object.getOwnPropertyDescriptor(globalThis, key),
    ]),
  );
  const pending: ((value: string) => void)[] = [];
  const permission = () =>
    new Promise<string>((resolve) => pending.push(resolve));
  const doc = Object.assign(new EventTarget(), { hidden: false });
  let gpsRequests = 0;
  const win = Object.assign(new EventTarget(), {
    DeviceOrientationEvent: { requestPermission: permission },
    DeviceMotionEvent: { requestPermission: permission },
  });
  try {
    Object.defineProperty(globalThis, "window", {
      value: win,
      configurable: true,
    });
    Object.defineProperty(globalThis, "document", {
      value: doc,
      configurable: true,
    });
    Object.defineProperty(globalThis, "navigator", {
      value: {
        geolocation: {
          watchPosition() {
            gpsRequests++;
          },
        },
      },
      configurable: true,
    });
    const capture = new SensorCapture(),
      started = capture.start();
    assert.equal(pending.length, 2);
    doc.hidden = true;
    doc.dispatchEvent(new Event("visibilitychange"));
    pending.forEach((resolve) => resolve("granted"));
    await started;
    assert.equal(capture.snapshot().running, false);
    assert.equal(gpsRequests, 0);
    capture.stop();
  } finally {
    for (const [key, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
test("Dedicated account gate cannot be widened by a suffix or the general admin role", () => {
  assert.ok(canUseMobileSensors(" ATAMORADI8@gmail.com "));
  for (const email of [
    null,
    undefined,
    "admin@ndorbit.co.nz",
    "atamoradi8@gmail.com.evil",
    "reader@gmail.com",
    "",
  ])
    assert.equal(canUseMobileSensors(email), false);
});
test("W3C coordinate fixtures: flat west, vertical south-facing screen, landscape top", () => {
  near(topHeading(fromOrientation(90, 0, 0))!, 270);
  const v = rotate(fromOrientation(0, 90, 0), [0, 0, 1]);
  near(v[1], -1);
  near(v[2], 0);
  assert.equal(topHeading(fromOrientation(0, 90, 0)), null);
  near(topHeading(fromOrientation(0, 0, 0), 90)!, 270);
});
test("Source arbitration prevents alternation between relative and absolute streams", () => {
  const lock = new SourceLock();
  assert.ok(lock.accept("relative", 1, 0));
  assert.ok(lock.accept("absolute", 3, 1));
  for (let i = 2; i < 200; i++) {
    assert.equal(lock.accept("relative", 1, i * 5), false);
    assert.ok(lock.accept("absolute", 3, i * 5 + 1));
  }
  assert.ok(lock.accept("relative", 1, 5000));
});
test("Circular Kalman compass crosses north without a full-turn CSS jump", () => {
  const filter = new HeadingFilter();
  let last = filter.update(359, 0.02);
  for (const value of [0, 1, 359, 0, 1, 2, 3]) {
    const next = filter.update(value, 0.1);
    assert.ok(Math.abs(next - last) < 3);
    last = next;
  }
  assert.ok(last > 359 && last < 364);
});
test("Attitude quaternion remains normalized, tracks gyro, and ignores quaternion sign", () => {
  const f = new AttitudeKalman();
  f.update(fromOrientation(0, 0, 0));
  for (let i = 0; i < 100; i++) f.predict([0, 0, Math.PI / 2], 0.01);
  near(norm(f.q!), 1);
  near(topHeading(f.q!)!, 270, 0.001);
  const before = f.q!;
  f.update(before.map((x) => -x) as typeof before, 5, 0.1, true);
  near(norm(log(mul(conjugate(before), f.q!))), 0);
  const held = f.q!.slice();
  f.predict([0, 0, 1], 20);
  assert.deepEqual(f.q, held);
  assert.ok(Number.isFinite(f.sigmaDeg) && f.sigmaDeg > 0);
});
test("Kalman reduces deterministic stationary angular jitter, without a wrap artifact", () => {
  const f = new AttitudeKalman();
  let input = 0,
    output = 0;
  for (let i = 0; i < 500; i++) {
    const noise = 4 * Math.sin(i * 2.4);
    f.update(fromOrientation(noise, 0, 0), 5, 0.1, false);
    if (i > 50) {
      input += noise ** 2;
      output += delta(topHeading(f.q!)!, 0) ** 2;
    }
  }
  assert.ok(output < input * 0.5);
});
test("TRIAD reproduces known poses and rejects free fall, acceleration and implausible fields", () => {
  for (const q of [
    fromOrientation(0, 0, 0),
    fromOrientation(125, 32, -28),
    fromOrientation(180, 0, 0),
    fromOrientation(45, -110, 44),
  ]) {
    const a = rotate(conjugate(q), [0, 0, 9.80665]),
      m = rotate(conjugate(q), [0, 24, -40]);
    const measured = fromAccelMag(a, m);
    assert.ok(measured);
    near(norm(log(mul(conjugate(q), measured))), 0);
  }
  assert.equal(fromAccelMag([0, 0, 0], [0, 25, -40]), null);
  assert.equal(fromAccelMag([0, 0, 14], [0, 25, -40]), null);
  assert.equal(fromAccelMag([0, 0, 9.8], [0, 0, 50]), null);
});
test("Calibration rejects incomplete movement and measures stationary bias", () => {
  assert.equal(
    calibrateMag(Array.from({ length: 150 }, () => [30, 0, 0])),
    null,
  );
  const sphere: Vec[] = Array.from({ length: 600 }, (_, i) => {
    const z = 1 - (2 * i) / 599,
      a = i * 2.39996,
      r = Math.sqrt(1 - z * z);
    return [
      12 + 42 * r * Math.cos(a) * 1.2,
      -8 + 42 * r * Math.sin(a) * 0.8,
      7 + 42 * z,
    ];
  });
  const c = calibrateMag(sphere);
  assert.ok(c);
  near(c.offset[2], 7, 0.1);
  near(c.offset[0], 12, 0.3);
  const gyro: Vec[] = Array.from({ length: 150 }, () => [0.01, -0.005, 0.003]);
  const accel: Vec[] = Array.from({ length: 150 }, () => [0, 0, 9.80665]);
  assert.equal(
    stationaryBias(gyro, accel, [
      fromOrientation(0, 0, 0),
      fromOrientation(5, 0, 0),
    ]),
    null,
  );
  const bias = stationaryBias(gyro, accel);
  assert.ok(bias);
  bias.forEach((v, i) => near(v, gyro[0][i]));
  gyro[100] = [1, 0, 0];
  assert.equal(stationaryBias(gyro, accel), null);
});
test("Sky pointing round-trips both hemispheres; poles/zenith and declination sign handled", () => {
  const date = new Date("2026-11-17T10:20:00Z");
  for (const lat of [-70, -36, 0, 35, 80])
    for (const lon of [-170, 0, 174])
      for (const angles of [
        [25, 62, -21],
        [0, 0, 0],
        [145, -35, 15],
      ]) {
        const q = fromOrientation(...(angles as [number, number, number])),
          p = skyPoint(q, [0, 0, 1], 0, date, { lat, lon });
        assert.ok(p.ra !== null && p.dec !== null);
        const back = equatorialToHorizontal(
          p.ra,
          p.dec,
          lat,
          lstHours(date, lon),
        );
        near(back.alt, p.alt, 1e-5);
        if (p.az !== null) near(delta(back.az, p.az), 0, 1e-5);
      }
  assert.equal(skyPoint(fromOrientation(0, 0, 0), [0, 0, 1], 0, date).az, null);
  near(skyPoint(exp([0, 0, 0]), [0, 1, 0], 12, date).az!, 12);
  near(skyPoint(exp([0, 0, 0]), [0, 0, -1], 0, date).alt, -90);
});

test("Rear optical frame centres -Z, preserves right/up and never mirrors the sky", () => {
  const q = fromOrientation(0, 90, 0),
    frame = rearCameraFrame(q);
  const north = cameraProject([0, 1, 0], frame, 60, 0.5);
  assert.ok(north.visible);
  near(north.x, 0);
  near(north.y, 0);
  const east = cameraProject([0.1, 1, 0], frame, 60, 0.5),
    up = cameraProject([0, 1, 0.1], frame, 60, 0.5);
  assert.ok(east.x > 0 && up.y > 0);
  assert.equal(cameraProject([0, -1, 0], frame, 60, 0.5).visible, false);
  const rolled = rearCameraFrame(mul(q, exp([0, 0, Math.PI / 2])));
  near(cameraProject([0, 1, 0], rolled, 60, 0.5).x, 0);
  assert.ok(cameraProject([0.1, 1, 0], rolled, 60, 0.5).y < 0);
  const landscape = rearCameraFrame(q, 90);
  assert.ok(cameraProject([0.1, 1, 0], landscape, 60, 2).y < 0);
  for (const beta of [179.999, 180, 180.001]) {
    const zenith = rearCameraFrame(fromOrientation(40, beta, 0));
    const p = cameraProject(zenith.forward, zenith, 60, 1);
    near(p.x, 0);
    near(p.y, 0);
  }
});
test("Optical FOV is rectilinear; bounded gyro extrapolation cannot run away", () => {
  const frame = rearCameraFrame(fromOrientation(0, 90, 0));
  near(cameraProject([0, 1, Math.tan(Math.PI / 6)], frame, 60, 1).y, 1);
  const q = fromOrientation(0, 0, 0),
    rate: Vec = [0, 0, 1];
  near(norm(log(mul(conjugate(q), extrapolate(q, rate, 10)))), 0.1);
  near(norm(extrapolate(q, rate, 0.05)), 1);
  assert.deepEqual(extrapolate(q, null, 1), q);
  const portrait = cameraProject(
    [0.1, 1, 0.05],
    frame,
    verticalFovFromShortSide(50, 0.5),
    0.5,
  );
  const landscape = cameraProject(
    [0.1, 1, 0.05],
    rearCameraFrame(fromOrientation(0, 90, 0), 90),
    verticalFovFromShortSide(50, 2),
    2,
  );
  near((landscape.x * 780) / 2, (portrait.y * 780) / 2);
  near((landscape.y * 390) / 2, (-portrait.x * 390) / 2);
});
test("Diagnostics record the actual Kalman innovation, correction, gain and reference sign", () => {
  const filter = new AttitudeKalman();
  filter.update(fromOrientation(0, 0, 0));
  filter.update(fromOrientation(10, 0, 0), 5, 0.1, false);
  near(filter.residual[2], (10 * Math.PI) / 180);
  assert.ok(
    filter.correction[2] > 0 && filter.correction[2] < filter.residual[2],
  );
  assert.ok(filter.gain.every((r, i) => r[i] > 0 && r[i] < 1));
  assert.ok(filter.nis > 0 && Number.isFinite(filter.nis));
  const same = filter.q!.map((v) => -v) as typeof filter.q;
  filter.update(same!);
  assert.ok(
    filter.measured!.reduce((sum, v, i) => sum + v * filter.q![i], 0) > 0,
  );
});

test("Shared sky decoder preserves the complete packed J2000 catalog", () => {
  const raw = JSON.parse(
    readFileSync(
      new URL("../public/data/stars-mag7.json", import.meta.url),
      "utf8",
    ),
  );
  const { stars, count } = expandStars(raw);
  assert.equal(raw.e, "J2000");
  assert.equal(count, 15544);
  assert.equal(stars.length, count);
  assert.ok(
    stars.every(
      (s) =>
        s.ra >= 0 &&
        s.ra < 24 &&
        s.dec >= -90 &&
        s.dec <= 90 &&
        Number.isFinite(s.mag),
    ),
  );
  // Independent Buffer read avoids relying on the decoder's TypedArray construction.
  near(stars[0].ra, Buffer.from(raw.ra, "base64").readInt32LE(0) / 10000);
});
test("Every displayed dynamics/filter expression parses as strict KaTeX", () => {
  const source = readFileSync(
    new URL(
      "../src/components/mobile-sensors/FilterDynamics.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const expressions = [...source.matchAll(/String\.raw`([^`]+)`/g)].map(
    (m) => m[1],
  );
  assert.ok(expressions.length >= 9);
  for (const expression of expressions)
    assert.doesNotThrow(() =>
      katex.renderToString(expression, { throwOnError: true, strict: "error" }),
    );
});
