import { test } from "node:test";
import assert from "node:assert/strict";
import {
  azAltToVec,
  createSkyProjector,
  dragLook,
  lookBasis,
  projectAzAlt,
  zoomLook,
  type Look,
} from "../src/lib/sky/project";
const close = (a: number, b: number, tolerance = 1e-8) =>
  assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);
test("Horizon-locked exploration keeps roll and altitude stable during horizontal drags", () => {
  let look: Look = { az: 180, alt: 35, fov: 75, horizonLocked: true };
  for (let i = 0; i < 100; i++) look = dragLook(look, 0.6, 0.4, 0.65, 0.4);
  close(look.alt, 35);
  close(look.roll ?? 0, 0);
  close(zoomLook(look, 0.8, 0.4, 0.3).roll ?? 0, 0);
});
const distance = (a: number[], b: number[]) =>
  Math.hypot(...a.map((v, i) => v - b[i]));

test("Stereographic scale agrees with the angular half-angle formula and inverse rays", () => {
  for (const fov of [8, 60, 120, 175]) {
    const look = { az: 0, alt: 0, fov };
    for (const theta of [-85, -30, 0, 30, 85]) {
      const p = projectAzAlt(theta, 0, look);
      close(
        p.x,
        Math.tan((theta * Math.PI) / 360) / Math.tan((fov * Math.PI) / 720),
      );
      close(p.y, 0);
      assert.ok(
        distance(
          createSkyProjector(look).unproject(p.x, p.y)!,
          azAltToVec(theta, 0),
        ) < 1e-9,
      );
    }
  }
  for (const alt of [-90, -30, 45, 89.999, 90])
    for (const roll of [-130, 0, 75]) {
      const projector = createSkyProjector({ az: 237, alt, roll, fov: 130 });
      for (const [x, y] of [
        [-2, 1],
        [0.4, -0.7],
        [0, 0],
      ]) {
        const ray = projector.unproject(x, y)!;
        const az = (Math.atan2(ray[0], ray[1]) * 180) / Math.PI;
        const altitude =
          (Math.atan2(ray[2], Math.hypot(ray[0], ray[1])) * 180) / Math.PI;
        const p = projector.project(az, altitude);
        close(p.x, x);
        close(p.y, y);
      }
    }
});

test("Ground mask intervals classify the same celestial hemisphere as inverse projection", () => {
  for (const alt of [-90, -35, -0.00001, 0, 0.00001, 35, 90])
    for (const roll of [-80, 0, 65]) {
      const p = createSkyProjector({ az: 120, alt, roll, fov: 145 });
      for (let y = -1; y <= 1; y += 0.1) {
        const spans = p.groundSpans(y, -2.1, 2.1);
        for (let x = -2.05; x <= 2.05; x += 0.073) {
          const vertical = p.unproject(x, y)![2];
          if (Math.abs(vertical) < 1e-8) continue;
          assert.equal(
            spans.some(([a, b]) => x > a && x < b),
            vertical < 0,
            JSON.stringify({ alt, roll, x, y }),
          );
        }
      }
    }
});

test("Pointer zoom and spherical dragging retain the grabbed direction, including through zenith", () => {
  for (const alt of [-89, 0, 35, 89.99, 90]) {
    const look: Look = { az: 170, alt, roll: 27, fov: 110 };
    const target = createSkyProjector(look).unproject(0.7, -0.3)!;
    const zoomed = zoomLook(look, 0.55, 0.7, -0.3);
    assert.ok(
      distance(createSkyProjector(zoomed).unproject(0.7, -0.3)!, target) < 1e-9,
    );
    const moved = dragLook(look, 0.7, -0.3, -0.2, 0.6);
    assert.ok(
      distance(createSkyProjector(moved).unproject(-0.2, 0.6)!, target) < 1e-9,
    );
    const frame = lookBasis(moved);
    close(
      frame.right.reduce((s, v, i) => s + v * frame.up[i], 0),
      0,
    );
  }
  let look: Look = { az: 180, alt: 88, fov: 90 };
  for (let i = 0; i < 50; i++) {
    const before = lookBasis(look);
    look = dragLook(look, 0, 0, 0, -0.02);
    const after = lookBasis(look);
    assert.ok(
      distance(before.up, after.up) < 0.04,
      "camera frame jumped at zenith",
    );
  }
});

test("All-sky dome places zenith at centre and every horizon bearing on the rim", () => {
  const look: Look = { az: 180, alt: 90, fov: 180, projection: "dome" };
  const p = createSkyProjector(look);
  for (let az = 0; az < 360; az += 15) {
    const horizon = p.project(az, 0);
    close(Math.hypot(horizon.x, horizon.y), 1);
    close(p.unproject(horizon.x, horizon.y)![2], 0);
    assert.equal(p.project(az, -1).visible, false);
  }
  const north = p.project(0, 0),
    east = p.project(90, 0);
  close(north.y, 1);
  close(east.x, -1);
  assert.equal(p.unproject(1.1, 0), null);
  assert.equal(zoomLook(look, 0.8).projection, "stereographic");
  const anchor = p.unproject(0.3, -0.1)!;
  const entered = zoomLook(look, 0.8, 0.3, -0.1, 0.18, -0.06);
  assert.ok(
    distance(createSkyProjector(entered).unproject(0.18, -0.06)!, anchor) <
      1e-9,
    "dome zoom retained the pointer across viewport scale changes",
  );
  assert.deepEqual(zoomLook(look, 1.2), look);
});
