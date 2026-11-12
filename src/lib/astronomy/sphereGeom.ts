/** Geometry helpers for drawing great/small circles and spherical triangles. */

export type Vec3 = [number, number, number];

const DEG = Math.PI / 180;

export function sphToCart(raDeg: number, decDeg: number, r = 1): Vec3 {
  const λ = raDeg * DEG;
  const β = decDeg * DEG;
  return [
    r * Math.cos(β) * Math.cos(λ),
    r * Math.sin(β),
    r * Math.cos(β) * Math.sin(λ),
  ];
}

/** Longitude/latitude style → cart (λ around Y, φ from equator). */
export function lonLatToCart(lonDeg: number, latDeg: number, r = 1): Vec3 {
  return sphToCart(lonDeg, latDeg, r);
}

export function cartToLonLat(v: Vec3): { lon: number; lat: number } {
  const [x, y, z] = v;
  const r = Math.hypot(x, y, z) || 1;
  return {
    lon: (Math.atan2(z, x) * 180) / Math.PI,
    lat: (Math.asin(y / r) * 180) / Math.PI,
  };
}

/** Great circle through two directions (unit vectors), sampled. */
export function greatCircleThrough(
  a: Vec3,
  b: Vec3,
  steps = 128,
): Vec3[] {
  const A = normalize(a);
  const B = normalize(b);
  const n = normalize(cross(A, B));
  // If nearly antipodal/parallel, pick an axis
  const axis = Math.hypot(...n) < 1e-8 ? orthogonal(A) : n;
  const u = A;
  const v = normalize(cross(axis, u));
  const pts: Vec3[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (2 * Math.PI * i) / steps;
    pts.push([
      Math.cos(t) * u[0] + Math.sin(t) * v[0],
      Math.cos(t) * u[1] + Math.sin(t) * v[1],
      Math.cos(t) * u[2] + Math.sin(t) * v[2],
    ]);
  }
  return pts;
}

/** Arc of great circle from A to B (shorter arc). */
export function greatArc(a: Vec3, b: Vec3, steps = 64): Vec3[] {
  const A = normalize(a);
  const B = normalize(b);
  const cosθ = clamp(dot(A, B), -1, 1);
  const θ = Math.acos(cosθ);
  if (θ < 1e-8) return [A, B];
  const pts: Vec3[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const s0 = Math.sin((1 - t) * θ) / Math.sin(θ);
    const s1 = Math.sin(t * θ) / Math.sin(θ);
    pts.push(normalize([
      s0 * A[0] + s1 * B[0],
      s0 * A[1] + s1 * B[1],
      s0 * A[2] + s1 * B[2],
    ]));
  }
  return pts;
}

/**
 * Small circle: locus of points at angular distance α from pole P.
 * Plane is offset from center by cos(α) along pole.
 */
export function smallCircle(
  pole: Vec3,
  angularRadiusDeg: number,
  steps = 96,
): Vec3[] {
  const P = normalize(pole);
  const α = angularRadiusDeg * DEG;
  const c = Math.cos(α);
  const s = Math.sin(α);
  const u = orthogonal(P);
  const v = normalize(cross(P, u));
  const pts: Vec3[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (2 * Math.PI * i) / steps;
    pts.push([
      c * P[0] + s * (Math.cos(t) * u[0] + Math.sin(t) * v[0]),
      c * P[1] + s * (Math.cos(t) * u[1] + Math.sin(t) * v[1]),
      c * P[2] + s * (Math.cos(t) * u[2] + Math.sin(t) * v[2]),
    ]);
  }
  return pts;
}

/** Equator: great circle with pole = +Y */
export function equatorCircle(steps = 128): Vec3[] {
  return smallCircle([0, 1, 0], 90, steps);
}

/** Meridian at longitude λ (degrees): great circle through poles and (λ,0). */
export function meridianCircle(lonDeg: number, steps = 128): Vec3[] {
  return greatCircleThrough([0, 1, 0], lonLatToCart(lonDeg, 0), steps);
}

/** Parallel of latitude (small circle). */
export function parallelCircle(latDeg: number, steps = 96): Vec3[] {
  return smallCircle([0, 1, 0], 90 - latDeg, steps);
}

export function angularDistanceDeg(a: Vec3, b: Vec3): number {
  return (Math.acos(clamp(dot(normalize(a), normalize(b)), -1, 1)) * 180) / Math.PI;
}

/** Spherical angle at B between points A-B-C (degrees). */
export function sphericalAngleDeg(A: Vec3, B: Vec3, C: Vec3): number {
  const b = normalize(B);
  const ta = normalize(reject(normalize(A), b));
  const tc = normalize(reject(normalize(C), b));
  return (Math.acos(clamp(dot(ta, tc), -1, 1)) * 180) / Math.PI;
}

export function normalize(v: Vec3): Vec3 {
  const n = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / n, v[1] / n, v[2] / n];
}

export function dot(a: Vec3, b: Vec3) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function reject(v: Vec3, n: Vec3): Vec3 {
  const d = dot(v, n);
  return [v[0] - d * n[0], v[1] - d * n[1], v[2] - d * n[2]];
}

function orthogonal(v: Vec3): Vec3 {
  const a: Vec3 = Math.abs(v[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
  return normalize(cross(v, a));
}

function clamp(x: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, x));
}

/** Spherical law of cosines for sides (degrees in/out). */
export function cosineLawSide(a: number, b: number, C: number): number {
  const ar = a * DEG;
  const br = b * DEG;
  const Cr = C * DEG;
  return (
    (Math.acos(
      clamp(
        Math.cos(ar) * Math.cos(br) + Math.sin(ar) * Math.sin(br) * Math.cos(Cr),
        -1,
        1,
      ),
    ) *
      180) /
    Math.PI
  );
}

/** Spherical law of sines: sin a / sin A */
export function sineLawRatio(sideDeg: number, angleDeg: number): number {
  return Math.sin(sideDeg * DEG) / Math.sin(angleDeg * DEG);
}

/**
 * Place spherical triangle from three sides (degrees).
 * Vertex A at north pole; side c along lon=0; angle at A = longitude of C.
 */
export function placeTriangleFromSides(
  a: number,
  b: number,
  c: number,
): { A: Vec3; B: Vec3; C: Vec3; angleA: number } {
  const angleA = sphericalAngleAtPole(b, c, a);
  return {
    A: lonLatToCart(0, 90),
    B: lonLatToCart(0, 90 - c),
    C: lonLatToCart(angleA, 90 - b),
    angleA,
  };
}

/** Angle at A when A is at the pole: cos a = cos b cos c + sin b sin c cos A */
function sphericalAngleAtPole(b: number, c: number, a: number): number {
  const br = b * DEG;
  const cr = c * DEG;
  const ar = a * DEG;
  const cosA =
    (Math.cos(ar) - Math.cos(br) * Math.cos(cr)) /
    (Math.sin(br) * Math.sin(cr) + 1e-15);
  return (Math.acos(clamp(cosA, -1, 1)) * 180) / Math.PI;
}

/** Two sides and included angle → third side, then place. */
export function placeTriangleSAS(
  b: number,
  C: number,
  a: number,
): { A: Vec3; B: Vec3; C: Vec3; sideC: number } {
  const sideC = cosineLawSide(a, b, C);
  const placed = placeTriangleFromSides(a, b, sideC);
  return { ...placed, sideC };
}

/**
 * Napier analogy: tan(c/2) from a,b,A,B (degrees).
 * Used after sine-law gets the second angle (SSA).
 */
export function sideFromNapier(
  a: number,
  b: number,
  A: number,
  B: number,
): number {
  const ar = a * DEG;
  const br = b * DEG;
  const Ar = A * DEG;
  const Br = B * DEG;
  const tanHalf =
    (Math.tan((ar + br) / 2) * Math.cos((Ar + Br) / 2)) /
    (Math.cos((Ar - Br) / 2) + 1e-15);
  return (2 * Math.atan(tanHalf) * 180) / Math.PI;
}

/** Astronomical triangle PZX for observer latitude φ, star δ, hour angle H (all degrees). */
export function placePZX(
  phi: number,
  delta: number,
  H: number,
): { P: Vec3; Z: Vec3; X: Vec3; PZ: number; PX: number; ZX: number } {
  // Celestial sphere: NCP at +Y; observer meridian at lon=0.
  // Zenith Z is at lat=φ on the meridian (lon=0).
  // Star X: hour angle H measured west from meridian → lon = -H, lat = δ.
  const P = lonLatToCart(0, 90);
  const Z = lonLatToCart(0, phi);
  const X = lonLatToCart(-H, delta);
  return {
    P,
    Z,
    X,
    PZ: 90 - phi,
    PX: 90 - delta,
    ZX: angularDistanceDeg(Z, X),
  };
}

/** Equilateral spherical triangle with given side length (degrees). */
export function placeEquilateral(side: number) {
  return placeTriangleFromSides(side, side, side);
}
