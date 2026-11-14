/**
 * Live ephemeris via astronomy-engine (VSOP87 / ELP-class).
 * Positions are of-date, apparent, for the given observer.
 */

import {
  Body,
  DeltaT_EspenakMeeus,
  Ecliptic,
  Equator,
  HelioVector,
  Horizon,
  Illumination,
  MakeTime,
  MoonPhase,
  Observer,
  SiderealTime,
  SunPosition,
  GeoMoon,
  EquatorFromVector,
  type AstroTime,
} from "astronomy-engine";
import { julianDay } from "@/lib/astronomy/time";

const SYNODIC = 29.530588853;

function wrap24(h: number) {
  return ((h % 24) + 24) % 24;
}
function wrap360(d: number) {
  return ((d % 360) + 360) % 360;
}

function observerOf(lat: number, lon: number, altM: number | null) {
  return new Observer(lat, lon, altM ?? 0);
}

export function deltaTSeconds(date: Date): number {
  const time = MakeTime(date);
  return DeltaT_EspenakMeeus(time.ut);
}

export function ephemerisTime(date: Date) {
  const dT = deltaTSeconds(date);
  const jdUtc = julianDay(date);
  const jdTt = jdUtc + dT / 86400;
  const tt = new Date(date.getTime() + dT * 1000);
  const minutesOfDay =
    tt.getUTCHours() * 60 +
    tt.getUTCMinutes() +
    tt.getUTCSeconds() / 60 +
    tt.getUTCMilliseconds() / 60000 +
    0; // TT clock
  return {
    deltaTSec: dT,
    jdUtc,
    jdTt,
    ttIso: tt.toISOString(),
    minutesOfDay,
    hoursOfDay: minutesOfDay / 60,
  };
}

function solarCoords(time: AstroTime, obs: Observer) {
  const eq = Equator(Body.Sun, time, obs, true, true);
  const hor = Horizon(time, obs, eq.ra, eq.dec, "normal");
  const ecl = SunPosition(time);
  const gst = SiderealTime(time);
  const lst = wrap24(gst + obs.longitude / 15);
  const utcH =
    time.date.getUTCHours() +
    time.date.getUTCMinutes() / 60 +
    time.date.getUTCSeconds() / 3600 +
    time.date.getUTCMilliseconds() / 3_600_000;
  const meanLocal = wrap24(utcH + obs.longitude / 15);
  const ha = wrap24(lst - eq.ra);
  const apparent = wrap24(ha + 12);
  let eotHours = apparent - meanLocal;
  if (eotHours > 12) eotHours -= 24;
  if (eotHours < -12) eotHours += 24;
  return {
    lambda: ecl.elon,
    beta: ecl.elat,
    ra: eq.ra,
    dec: eq.dec,
    alt: hor.altitude,
    az: hor.azimuth,
    distanceAu: ecl.vec.Length(),
    equationOfTimeMin: eotHours * 60,
    lst,
    gmst: gst,
  };
}

export type SunState = {
  lambda: number;
  beta: number;
  ra: number;
  dec: number;
  alt: number;
  az: number;
  distanceAu: number;
  equationOfTimeMin: number;
};

export function sunState(date: Date, lat: number, lon: number, altM: number | null = 0): SunState {
  const time = MakeTime(date);
  const s = solarCoords(time, observerOf(lat, lon, altM));
  return {
    lambda: s.lambda,
    beta: s.beta,
    ra: s.ra,
    dec: s.dec,
    alt: s.alt,
    az: s.az,
    distanceAu: s.distanceAu,
    equationOfTimeMin: s.equationOfTimeMin,
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
  illumination: number;
  elongation: number;
  ageDays: number;
  phaseNameFa: string;
  waxing: boolean;
};

export function moonState(date: Date, lat: number, lon: number, altM: number | null = 0): MoonState {
  const time = MakeTime(date);
  const obs = observerOf(lat, lon, altM);
  const vec = GeoMoon(time);
  const eq = EquatorFromVector(vec);
  const hor = Horizon(time, obs, eq.ra, eq.dec, "normal");
  const ecl = Ecliptic(vec);
  const ill = Illumination(Body.Moon, time);
  const phase = MoonPhase(time); // 0 new … 180 full … 360
  const ageDays = (phase / 360) * SYNODIC;
  const waxing = phase < 180;
  const sun = SunPosition(time);
  const elong = Math.abs(wrap360(ecl.elon - sun.elon + 180) - 180);
  return {
    lambda: ecl.elon,
    beta: ecl.elat,
    ra: eq.ra,
    dec: eq.dec,
    alt: hor.altitude,
    az: hor.azimuth,
    distanceKm: vec.Length() * 149597870.7,
    phaseAngle: ill.phase_angle,
    illumination: ill.phase_fraction,
    elongation: elong,
    ageDays,
    waxing,
    phaseNameFa: moonPhaseNameFa(phase),
  };
}

function moonPhaseNameFa(phase: number): string {
  const p = wrap360(phase);
  if (p < 8 || p > 352) return "ماه نو";
  if (p < 80) return "هلال فزاینده";
  if (p < 100) return "تربیع اول";
  if (p < 170) return "کوژ فزاینده";
  if (p < 190) return "بدر";
  if (p < 260) return "کوژ کاهنده";
  if (p < 280) return "تربیع آخر";
  return "هلال کاهنده";
}

export type EarthOrbitState = {
  heliocentricLon: number;
  rAu: number;
  x: number;
  y: number;
  z: number;
};

export function earthOrbitState(date: Date): EarthOrbitState {
  const time = MakeTime(date);
  const v = HelioVector(Body.Earth, time);
  const ecl = Ecliptic(v);
  const r = v.Length();
  const lon = ecl.elon * (Math.PI / 180);
  return {
    heliocentricLon: ecl.elon,
    rAu: r,
    x: r * Math.cos(lon),
    y: r * Math.sin(lon),
    z: v.z,
  };
}

/** Full-year heliocentric ecliptic track (of date), equinox = +x. */
export function earthOrbitTrack(year: number) {
  const pts: { x: number; y: number; lon: number; r: number; day: number }[] = [];
  for (let day = 0; day < 366; day += 2) {
    const date = new Date(Date.UTC(year, 0, 1 + day, 12, 0, 0));
    if (date.getUTCFullYear() !== year) break;
    const e = earthOrbitState(date);
    pts.push({ x: e.x, y: e.y, lon: e.heliocentricLon, r: e.rAu, day: day + 1 });
  }
  return pts;
}

export type ObserverState = {
  lat: number;
  lon: number;
  altM: number | null;
  lst: number;
  gmst: number;
};

export function observerState(date: Date, lat: number, lon: number, altM: number | null): ObserverState {
  const time = MakeTime(date);
  const gmst = SiderealTime(time);
  return { lat, lon, altM, gmst, lst: wrap24(gmst + lon / 15) };
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
    sun: sunState(date, lat, lon, altM),
    moon: moonState(date, lat, lon, altM),
    earth: earthOrbitState(date),
  };
}

export type SunSample = {
  t: string;
  dec: number;
  ra: number;
  lambda: number;
  beta: number;
  alt: number;
  az: number;
  eot: number;
};

/** Local civil day, 15-minute steps. x = hours after local midnight. */
export function sunDaySeries(date: Date, lat: number, lon: number, altM: number | null = 0) {
  const local = new Date(date.getTime() + (lon / 15) * 3_600_000);
  const midnightUtc =
    Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), 0, 0, 0) -
    (lon / 15) * 3_600_000;
  const out: (SunSample & { hour: number; label: string })[] = [];
  for (let i = 0; i <= 96; i++) {
    const d = new Date(midnightUtc + i * 15 * 60 * 1000);
    const s = sunState(d, lat, lon, altM);
    const hour = i * 0.25;
    out.push({
      hour,
      label: hour % 1 === 0 ? String(hour).padStart(2, "0") : "",
      t: d.toISOString(),
      dec: +s.dec.toFixed(4),
      ra: +s.ra.toFixed(5),
      lambda: +s.lambda.toFixed(4),
      beta: +s.beta.toFixed(5),
      alt: +s.alt.toFixed(3),
      az: +s.az.toFixed(3),
      eot: +s.equationOfTimeMin.toFixed(3),
    });
  }
  return out;
}

const MONTHS_FA = [
  "ژانویه",
  "فوریه",
  "مارس",
  "آوریل",
  "مه",
  "ژوئن",
  "ژوئیه",
  "اوت",
  "سپتامبر",
  "اکتبر",
  "نوامبر",
  "دسامبر",
];

/** One sample per day at local noon — culmination altitude is meaningful. */
export function sunYearSeries(year: number, lat: number, lon: number, altM: number | null = 0) {
  const out: (SunSample & { day: number; month: string; label: string })[] = [];
  let n = 0;
  for (let month = 0; month < 12; month++) {
    const dim = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    for (let d = 1; d <= dim; d++) {
      n += 1;
      const noonUtc = Date.UTC(year, month, d, 12, 0, 0) - (lon / 15) * 3_600_000;
      const when = new Date(noonUtc);
      const s = sunState(when, lat, lon, altM);
      out.push({
        day: n,
        month: MONTHS_FA[month],
        label: d === 1 ? MONTHS_FA[month] : "",
        t: when.toISOString(),
        dec: +s.dec.toFixed(4),
        ra: +s.ra.toFixed(5),
        lambda: +s.lambda.toFixed(4),
        beta: +s.beta.toFixed(5),
        alt: +s.alt.toFixed(3),
        az: +s.az.toFixed(3),
        eot: +s.equationOfTimeMin.toFixed(3),
      });
    }
  }
  return out;
}

/** Lunar illumination over the next 30 days (local noon). */
export function moonMonthSeries(date: Date, lat: number, lon: number) {
  const out: { day: number; label: string; illum: number; alt: number; dec: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(date.getTime() + i * 86_400_000);
    const m = moonState(d, lat, lon, 0);
    out.push({
      day: i,
      label: String(i),
      illum: +(m.illumination * 100).toFixed(2),
      alt: +m.alt.toFixed(2),
      dec: +m.dec.toFixed(3),
    });
  }
  return out;
}
