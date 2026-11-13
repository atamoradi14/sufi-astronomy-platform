/** Sexagesimal helpers used by Smart’s numerical examples. */

export function dms(d: number, m = 0, s = 0): number {
  const sign = d < 0 || m < 0 || s < 0 ? -1 : 1;
  return sign * (Math.abs(d) + Math.abs(m) / 60 + Math.abs(s) / 3600);
}

export function toDms(deg: number): { d: number; m: number; s: number; sign: 1 | -1 } {
  const sign: 1 | -1 = deg < 0 ? -1 : 1;
  let x = Math.abs(deg);
  const d = Math.floor(x);
  x = (x - d) * 60;
  const m = Math.floor(x + 1e-10);
  const s = (x - m) * 60;
  return { d, m, s, sign };
}

export function formatDms(deg: number, seconds = 1): string {
  const { d, m, s, sign } = toDms(deg);
  const ss = Math.abs(s).toFixed(seconds);
  const pad = ss.startsWith("60") ? 0 : Number(ss);
  return `${sign < 0 ? "−" : ""}${d}° ${m}′ ${pad}″`;
}

/** 1 nautical mile = 1′ of great-circle arc on Smart’s spherical Earth. */
export function nauticalMiles(arcDeg: number): number {
  return arcDeg * 60;
}

export const ARCSEC_PER_RADIAN = 206265;
export const DEG_PER_HOUR = 15;
