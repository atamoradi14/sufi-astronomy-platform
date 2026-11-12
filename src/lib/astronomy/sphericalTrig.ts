/** Accurate spherical trigonometry (Smart Ch. I conventions; radians internally). */

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

/** Smart: cos c = cos a cos b + sin a sin b cos C  (sides & included angle in radians) */
export function cosineLawSide(a: number, b: number, C: number): number {
  return Math.acos(
    clamp(Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b) * Math.cos(C)),
  );
}

/** Smart polar: cos C = −cos A cos B + sin A sin B cos c */
export function cosineLawAngle(A: number, B: number, c: number): number {
  return Math.acos(
    clamp(-Math.cos(A) * Math.cos(B) + Math.sin(A) * Math.sin(B) * Math.cos(c)),
  );
}

/** Angle A from three sides (cosine rule rearranged). */
export function angleFromSides(a: number, b: number, c: number): number {
  return Math.acos(
    clamp((Math.cos(a) - Math.cos(b) * Math.cos(c)) / (Math.sin(b) * Math.sin(c) + 1e-15)),
  );
}

/** Spherical excess E = A+B+C−π (Girard). Area on unit sphere = E (steradians). */
export function sphericalExcess(A: number, B: number, C: number): number {
  return A + B + C - Math.PI;
}

/** L'Huilier: tan(E/4) from three sides (numerically stable for small triangles). */
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

/** Area on sphere of radius R: R² E */
export function triangleArea(A: number, B: number, C: number, R = 1): number {
  return R * R * sphericalExcess(A, B, C);
}

export function sineLawCheck(
  a: number,
  A: number,
  b: number,
  B: number,
): number {
  return Math.sin(a) / Math.sin(A) - Math.sin(b) / Math.sin(B);
}

/** Deg wrappers for UI */
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
};
