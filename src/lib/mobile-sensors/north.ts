import { model } from "geomagnetism";
export type NorthReference = {
  declination: number | null;
  model: string | null;
  reason: "location" | "date" | "weak-field" | null;
};
/** Modelled north correction, never a substitute for measured magnetic X/Y/Z.
 * GPS altitude is ellipsoidal metres; geomagnetism expects kilometres.
 */
export function automaticNorth(
  date: Date,
  lat?: number,
  lon?: number,
  altitude: number | null = 0,
): NorthReference {
  if (
    lat === undefined ||
    lon === undefined ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    Math.abs(lat) > 90 ||
    Math.abs(lon) > 180
  )
    return { declination: null, model: null, reason: "location" };
  if (!Number.isFinite(date.getTime()))
    return { declination: null, model: null, reason: "date" };
  try {
    const magnetic = model(date),
      point = magnetic.point([
        lat,
        lon,
        Number.isFinite(altitude)
          ? Math.max(-1, Math.min(100, (altitude ?? 0) / 1000))
          : 0,
      ]);
    if (!Number.isFinite(point.decl) || point.h < 2000)
      return { declination: null, model: magnetic.name, reason: "weak-field" };
    return { declination: point.decl, model: magnetic.name, reason: null };
  } catch {
    return { declination: null, model: null, reason: "date" };
  }
}
