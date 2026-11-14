/**
 * Teaching-grade live ephemeris (Meeus-style approximations).
 * Good for olympiad demos; not a JPL SPICE replacement.
 */

import { equatorialToHorizontal, normalizeDegrees, normalizeHours } from "@/lib/astronomy/sphere";
import { gmstHours, julianDay, lstHours } from "@/lib/astronomy/time";

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

function sind(d: number) {
  return Math.sin(d * DEG);
}
function cosd(d: number) {
  return Math.cos(d * DEG);
}
function asind(x: number) {
  return Math.asin(Math.min(1, Math.max(-1, x))) * RAD;
}
function atan2d(y: number, x: number) {
  return Math.atan2(y, x) * RAD;
}

/** ΔT ≈ TT − UTC in seconds (Espenak/Meeus-ish for 2005–2050). */
export function deltaTSeconds(date: Date): number {
  const y = date.getUTCFullYear() + (date.getUTCMonth() + 0.5) / 12;
  const t = y - 2000;
  // Polynomial tuned for early 21st century; ~69–72 s in mid-2020s
  return 62.92 + 0.32217 * t + 0.005589 * t * t;
}

/** Ephemeris / Terrestrial Time as Date-like JD and clock fields. */
export function ephemerisTime(date: Date) {
  const dT = deltaTSeconds(date);
  const jdUtc = julianDay(date);
  const jdTt = jdUtc + dT / 86400;
  const ttMs = date.getTime() + dT * 1000;
  const tt = new Date(ttMs);
  const minutesOfDay =
    tt.getUTCHours() * 60 +
    tt.getUTCMinutes() +
    tt.getUTCSeconds() / 60 +
    tt.getUTCMilliseconds() / 60000;
  return {
    deltaTSec: dT,
    jdUtc,
    jdTt,
    ttIso: tt.toISOString(),
    /** Fractional minutes since 00:00 TT (high-resolution float). */
    minutesOfDay,
    hoursOfDay: minutesOfDay / 60,
  };
}

export type SunState = {
  lambda: number; // ecliptic longitude °
  beta: number; // ecliptic latitude ° (~0)
  ra: number; // hours
  dec: number; // °
  alt: number;
  az: number;
  distanceAu: number;
  meanAnomaly: number;
  trueAnomaly: number;
  equationOfTimeMin: number;
};

/** Sun apparent equatorial + ecliptic (low precision). */
export function sunState(date: Date, lat: number, lon: number): SunState {
  const JD = julianDay(date);
  const n = JD - 2451545.0;
  const L = normalizeDegrees(280.460 + 0.9856474 * n);
  const g = normalizeDegrees(357.528 + 0.9856003 * n);
  const λ = normalizeDegrees(
    L + 1.915 * sind(g) + 0.02 * sind(2 * g),
  );
  const ε = 23.439 - 0.0000004 * n;
  const R =
    1.00014 - 0.01671 * cosd(g) - 0.00014 * cosd(2 * g);
  const λr = λ * DEG;
  const εr = ε * DEG;
  const raRad = Math.atan2(Math.cos(εr) * Math.sin(λr), Math.cos(λr));
  const dec = asind(Math.sin(εr) * Math.sin(λr));
  const ra = normalizeHours((raRad * RAD) / 15);
  const lst = lstHours(date, lon);
  const horiz = equatorialToHorizontal(ra, dec, lat, lst);
  let eot = 4 * (L - ra * 15);
  if (eot > 720) eot -= 1440;
  if (eot < -720) eot += 1440;
  const ν = normalizeDegrees(g + 1.915 * sind(g) + 0.02 * sind(2 * g));
  return {
    lambda: λ,
    beta: 0,
    ra,
    dec,
    alt: horiz.alt,
    az: horiz.az,
    distanceAu: R,
    meanAnomaly: g,
    trueAnomaly: ν,
    equationOfTimeMin: eot,
  };
}

export type MoonState = {
  lambda: number;
  beta: number;
  ra: number;
  dec: number;
  alt: number;
  az: number;
  distanceKm: number;
  phaseAngle: number;
  illumination: number; // 0..1
  elongation: number;
  ageDays: number;
  phaseNameFa: string;
};

/** Approximate lunar ecliptic / equatorial position (Meeus truncated). */
export function moonState(date: Date, lat: number, lon: number): MoonState {
  const JD = julianDay(date);
  const T = (JD - 2451545.0) / 36525;
  const Lp = normalizeDegrees(
    218.3164477 +
      481267.88123421 * T -
      0.0015786 * T * T +
      (T * T * T) / 538841,
  );
  const D = normalizeDegrees(
    297.8501921 + 445267.1114034 * T - 0.0018819 * T * T,
  );
  const M = normalizeDegrees(357.5291092 + 35999.0502909 * T);
  const Mp = normalizeDegrees(
    134.9633964 + 477198.8675055 * T + 0.0087414 * T * T,
  );
  const F = normalizeDegrees(
    93.272095 + 483202.0175233 * T - 0.0036539 * T * T,
  );

  const λ =
    Lp +
    6.289 * sind(Mp) +
    1.274 * sind(2 * D - Mp) +
    0.658 * sind(2 * D) +
    0.214 * sind(2 * Mp) -
    0.186 * sind(M) -
    0.114 * sind(2 * F);
  const β =
    5.128 * sind(F) +
    0.281 * sind(Mp + F) +
    0.278 * sind(Mp - F) +
    0.173 * sind(2 * D - F);
  const Σr =
    -20905 * cosd(Mp) -
    3699 * cosd(2 * D - Mp) -
    2956 * cosd(2 * D) -
    570 * cosd(2 * Mp);
  const Δ = 385000.56 + Σr; // km

  const ε = 23.439291 - 0.0130042 * T;
  const λr = λ * DEG;
  const βr = β * DEG;
  const εr = ε * DEG;
  const raRad = Math.atan2(
    Math.sin(λr) * Math.cos(εr) - Math.tan(βr) * Math.sin(εr),
    Math.cos(λr),
  );
  const dec = asind(
    Math.sin(βr) * Math.cos(εr) + Math.cos(βr) * Math.sin(εr) * Math.sin(λr),
  );
  const ra = normalizeHours((raRad * RAD) / 15);

  const sun = sunState(date, lat, lon);
  const elong = Math.abs(normalizeDegrees(λ - sun.lambda + 180) - 180);
  // phase angle approx from elongation
  const phaseAngle = elong; // deg, simplified
  const illumination = (1 - Math.cos(phaseAngle * DEG)) / 2;
  const ageDays = (normalizeDegrees(λ - sun.lambda) / 360) * 29.53058867;

  const lst = lstHours(date, lon);
  const horiz = equatorialToHorizontal(ra, dec, lat, lst);

  return {
    lambda: normalizeDegrees(λ),
    beta: β,
    ra,
    dec,
    alt: horiz.alt,
    az: horiz.az,
    distanceKm: Δ,
    phaseAngle,
    illumination,
    elongation: elong,
    ageDays,
    phaseNameFa: moonPhaseNameFa(illumination, ageDays),
  };
}

function moonPhaseNameFa(illum: number, age: number): string {
  if (illum < 0.03) return "ماه نو";
  if (illum > 0.97) return "بدر";
  if (age < 7.4) return "هلال فزاینده";
  if (age < 9) return "تربیع اول";
  if (age < 14.8) return "کوژ فزاینده";
  if (age < 18) return "کوژ کاهنده";
  if (age < 22.1) return "تربیع آخر";
  return "هلال کاهنده";
}

export type EarthOrbitState = {
  /** Heliocentric ecliptic longitude of Earth (°) */
  heliocentricLon: number;
  /** True anomaly (°) */
  trueAnomaly: number;
  /** Radius AU (Sun–Earth) */
  rAu: number;
  eccentricity: number;
  /** Perihelion argument / direction of γ from Sun–Earth frame */
  equinoxLon: number;
  x: number;
  y: number;
};

/** Earth on elliptical heliocentric orbit; γ along +x. */
export function earthOrbitState(date: Date): EarthOrbitState {
  const sun = sunState(date, 0, 0);
  const e = 0.0167086;
  const λEarth = normalizeDegrees(sun.lambda + 180);
  // Place Sun at focus; γ (vernal equinox) at λ=0 on the ecliptic
  const r = sun.distanceAu;
  const lon = λEarth * DEG;
  return {
    heliocentricLon: λEarth,
    trueAnomaly: sun.trueAnomaly,
    rAu: r,
    eccentricity: e,
    equinoxLon: 0,
    x: r * Math.cos(lon),
    y: r * Math.sin(lon),
  };
}

export type ObserverState = {
  lat: number;
  lon: number;
  altM: number | null;
  lst: number;
  gmst: number;
};

export function observerState(
  date: Date,
  lat: number,
  lon: number,
  altM: number | null,
): ObserverState {
  return {
    lat,
    lon,
    altM,
    lst: lstHours(date, lon),
    gmst: gmstHours(date),
  };
}

export type LiveSnapshot = {
  utcIso: string;
  et: ReturnType<typeof ephemerisTime>;
  observer: ObserverState;
  sun: SunState;
  moon: MoonState;
  earth: EarthOrbitState;
};

export function liveSnapshot(
  date: Date,
  lat: number,
  lon: number,
  altM: number | null = null,
): LiveSnapshot {
  return {
    utcIso: date.toISOString(),
    et: ephemerisTime(date),
    observer: observerState(date, lat, lon, altM),
    sun: sunState(date, lat, lon),
    moon: moonState(date, lat, lon),
    earth: earthOrbitState(date),
  };
}

/** Yearly sample of sun coords (one point per day, UTC noon). */
export function sunYearSeries(year: number, lat: number, lon: number) {
  const out: Array<{
    day: number;
    label: string;
    dec: number;
    ra: number;
    lambda: number;
    beta: number;
    alt: number;
    az: number;
  }> = [];
  for (let day = 1; day <= 365; day += 2) {
    const d = new Date(Date.UTC(year, 0, day, 12, 0, 0));
    const s = sunState(d, lat, lon);
    out.push({
      day,
      label: String(day),
      dec: +s.dec.toFixed(3),
      ra: +s.ra.toFixed(4),
      lambda: +s.lambda.toFixed(3),
      beta: +s.beta.toFixed(4),
      alt: +s.alt.toFixed(3),
      az: +s.az.toFixed(2),
    });
  }
  return out;
}

/** Intraday sample (UTC hours). */
export function sunDaySeries(date: Date, lat: number, lon: number, stepH = 0.25) {
  const out: Array<{
    hour: number;
    label: string;
    dec: number;
    ra: number;
    lambda: number;
    beta: number;
    alt: number;
    az: number;
  }> = [];
  for (let h = 0; h < 24; h += stepH) {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCMinutes(Math.round(h * 60));
    const s = sunState(d, lat, lon);
    out.push({
      hour: h,
      label: h.toFixed(2),
      dec: +s.dec.toFixed(3),
      ra: +s.ra.toFixed(4),
      lambda: +s.lambda.toFixed(3),
      beta: +s.beta.toFixed(4),
      alt: +s.alt.toFixed(3),
      az: +s.az.toFixed(2),
    });
  }
  return out;
}
