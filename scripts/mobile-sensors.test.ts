import { test } from "node:test";
import assert from "node:assert/strict";
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
import { equatorialToHorizontal } from "../src/lib/astronomy/sphere";
import { lstHours } from "../src/lib/astronomy/time";
const near = (a: number, b: number, tol = 1e-6) =>
  assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);
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
