import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { decodeCatalog } from "../src/lib/sensor/catalog";
import { detectStars } from "../src/lib/sensor/detect";
import {
  angleRad,
  det3,
  matVec,
  radecToVec,
  rodrigues,
  svd3,
  vecToRaDec,
  wahba,
  type Mat3,
  type Vec3,
} from "../src/lib/sensor/math";
import { reducePlace, skyContext } from "../src/lib/sensor/place";
import { addNoise, renderPlate } from "../src/lib/sensor/render";
import {
  apparentToPixel,
  cameraFromBoresight,
  pixelToIcrs,
  solvePlate,
} from "../src/lib/sensor/solve";
import { ARCSEC_PER_RAD } from "../src/lib/sensor/math";

const cat = decodeCatalog(
  JSON.parse(readFileSync("public/data/sensor-catalog.json", "utf8")),
);

function sepArcsec(a: Vec3, b: Vec3) {
  return angleRad(a, b) * ARCSEC_PER_RAD;
}

test("3×3 SVD reconstructs a matrix and Wahba recovers a rotation", () => {
  const A: Mat3 = [1.2, -0.4, 0.3, 0.2, 2.1, -0.7, -0.5, 0.3, 0.8];
  const { u, s, v } = svd3(A);
  const us = u.map((value, i) => value * s[i % 3]) as Mat3;
  // U diag(s) is not a row scale; rebuild explicitly.
  const usv: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      let sum = 0;
      for (let k = 0; k < 3; k++) sum += u[r * 3 + k] * s[k] * v[c * 3 + k];
      usv[r * 3 + c] = sum;
    }
  }
  for (let i = 0; i < 9; i++) assert.ok(Math.abs(usv[i] - A[i]) < 1e-8, `${usv[i]} != ${A[i]}`);
  void us;
  const R = rodrigues([0.2, -0.35, 0.5]);
  const cams: Vec3[] = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [0.3, 0.4, 0.8],
  ].map((v) => {
    const n = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / n, v[1] / n, v[2] / n] as Vec3;
  });
  const cats = cams.map((v) => matVec(R, v));
  const got = wahba(cams, cats, cams.map(() => 1));
  for (const c of cams) {
    const back = matVec(got, c);
    const truth = matVec(R, c);
    assert.ok(sepArcsec(back, truth) < 0.01);
  }
  assert.ok(Math.abs(det3(got) - 1) < 1e-8);
});

test("camera boresight round-trips to the same ICRS direction", () => {
  const cam = cameraFromBoresight(83.2, -12.4, 25, 4200, 900, 700);
  const back = vecToRaDec(pixelToIcrs(cam, 449.5, 349.5, null));
  const a = radecToVec(83.2, -12.4);
  const b = radecToVec(back.raDeg, back.decDeg);
  assert.ok(sepArcsec(a, b) < 0.05, `${sepArcsec(a, b)}`);
});

test("lost-in-space solve recovers the plate to a few arcseconds", () => {
  const width = 960;
  const height = 720;
  const truth = cameraFromBoresight(78.4, 8.6, 18, 3900, width, height, -0.06, 0.01);
  const ctx = { jd: cat.epochJd };
  const projected: { x: number; y: number; flux: number; peak: number }[] = [];
  for (let i = 0; i < cat.n; i++) {
    if (cat.mag100[i] / 100 > 6.2) continue;
    const v = [
      Math.cos((cat.decI[i] / 1e6) * Math.PI / 180) * Math.cos((cat.raU[i] / 1e6) * Math.PI / 180),
      Math.cos((cat.decI[i] / 1e6) * Math.PI / 180) * Math.sin((cat.raU[i] / 1e6) * Math.PI / 180),
      Math.sin((cat.decI[i] / 1e6) * Math.PI / 180),
    ] as Vec3;
    const pix = apparentToPixel(truth, v);
    if (!pix || pix.x < 8 || pix.y < 8 || pix.x > width - 8 || pix.y > height - 8) continue;
    projected.push({
      x: pix.x + (((i * 17) % 5) - 2) * 0.02,
      y: pix.y + (((i * 9) % 5) - 2) * 0.02,
      flux: 1000 / (1 + Math.max(0, cat.mag100[i] / 100)),
      peak: 50,
    });
  }
  projected.sort((a, b) => b.flux - a.flux);
  const solved = solvePlate(cat, projected.slice(0, 80), width, height, ctx);
  assert.equal(solved.ok, true);
  if (!solved.ok) return;
  const center = radecToVec(solved.raDeg, solved.decDeg);
  const expect = radecToVec(78.4, 8.6);
  const err = sepArcsec(center, expect);
  assert.ok(err < 5, `center error ${err.toFixed(2)}″ rms ${solved.rmsArcsec.toFixed(2)}″ inliers ${solved.inliers}`);
  assert.ok(solved.rmsArcsec < 8, `rms ${solved.rmsArcsec}`);
  assert.ok(Math.abs(solved.camera.k1 + 0.06) < 0.03, `k1 ${solved.camera.k1}`);
  const named = solved.stars.filter((s) => s.matched && s.name);
  assert.ok(named.length >= 3, `named ${named.length}`);
  for (const star of named.slice(0, 8)) {
    const pix = apparentToPixel(truth, radecToVec(star.raDeg, star.decDeg));
    assert.ok(pix);
    if (!pix) continue;
    const back = vecToRaDec(pixelToIcrs(truth, star.x, star.y, null));
    const e = sepArcsec(radecToVec(back.raDeg, back.decDeg), radecToVec(star.raDeg, star.decDeg));
    assert.ok(e < 8, `${star.name} ${e.toFixed(1)}″`);
  }
});

test("wide distorted plate still places the center to a few arcseconds", () => {
  const width = 900;
  const height = 700;
  const fov = 52;
  const f = height / 2 / Math.tan(((fov * Math.PI) / 180) / 2);
  const truth = cameraFromBoresight(140, -8, 11, f, width, height, -0.08, 0.015);
  const ctx = { jd: cat.epochJd };
  const projected: { x: number; y: number; flux: number; peak: number }[] = [];
  for (let i = 0; i < cat.indexN; i++) {
    const dec = (cat.decI[i] / 1e6) * Math.PI / 180;
    const ra = (cat.raU[i] / 1e6) * Math.PI / 180;
    const v = [
      Math.cos(dec) * Math.cos(ra),
      Math.cos(dec) * Math.sin(ra),
      Math.sin(dec),
    ] as Vec3;
    const pix = apparentToPixel(truth, v);
    if (!pix || pix.x < 6 || pix.y < 6 || pix.x > width - 6 || pix.y > height - 6) continue;
    projected.push({
      x: pix.x + (((i * 3) % 5) - 2) * 0.04,
      y: pix.y + (((i * 7) % 5) - 2) * 0.04,
      flux: 1000 / (1 + Math.max(0, cat.mag100[i] / 100)),
      peak: 40,
    });
  }
  const solved = solvePlate(cat, projected, width, height, ctx);
  assert.equal(solved.ok, true);
  if (!solved.ok) return;
  const err = sepArcsec(radecToVec(solved.raDeg, solved.decDeg), radecToVec(140, -8));
  assert.ok(err < 15, `center ${err.toFixed(2)}″ inliers ${solved.inliers}`);
  assert.ok(Math.abs(solved.camera.k1 + 0.08) < 0.05, `k1 ${solved.camera.k1}`);
});

test("detector plus solver on a rendered plate stays within a few arcseconds", () => {
  const width = 880;
  const height = 660;
  const truth = cameraFromBoresight(56, 24, -12, 3600, width, height);
  const ctx = { jd: cat.epochJd };
  const plate = renderPlate(cat, truth, ctx, width, height, 6.1);
  addNoise(plate.gray, 1.4, 7);
  const dets = detectStars(plate.gray, width, height);
  assert.ok(dets.length >= 8, `detections ${dets.length} truth ${plate.truth.length}`);
  const solved = solvePlate(cat, dets, width, height, ctx);
  assert.equal(solved.ok, true);
  if (!solved.ok) return;
  const err = sepArcsec(
    radecToVec(solved.raDeg, solved.decDeg),
    radecToVec(56, 24),
  );
  assert.ok(err < 12, `center ${err.toFixed(2)}″ scale ${solved.plateScaleArcsec.toFixed(1)}″/px inliers ${solved.inliers}`);
  let worst = 0;
  for (const star of plate.truth.slice(0, 15)) {
    const nearest = dets.reduce((best, d) => {
      const dd = (d.x - star.x) ** 2 + (d.y - star.y) ** 2;
      return dd < best.d ? { d: dd, c: d } : best;
    }, { d: 1e9, c: dets[0] });
    if (nearest.d < 1) worst = Math.max(worst, Math.sqrt(nearest.d));
  }
  assert.ok(worst < 0.75, `centroid ${worst.toFixed(3)} px`);
});

test("apparent altitude includes refraction and differs from the J2000 horizon shortcut", () => {
  const site = {
    lat: 35.6892,
    lon: 51.389,
    height: 1200,
    date: new Date("2026-03-21T00:00:00Z"),
  };
  const ctx = skyContext(site);
  assert.ok(ctx.beta);
  const sirius = radecToVec((6.752481 * 15), -16.716116);
  const place = reducePlace(sirius, site, ctx.beta!);
  assert.ok(place.refractionArcsec > 0 && place.refractionArcsec < 2000);
  assert.ok(place.altDeg > -90 && place.altDeg < 90);
  assert.ok(place.azDeg >= 0 && place.azDeg < 360);
  const shift = sepArcsec(sirius, [
    Math.cos(place.decAppDeg * Math.PI / 180) * Math.cos(place.raAppHours * 15 * Math.PI / 180),
    Math.cos(place.decAppDeg * Math.PI / 180) * Math.sin(place.raAppHours * 15 * Math.PI / 180),
    Math.sin(place.decAppDeg * Math.PI / 180),
  ]);
  assert.ok(shift > 200, `of-date shift ${shift}″`);
});
