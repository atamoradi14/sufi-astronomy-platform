import { test } from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import * as g from "../src/lib/astronomy/sphereGeom";
import * as t from "../src/lib/astronomy/sphericalTrig";
import { equatorialToHorizontal } from "../src/lib/astronomy/sphere";
import { lookBasis, projectAzAlt } from "../src/lib/sky/project";
import { julianDay, gmstHours, lstHours } from "../src/lib/astronomy/time";
import { LESSONS } from "../src/lib/content/lessons";
import { PROOFS } from "../src/lib/content/proofs";
const close = (a: number, b: number, eps = 1e-9) =>
  assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);
test("Analytic octant: three right sides and angles, area one eighth of sphere", () => {
  const a: g.Vec3 = [1, 0, 0],
    b: g.Vec3 = [0, 1, 0],
    c: g.Vec3 = [0, 0, 1];
  close(g.angularDistanceDeg(a, b), 90);
  close(g.sphericalAngleDeg(a, b, c), 90);
  close(t.excessLHuilier(Math.PI / 2, Math.PI / 2, Math.PI / 2), Math.PI / 2);
});
test("Independent vector geometry checks the side, sine, analogue and four-parts identities", () => {
  for (let i = 1; i <= 120; i++) {
    const A = g.lonLatToCart(-70 + i * 0.31, 30 + i * 0.13),
      B = g.lonLatToCart(10 + i * 0.21, -20 + i * 0.11),
      C = g.lonLatToCart(70 + i * 0.19, 45 - i * 0.05);
    const a = t.d2r(g.angularDistanceDeg(B, C)),
      b = t.d2r(g.angularDistanceDeg(A, C)),
      c = t.d2r(g.angularDistanceDeg(A, B));
    const x = t.d2r(g.sphericalAngleDeg(B, A, C)),
      y = t.d2r(g.sphericalAngleDeg(A, B, C)),
      z = t.d2r(g.sphericalAngleDeg(A, C, B));
    close(t.cosineLawSide(b, c, x), a);
    close(t.haversineSide(b, c, x), a);
    close(t.sineLawCheck(a, x, b, y), 0);
    close(t.analogueCosB(a, b, c, x), Math.cos(y));
    close(
      Math.cos(a) * Math.cos(z),
      Math.sin(a) / Math.tan(b) - Math.sin(z) / Math.tan(y),
    );
    close(t.excessLHuilier(a, b, c), x + y + z - Math.PI);
    close(t.delambreCheck(a, b, c, x, y, z), 0);
    close(
      Math.sin(c / 2) * Math.cos((x - y) / 2),
      Math.sin(z / 2) * Math.sin((a + b) / 2),
    );
  }
});
test("Great and small circle samples remain on their exact planes and sphere", () => {
  const a = g.lonLatToCart(25, 35),
    b = g.lonLatToCart(75, -12),
    normal = g.normalize(g.cross(a, b));
  for (const p of g.greatArc(a, b)) {
    close(g.dot(p, p), 1);
    close(g.dot(p, normal), 0);
  }
  for (const p of g.smallCircle(a, 37)) {
    close(g.dot(p, p), 1);
    close(g.dot(p, a), Math.cos(t.d2r(37)));
  }
  for (const p of g.greatArc([1, 0, 0], [-1, 0, 0])) close(g.dot(p, p), 1);
  assert.ok(Number.isNaN(g.sphericalAngleDeg([1, 0, 0], [1, 0, 0], [0, 1, 0])));
});
test("PZX constructed sides equal coordinate-transform altitude in both hemispheres", () => {
  for (const lat of [-90, -65, -30, 0, 35, 80, 90])
    for (const dec of [-70, -15, 0, 25, 80])
      for (const H of [-170, -90, -20, 0, 40, 90, 175]) {
        const p = g.placePZX(lat, dec, H),
          h = equatorialToHorizontal(0, dec, lat, H / 15);
        close(90 - h.alt, p.ZX, 1e-7);
        const phi = t.d2r(lat),
          d = t.d2r(dec),
          hr = t.d2r(H);
        const east = -Math.cos(d) * Math.sin(hr),
          north =
            Math.sin(d) * Math.cos(phi) -
            Math.cos(d) * Math.sin(phi) * Math.cos(hr);
        if (Math.hypot(east, north) > 1e-8) {
          close(Math.sin(t.d2r(h.az)), east / Math.hypot(east, north), 1e-8);
          close(Math.cos(t.d2r(h.az)), north / Math.hypot(east, north), 1e-8);
        }
      }
});
test("Projection is continuous near zenith and does not discard wide-screen stars", () => {
  for (const alt of [0, 35, 78, 79, 80, 85, 89, 90]) {
    const l = { az: 120, alt, fov: 60 },
      b = lookBasis(l);
    close(g.dot(b.forward, b.right), 0);
    close(g.dot(b.forward, b.up), 0);
    close(g.dot(b.right, b.up), 0);
    const p = projectAzAlt(120, alt, l);
    close(p.x, 0);
    close(p.y, 0);
    assert.ok(p.visible);
  }
  const p = projectAzAlt(43, 0, { az: 0, alt: 0, fov: 60 });
  assert.ok(p.visible && p.x > 1.35);
  const a = lookBasis({ az: 40, alt: 78, fov: 60 }),
    b = lookBasis({ az: 40, alt: 79, fov: 60 });
  close(g.dot(a.right, b.right), 1);
});
test("Time reference: J2000 noon, east longitude and signed hour angle", () => {
  const d = new Date("2000-01-01T12:00:00Z");
  close(julianDay(d), 2451545);
  close(gmstHours(d), 18.697374558, 1e-8);
  close((lstHours(d, 30) - gmstHours(d) + 24) % 24, 2);
  close(equatorialToHorizontal(6, 0, 0, 0).az, 90);
  close(equatorialToHorizontal(18, 0, 0, 0).az, 270);
});
test("Reviewed numerical examples agree with computed geometry", () => {
  close(t.deg.cosineLawSide(70, 50, 30), 32.51492007556, 1e-10);
  close(t.deg.zenithDistance(35.7, 16.5, 30), 32.85373818179, 1e-10);
  close(
    t.deg.cosineLawSide(65 + 42 / 60, 53 + 13 / 60, 100 + 57 / 60),
    83.8140447196,
    1e-9,
  );
  close(t.deg.risingHourAngle(40, 15)!, 102.9932385943, 1e-9);
  close(t.deg.excessLHuilier(60, 60, 60), 31.5863380965, 1e-9);
});
test("Every authored TeX expression parses; lesson and proof links resolve and bilingual steps are complete", () => {
  const ids = new Set(LESSONS.map((l) => l.id));
  assert.equal(ids.size, LESSONS.length);
  const kinds = new Set(PROOFS.map((p) => p.kind));
  for (const l of LESSONS) {
    assert.ok(l.summaryFa && l.summaryEn);
    if (l.proofId) assert.ok(kinds.has(l.proofId as never));
    for (const s of l.sections) assert.ok(s.bodyFa && s.bodyEn);
    const expressions = [
      ...l.formulas.map((f) => f.tex ?? f.display),
      ...l.sections.map((s) => s.formula),
      ...l.exercises.map((ex) => ex.answer),
      ...(l.example?.steps.map((s) => s.formula) ?? []),
    ];
    for (const expression of expressions)
      if (expression && expression.includes("\\"))
        katex.renderToString(expression, { throwOnError: true, strict: false });
  }
  for (const p of PROOFS) {
    assert.ok(ids.has(p.lessonId));
    for (const s of p.steps) {
      assert.ok(s.bodyFa && s.bodyEn);
      katex.renderToString(s.formula, { throwOnError: true, strict: false });
    }
  }
});

test("Invalid triangles remain invalid rather than becoming clamped answers", () => {
  for (const sides of [
    [20, 30, 60],
    [0, 30, 30],
    [140, 140, 140],
    [180, 20, 20],
  ]) {
    const [a, b, c] = sides.map(t.d2r);
    assert.equal(t.isOrdinaryTriangle(a, b, c), false);
    assert.ok(Number.isNaN(t.angleFromSides(a, b, c)));
    assert.ok(Number.isNaN(t.excessLHuilier(a, b, c)));
  }
});
test("Rate equations match finite differences in both hemispheres; refraction reduces to Snell", () => {
  const eps = 1e-5;
  for (const phi of [-50, -20, 10, 35, 60])
    for (const dec of [-30, 0, 25])
      for (const H of [-100, -40, 30, 80]) {
        const mid = equatorialToHorizontal(0, dec, phi, H / 15),
          lo = equatorialToHorizontal(0, dec, phi, (H - eps) / 15),
          hi = equatorialToHorizontal(0, dec, phi, (H + eps) / 15);
        const h = t.d2r(mid.alt),
          p = t.d2r(phi),
          d = t.d2r(dec),
          hr = t.d2r(H),
          az = t.d2r(mid.az);
        close(
          (hi.alt - lo.alt) / (2 * eps),
          (-Math.cos(p) * Math.cos(d) * Math.sin(hr)) / Math.cos(h),
          1e-7,
        );
        close(
          (((hi.az - lo.az + 540) % 360) - 180) / (2 * eps),
          Math.sin(p) - Math.cos(p) * Math.tan(h) * Math.cos(az),
          1e-7,
        );
      }
  const zeta = t.d2r(30),
    mu = 1.00029,
    k = mu * Math.sin(zeta),
    n = 2000,
    delta = (mu - 1) / n;
  let integral = 0;
  for (let i = 0; i < n; i++) {
    const x = 1 + (i + 0.5) * delta;
    integral += (k / (x * Math.sqrt(x * x - k * k))) * delta;
  }
  close(integral, Math.asin(mu * Math.sin(zeta)) - zeta, 1e-11);
  close(
    (((mu - 1) * Math.tan(zeta) * 180) / Math.PI) * 3600,
    34.535242009,
    1e-6,
  );
});
