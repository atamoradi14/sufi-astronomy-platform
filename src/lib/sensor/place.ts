import {
  Atmosphere,
  BaryState,
  Body,
  C_AUDAY,
  Equator,
  HorizonFromVector,
  MakeTime,
  Observer,
  ObserverState,
  RotateVector,
  Rotation_EQJ_EQD,
  Rotation_EQJ_HOR,
  Vector,
} from "astronomy-engine";
import { julianDay } from "@/lib/astronomy/time";
import type { SkyContext } from "@/lib/sensor/catalog";
import {
  addAberration,
  radecToVec,
  vecToRaDec,
  type Vec3,
} from "@/lib/sensor/math";

export type Site = {
  lat: number;
  lon: number;
  height: number;
  date: Date;
};

export type ReducedPlace = {
  raIcrsDeg: number;
  decIcrsDeg: number;
  /** Apparent equator of date, unrefracted, hours and degrees. */
  raAppHours: number;
  decAppDeg: number;
  /** Apparent altitude after standard refraction, degrees. */
  altDeg: number;
  /** Azimuth from north toward east, degrees. */
  azDeg: number;
  refractionArcsec: number;
};

export function skyContext(site: Site): SkyContext {
  const observer = new Observer(site.lat, site.lon, site.height);
  const earth = BaryState(Body.Earth, site.date);
  const local = ObserverState(site.date, observer, false);
  return {
    jd: julianDay(site.date),
    posAu: [earth.x + local.x, earth.y + local.y, earth.z + local.z],
    beta: [
      (earth.vx + local.vx) / C_AUDAY,
      (earth.vy + local.vy) / C_AUDAY,
      (earth.vz + local.vz) / C_AUDAY,
    ],
  };
}

/**
 * ICRS geometric direction → apparent equatorial place and refracted alt/az.
 * Aberration uses the observer's barycentric velocity. Refraction follows
 * the US Standard Atmosphere density at the site height.
 */
export function reducePlace(icrs: Vec3, site: Site, beta: Vec3): ReducedPlace {
  const geo = vecToRaDec(icrs);
  const apparent = addAberration(icrs, beta);
  const observer = new Observer(site.lat, site.lon, site.height);
  const time = MakeTime(site.date);
  const eqd = RotateVector(
    Rotation_EQJ_EQD(site.date),
    new Vector(apparent[0], apparent[1], apparent[2], time),
  );
  const ofDate = vecToRaDec([eqd.x, eqd.y, eqd.z]);
  const hor = RotateVector(
    Rotation_EQJ_HOR(site.date, observer),
    new Vector(apparent[0], apparent[1], apparent[2], time),
  );
  const airless = HorizonFromVector(
    new Vector(hor.x, hor.y, hor.z, time),
    null as unknown as string,
  );
  const height = Math.min(80000, Math.max(-500, site.height));
  const density = Atmosphere(height).density;
  const lifted = HorizonFromVector(new Vector(hor.x, hor.y, hor.z, time), "normal");
  const refractionDeg = (lifted.lat - airless.lat) * density;
  return {
    raIcrsDeg: geo.raDeg,
    decIcrsDeg: geo.decDeg,
    raAppHours: ofDate.raDeg / 15,
    decAppDeg: ofDate.decDeg,
    altDeg: airless.lat + refractionDeg,
    azDeg: airless.lon,
    refractionArcsec: refractionDeg * 3600,
  };
}

export type PlanetMark = {
  name: string;
  raDeg: number;
  decDeg: number;
  x: number;
  y: number;
};

const PLANETS: { body: Body; name: string }[] = [
  { body: Body.Sun, name: "Sun" },
  { body: Body.Moon, name: "Moon" },
  { body: Body.Mercury, name: "Mercury" },
  { body: Body.Venus, name: "Venus" },
  { body: Body.Mars, name: "Mars" },
  { body: Body.Jupiter, name: "Jupiter" },
  { body: Body.Saturn, name: "Saturn" },
];

/** Geometric J2000 places of the naked-eye planets, for overlay on a solved plate. */
export function planetIcrs(site: Site) {
  const observer = new Observer(site.lat, site.lon, site.height);
  return PLANETS.map(({ body, name }) => {
    const eq = Equator(body, site.date, observer, false, false);
    const n = Math.hypot(eq.vec.x, eq.vec.y, eq.vec.z) || 1;
    return {
      name,
      raDeg: eq.ra * 15,
      decDeg: eq.dec,
      vec: [eq.vec.x / n, eq.vec.y / n, eq.vec.z / n] as Vec3,
    };
  });
}
