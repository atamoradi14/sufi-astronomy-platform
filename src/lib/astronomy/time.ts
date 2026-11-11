import { normalizeHours } from "@/lib/astronomy/sphere";

/** Julian Day Number (UTC). */
export function julianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const D =
    date.getUTCDate() +
    (date.getUTCHours() +
      (date.getUTCMinutes() + date.getUTCSeconds() / 60) / 60) /
      24;
  let Y = y;
  let M = m;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
}

/** Greenwich Mean Sidereal Time in hours. */
export function gmstHours(date: Date): number {
  const JD = julianDay(date);
  const T = (JD - 2451545.0) / 36525;
  let theta =
    280.46061837 +
    360.98564736629 * (JD - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000;
  theta = ((theta % 360) + 360) % 360;
  return theta / 15;
}

/** Local Sidereal Time in hours for longitude (east positive). */
export function lstHours(date: Date, lonDeg: number): number {
  return normalizeHours(gmstHours(date) + lonDeg / 15);
}

/** Approximate solar RA/Dec (low precision, good for teaching). */
export function sunEquatorial(date: Date): { ra: number; dec: number } {
  const JD = julianDay(date);
  const n = JD - 2451545.0;
  const L = ((280.46 + 0.9856474 * n) % 360 + 360) % 360;
  const g = (((357.528 + 0.9856003 * n) % 360) + 360) % 360;
  const λ =
    L +
    1.915 * Math.sin((g * Math.PI) / 180) +
    0.02 * Math.sin((2 * g * Math.PI) / 180);
  const ε = 23.439 - 0.0000004 * n;
  const λr = (λ * Math.PI) / 180;
  const εr = (ε * Math.PI) / 180;
  const ra = Math.atan2(Math.cos(εr) * Math.sin(λr), Math.cos(λr));
  const dec = Math.asin(Math.sin(εr) * Math.sin(λr));
  return {
    ra: normalizeHours((ra * 180) / Math.PI / 15),
    dec: (dec * 180) / Math.PI,
  };
}

export function equationOfTimeMinutes(date: Date): number {
  const sun = sunEquatorial(date);
  const JD = julianDay(date);
  const n = JD - 2451545.0;
  const L = ((280.46 + 0.9856474 * n) % 360 + 360) % 360;
  const raDeg = sun.ra * 15;
  let eot = 4 * (L - raDeg);
  if (eot > 720) eot -= 1440;
  if (eot < -720) eot += 1440;
  return eot;
}

export type AstroClock = {
  utc: Date;
  jd: number;
  gmst: number;
  lst: number;
  solarRa: number;
  solarDec: number;
  eotMin: number;
};

export function computeAstroClock(date: Date, lonDeg: number): AstroClock {
  const sun = sunEquatorial(date);
  return {
    utc: date,
    jd: julianDay(date),
    gmst: gmstHours(date),
    lst: lstHours(date, lonDeg),
    solarRa: sun.ra,
    solarDec: sun.dec,
    eotMin: equationOfTimeMinutes(date),
  };
}
