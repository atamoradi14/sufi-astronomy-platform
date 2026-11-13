/** Spherical trigonometry after W.M. Smart, Textbook on Spherical Astronomy, Ch. I.
 *  Internal units: radians. `deg` wrappers are for the UI.
 */

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

export function d2r(d: number) {
  return d * DEG;
}
export function r2d(r: number) {
  return r * RAD;
}

function clamp(x: number, lo = -1, hi = 1) {
  return Math.min(hi, Math.max(lo, x));
}

/** Smart (A): cos a = cos b cos c + sin b sin c cos A */
export function cosineLawSide(a: number, b: number, C: number): number {
  return Math.acos(
    clamp(Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b) * Math.cos(C)),
  );
}

/** Smart polar of (A): cos A = −cos B cos C + sin B sin C cos a */
export function cosineLawAngle(A: number, B: number, c: number): number {
  return Math.acos(
    clamp(-Math.cos(A) * Math.cos(B) + Math.sin(A) * Math.sin(B) * Math.cos(c)),
  );
}

/** Angle A from three sides — rearrangement of (A), Smart (9). */
export function angleFromSides(a: number, b: number, c: number): number {
  return Math.acos(
    clamp(
      (Math.cos(a) - Math.cos(b) * Math.cos(c)) / (Math.sin(b) * Math.sin(c) + 1e-15),
    ),
  );
}

/** hav θ = (1 − cos θ)/2 = sin²(θ/2)  — Smart (21). */
export function hav(theta: number): number {
  const s = Math.sin(theta / 2);
  return s * s;
}

/** Smart (23): hav a = hav(b − c) + sin b sin c hav A */
export function haversineSide(b: number, c: number, A: number): number {
  const h = hav(b - c) + Math.sin(b) * Math.sin(c) * hav(A);
  return 2 * Math.asin(clamp(Math.sqrt(Math.max(0, h))));
}

/** Smart (B): sin a / sin A = sin b / sin B */
export function sineLawAngle(a: number, A: number, b: number): number {
  return Math.asin(clamp((Math.sin(b) * Math.sin(A)) / (Math.sin(a) + 1e-15)));
}

/** Smart (C), analogue formula:
 *  sin a cos B = cos b sin c − sin b cos c cos A
 */
export function analogueCosB(a: number, b: number, c: number, A: number): number {
  const num = Math.cos(b) * Math.sin(c) - Math.sin(b) * Math.cos(c) * Math.cos(A);
  return num / (Math.sin(a) + 1e-15);
}

/** Smart (D), four-parts:
 *  cos a cos C = sin a cot b − sin C cot B
 *  Memory: cos(inner side)·cos(inner angle)
 *         = sin(inner side)·cot(other side) − sin(inner angle)·cot(other angle)
 */
export function fourPartsCosC(a: number, b: number, B: number, C: number): number {
  return (
    Math.sin(a) * (1 / Math.tan(b)) - Math.sin(C) * (1 / Math.tan(B))
  ) / (Math.cos(a) + 1e-15);
}

/** Half-angle formulae Smart (11)–(13). s = (a+b+c)/2 */
export function halfAngleSine(a: number, b: number, c: number): number {
  const s = (a + b + c) / 2;
  return Math.sqrt(
    Math.max(0, (Math.sin(s - b) * Math.sin(s - c)) / (Math.sin(b) * Math.sin(c) + 1e-15)),
  );
}

export function halfAngleCosine(a: number, b: number, c: number): number {
  const s = (a + b + c) / 2;
  return Math.sqrt(
    Math.max(0, (Math.sin(s) * Math.sin(s - a)) / (Math.sin(b) * Math.sin(c) + 1e-15)),
  );
}

export function halfAngleTan(a: number, b: number, c: number): number {
  const s = (a + b + c) / 2;
  return Math.sqrt(
    Math.max(
      0,
      (Math.sin(s - b) * Math.sin(s - c)) / (Math.sin(s) * Math.sin(s - a) + 1e-15),
    ),
  );
}

/** Polar triangle: a′ = π − A, A′ = π − a (Smart §11). */
export function polarSide(angle: number): number {
  return Math.PI - angle;
}

/** Right-angled at C = 90°: cos c = cos a cos b (Napier). */
export function rightHypotenuse(a: number, b: number): number {
  return Math.acos(clamp(Math.cos(a) * Math.cos(b)));
}

/** Napier: sin a = sin A sin c  (C = 90°). */
export function rightLegFromHyp(A: number, c: number): number {
  return Math.asin(clamp(Math.sin(A) * Math.sin(c)));
}

/** Spherical excess E = A+B+C−π (Girard). Area on unit sphere = E. */
export function sphericalExcess(A: number, B: number, C: number): number {
  return A + B + C - Math.PI;
}

/** L'Huilier: tan(E/4) from three sides. */
export function excessLHuilier(a: number, b: number, c: number): number {
  const s = (a + b + c) / 2;
  const t = Math.sqrt(
    Math.max(
      0,
      Math.tan(s / 2) *
        Math.tan((s - a) / 2) *
        Math.tan((s - b) / 2) *
        Math.tan((s - c) / 2),
    ),
  );
  return 4 * Math.atan(t);
}

export function triangleArea(A: number, B: number, C: number, R = 1): number {
  return R * R * sphericalExcess(A, B, C);
}

export function sineLawCheck(a: number, A: number, b: number, B: number): number {
  return Math.sin(a) / Math.sin(A) - Math.sin(b) / Math.sin(B);
}

/** Small-circle arc: CD = AB sin PC  — Smart (1), PC from the pole of AB. */
export function smallCircleArc(greatArc: number, polarDist: number): number {
  return greatArc * Math.sin(polarDist);
}

/** Parallel of latitude: HX = LY cos θ  — Smart (2). */
export function parallelArc(equatorialArc: number, latitude: number): number {
  return equatorialArc * Math.cos(latitude);
}

/** PZX cosine, Smart II (3): cos z = sin φ sin δ + cos φ cos δ cos H */
export function zenithDistance(phi: number, delta: number, H: number): number {
  return Math.acos(
    clamp(
      Math.sin(phi) * Math.sin(delta) + Math.cos(phi) * Math.cos(delta) * Math.cos(H),
    ),
  );
}

/** Smart II (4): hav z = hav(φ − δ) + cos φ cos δ hav H */
export function zenithHaversine(phi: number, delta: number, H: number): number {
  const h = hav(phi - delta) + Math.cos(phi) * Math.cos(delta) * hav(H);
  return 2 * Math.asin(clamp(Math.sqrt(Math.max(0, h))));
}

/** Rising/setting: cos H₀ = −tan φ tan δ  (altitude 0). */
export function risingHourAngle(phi: number, delta: number): number | null {
  const c = -Math.tan(phi) * Math.tan(delta);
  if (c < -1 || c > 1) return null;
  return Math.acos(clamp(c));
}

/** Napier analogy (49): tan ½(a+b) = [cos ½(A−B) / cos ½(A+B)] tan ½c */
export function napierSumSides(A: number, B: number, c: number): number {
  const num = Math.cos((A - B) / 2) * Math.tan(c / 2);
  const den = Math.cos((A + B) / 2);
  return 2 * Math.atan2(num, den);
}

/** Delambre (45): sin ½c sin ½(A−B) = cos ½C sin ½(a−b) */
export function delambreCheck(a: number, b: number, c: number, A: number, B: number, C: number) {
  const left = Math.sin(c / 2) * Math.sin((A - B) / 2);
  const right = Math.cos(C / 2) * Math.sin((a - b) / 2);
  return left - right;
}

export const deg = {
  cosineLawSide: (a: number, b: number, C: number) =>
    r2d(cosineLawSide(d2r(a), d2r(b), d2r(C))),
  angleFromSides: (a: number, b: number, c: number) =>
    r2d(angleFromSides(d2r(a), d2r(b), d2r(c))),
  excess: (A: number, B: number, C: number) =>
    r2d(sphericalExcess(d2r(A), d2r(B), d2r(C))),
  excessLHuilier: (a: number, b: number, c: number) =>
    r2d(excessLHuilier(d2r(a), d2r(b), d2r(c))),
  areaUnit: (A: number, B: number, C: number) =>
    sphericalExcess(d2r(A), d2r(B), d2r(C)),
  haversineSide: (b: number, c: number, A: number) =>
    r2d(haversineSide(d2r(b), d2r(c), d2r(A))),
  analogueCosB: (a: number, b: number, c: number, A: number) =>
    analogueCosB(d2r(a), d2r(b), d2r(c), d2r(A)),
  halfAngleSine: (a: number, b: number, c: number) =>
    halfAngleSine(d2r(a), d2r(b), d2r(c)),
  zenithDistance: (phi: number, delta: number, H: number) =>
    r2d(zenithDistance(d2r(phi), d2r(delta), d2r(H))),
  zenithHaversine: (phi: number, delta: number, H: number) =>
    r2d(zenithHaversine(d2r(phi), d2r(delta), d2r(H))),
  risingHourAngle: (phi: number, delta: number) => {
    const h = risingHourAngle(d2r(phi), d2r(delta));
    return h == null ? null : r2d(h);
  },
  smallCircleArc: (great: number, polarDist: number) =>
    r2d(smallCircleArc(d2r(great), d2r(polarDist))),
  parallelArc: (eq: number, lat: number) => r2d(parallelArc(d2r(eq), d2r(lat))),
  rightHypotenuse: (a: number, b: number) => r2d(rightHypotenuse(d2r(a), d2r(b))),
};
