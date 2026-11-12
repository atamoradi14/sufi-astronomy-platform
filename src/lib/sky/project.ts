/** Horizontal projection for live sky (stereographic from zenith). */

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

export function projectStar(
  star: SkyStar,
  lat: number,
  lon: number,
  date: Date,
): { x: number; y: number; az: number; alt: number; visible: boolean } {
  const lst = lstHours(date, lon);
  const { az, alt } = equatorialToHorizontal(star.ra, star.dec, lat, lst);
  // Stereographic from zenith: r = k * tan((90-alt)/2)
  const z = 90 - alt;
  if (alt <= -1) return { x: 0, y: 0, az, alt, visible: false };
  const r = Math.tan(((z / 2) * Math.PI) / 180);
  // north up: az=0 → top of chart
  const ang = ((-az) * Math.PI) / 180;
  const scale = 0.92; // fit in unit disk
  const rr = Math.min(r * scale, 1.2);
  return {
    x: rr * Math.sin(ang),
    y: -rr * Math.cos(ang),
    az,
    alt,
    visible: alt > -0.5 && rr <= 1.05,
  };
}

export function bvToColor(bv: number | null): string {
  if (bv == null) return "#e8e2d4";
  // Rough blackbody → RGB for sky display
  const t = Math.max(-0.4, Math.min(2.0, bv));
  if (t < 0.0) return "#9bbcff";
  if (t < 0.3) return "#cad7ff";
  if (t < 0.6) return "#f8f7ff";
  if (t < 1.0) return "#ffe9c8";
  if (t < 1.5) return "#ffd2a1";
  return "#ffb984";
}

export function magToRadius(mag: number, scale = 1): number {
  const r = scale * Math.max(0.4, 3.2 * Math.pow(2.512, (1.5 - mag) / 4));
  return Math.min(r, 7);
}
