import { lonLatToCart, type Vec3 } from "@/lib/astronomy/sphereGeom";

/** ISS orbital inclination (degrees). */
export const ISS_INCLINATION_DEG = 51.64;

const DEG = Math.PI / 180;
const EARTH_RADIUS_KM = 6371;

/**
 * Circular orbit in the ECEF snapshot frame: inclination 51.64° and passing
 * through the current sub-satellite point. `ascending` is true while latitude
 * is increasing. Radius is Earth radii (1 = surface).
 */
export function issOrbitPoints(
  latDeg: number,
  lonDeg: number,
  ascending: boolean,
  radius = 1,
  steps = 180,
): Vec3[] {
  const I = ISS_INCLINATION_DEG * DEG;
  const lat = latDeg * DEG;
  const lon = lonDeg * DEG;
  const s = Math.max(-1, Math.min(1, Math.sin(lat) / Math.sin(I)));
  let u = Math.asin(s);
  if (!ascending) u = Math.PI - u;
  const dlon = Math.atan2(Math.cos(I) * Math.sin(u), Math.cos(u));
  const omega = lon - dlon;
  const pts: Vec3[] = [];
  for (let i = 0; i <= steps; i++) {
    const uu = (2 * Math.PI * i) / steps;
    const plat = Math.asin(Math.sin(I) * Math.sin(uu));
    const plon = omega + Math.atan2(Math.cos(I) * Math.sin(uu), Math.cos(uu));
    pts.push(lonLatToCart((plon * 180) / Math.PI, (plat * 180) / Math.PI, radius));
  }
  return pts;
}

export function issRadiusEarth(altKm: number | null | undefined): number {
  const alt = altKm == null || !Number.isFinite(altKm) ? 420 : altKm;
  return 1 + alt / EARTH_RADIUS_KM;
}
