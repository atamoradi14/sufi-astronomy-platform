import { toDeg, toRad } from "@/lib/geo/qibla";

/** Convert equatorial (RA hours, Dec deg) to horizontal (Az, Alt) for an observer. */
export function equatorialToHorizontal(
  raHours: number,
  decDeg: number,
  latDeg: number,
  lstHours: number,
): { az: number; alt: number; ha: number } {
  const ha = ((lstHours - raHours) * 15 + 540) % 360 - 180;
  const δ = toRad(decDeg);
  const φ = toRad(latDeg);
  const H = toRad(ha);
  const sinAlt =
    Math.sin(δ) * Math.sin(φ) + Math.cos(δ) * Math.cos(φ) * Math.cos(H);
  const alt = toDeg(Math.asin(clampAsin(sinAlt)));
  const cosAz =
    (Math.sin(δ) - Math.sin(toRad(alt)) * Math.sin(φ)) /
    (Math.cos(toRad(alt)) * Math.cos(φ) + 1e-12);
  let az = toDeg(Math.acos(clampAsin(cosAz)));
  if (Math.sin(H) > 0) az = 360 - az;
  return { az: (az + 360) % 360, alt, ha };
}

function clampAsin(x: number) {
  return Math.min(1, Math.max(-1, x));
}

/** Spherical law of cosines for angular distance. */
export function angularDistanceDeg(
  ra1h: number,
  dec1: number,
  ra2h: number,
  dec2: number,
): number {
  const α1 = toRad(ra1h * 15);
  const α2 = toRad(ra2h * 15);
  const δ1 = toRad(dec1);
  const δ2 = toRad(dec2);
  const cosC =
    Math.sin(δ1) * Math.sin(δ2) +
    Math.cos(δ1) * Math.cos(δ2) * Math.cos(α1 - α2);
  return toDeg(Math.acos(clampAsin(cosC)));
}

/** Spherical triangle: given sides a,b and included angle C, return side c. */
export function sphericalSideFromAngle(
  aDeg: number,
  bDeg: number,
  CDeg: number,
): number {
  const a = toRad(aDeg);
  const b = toRad(bDeg);
  const C = toRad(CDeg);
  const cosC =
    Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b) * Math.cos(C);
  return toDeg(Math.acos(clampAsin(cosC)));
}

/** Spherical excess / area of triangle on unit sphere (Girard). */
export function sphericalExcessDeg(A: number, B: number, C: number): number {
  return A + B + C - 180;
}

export function normalizeHours(h: number): number {
  return ((h % 24) + 24) % 24;
}

export function normalizeDegrees(d: number): number {
  return ((d % 360) + 360) % 360;
}
