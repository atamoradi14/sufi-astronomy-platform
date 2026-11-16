import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_ORBIT,
  MU,
  EARTH_RADIUS_KM,
  orbitState,
  validateElements,
  lvlhQuaternion,
  earthOccults,
} from "../src/lib/satellite/orbit";
import { rotate } from "../src/lib/mobile-sensors/math";
test("Kepler propagation conserves energy, closes an orbit and respects inclination", () => {
  const o = { ...DEFAULT_ORBIT, e: 0, i: 90, raan: 0, argp: 0, meanAnomaly: 0 };
  const t = Date.parse(o.epoch),
    initial = orbitState(o, new Date(t));
  assert.ok(Math.abs(initial.period - 5676.978) < 1);
  const quarter = orbitState(o, new Date(t + initial.period * 250));
  assert.ok(Math.abs(quarter.r[2] - o.a) < 0.01);
  assert.ok(Math.abs(quarter.r[1]) < 0.01);
  const end = orbitState(o, new Date(t + initial.period * 1000));
  assert.ok(Math.hypot(...end.r.map((v, i) => v - initial.r[i])) < 0.01);
  const eccentric = { ...o, e: 0.3, a: 14000 };
  for (let k = 0; k < 20; k++) {
    const s = orbitState(eccentric, new Date(t + k * 900000));
    const energy = Math.hypot(...s.v) ** 2 / 2 - MU / Math.hypot(...s.r);
    assert.ok(Math.abs(energy + MU / (2 * eccentric.a)) < 1e-10);
  }
});
test("LVLH axes and Earth occultation use consistent physical frames", () => {
  const r: [number, number, number] = [7000, 0, 0],
    v: [number, number, number] = [0, 7.5, 0];
  const q = lvlhQuaternion(r, v);
  assert.ok(
    Math.hypot(...rotate(q, [1, 0, 0]).map((x, i) => x - [0, 1, 0][i])) < 1e-12,
  );
  assert.ok(
    Math.hypot(...rotate(q, [0, 0, 1]).map((x, i) => x - [-1, 0, 0][i])) <
      1e-12,
  );
  assert.equal(earthOccults(r, [-1, 0, 0]), true);
  assert.equal(earthOccults(r, [1, 0, 0]), false);
  assert.equal(earthOccults(r, [0, 1, 0]), false);
  assert.equal(
    validateElements({ ...DEFAULT_ORBIT, a: EARTH_RADIUS_KM, e: 0 }) !== null,
    true,
  );
  assert.equal(validateElements({ ...DEFAULT_ORBIT, e: 1 }) !== null, true);
});
