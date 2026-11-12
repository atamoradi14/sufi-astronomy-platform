/** Stellarium-style horizontal sky projection with free look + FOV. */

import { equatorialToHorizontal } from "@/lib/astronomy/sphere";
import { lstHours } from "@/lib/astronomy/time";

export type SkyStar = {
  id: number;
  ra: number;
  dec: number;
  mag: number;
  bv: number | null;
  n: string | null;
};

export type Look = {
  /** View-centre azimuth, degrees from north toward east (0–360). */
  az: number;
  /** View-centre altitude, degrees (−89…89). */
  alt: number;
  /** Vertical field of view in degrees. */
  fov: number;
};

type Vec3 = [number, number, number];

const DEG = Math.PI / 180;

/** Local horizontal unit vector: +X east, +Y north, +Z up. */
export function azAltToVec(azDeg: number, altDeg: number): Vec3 {
  const az = azDeg * DEG;
  const alt = altDeg * DEG;
  const c = Math.cos(alt);
  return [c * Math.sin(az), c * Math.cos(az), Math.sin(alt)];
}

function norm(v: Vec3): Vec3 {
  const n = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / n, v[1] / n, v[2] / n];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function dot(a: Vec3, b: Vec3) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/** Camera basis for look direction (handles near-zenith). */
export function lookBasis(look: Look): { forward: Vec3; right: Vec3; up: Vec3 } {
  const forward = azAltToVec(look.az, look.alt);
  const worldUp: Vec3 = Math.abs(forward[2]) > 0.98 ? [0, 1, 0] : [0, 0, 1];
  const right = norm(cross(forward, worldUp));
  // Recalculate up for orthonormal frame (sky "up" on screen)
  const up = norm(cross(right, forward));
  // Prefer world-up projected for more Stellarium-like roll near horizon
  const up2 = norm(cross(right, forward));
  void up;
  return { forward, right, up: up2 };
}

/**
 * Gnomonic projection onto the view plane (Stellarium-like).
 * Returns NDC-ish coords: x,y in roughly [-1,1] for objects in FOV.
 */
export function projectAzAlt(
  az: number,
  alt: number,
  look: Look,
): { x: number; y: number; visible: boolean; depth: number } {
  const { forward, right, up } = lookBasis(look);
  const s = azAltToVec(az, alt);
  const depth = dot(s, forward);
  if (depth <= 0.02) return { x: 0, y: 0, visible: false, depth };
  const dx = dot(s, right);
  const dy = dot(s, up);
  const half = Math.tan((look.fov * DEG) / 2);
  const x = dx / depth / half;
  const y = dy / depth / half;
  const visible = Math.hypot(x, y) < 1.35;
  return { x, y, visible, depth };
}

export function equatorialToAzAlt(
  ra: number,
  dec: number,
  lat: number,
  lon: number,
  date: Date,
): { az: number; alt: number } {
  const lst = lstHours(date, lon);
  return equatorialToHorizontal(ra, dec, lat, lst);
}

export function projectStar(
  star: SkyStar,
  lat: number,
  lon: number,
  date: Date,
  look: Look,
): { x: number; y: number; az: number; alt: number; visible: boolean } {
  const { az, alt } = equatorialToAzAlt(star.ra, star.dec, lat, lon, date);
  const p = projectAzAlt(az, alt, look);
  return {
    x: p.x,
    y: -p.y, // canvas Y down
    az,
    alt,
    visible: p.visible && alt > -5,
  };
}

/** Pan look by screen-pixel deltas (Stellarium drag). */
export function panLook(
  look: Look,
  dxPx: number,
  dyPx: number,
  viewWidth: number,
): Look {
  const degPerPx = look.fov / Math.max(120, viewWidth);
  let az = look.az - dxPx * degPerPx;
  let alt = look.alt + dyPx * degPerPx;
  az = ((az % 360) + 360) % 360;
  alt = Math.max(-85, Math.min(85, alt));
  return { ...look, az, alt };
}

export function zoomLook(look: Look, factor: number): Look {
  const fov = Math.max(8, Math.min(120, look.fov * factor));
  return { ...look, fov };
}

export function bvToColor(bv: number | null): string {
  if (bv == null) return "#e8e2d4";
  const t = Math.max(-0.4, Math.min(2.0, bv));
  if (t < 0.0) return "#9bbcff";
  if (t < 0.3) return "#cad7ff";
  if (t < 0.6) return "#f8f7ff";
  if (t < 1.0) return "#ffe9c8";
  if (t < 1.5) return "#ffd2a1";
  return "#ffb984";
}

export function magToRadius(mag: number, scale = 1): number {
  const r = scale * Math.max(0.45, 3.4 * Math.pow(2.512, (1.5 - mag) / 4));
  return Math.min(r, 8);
}
