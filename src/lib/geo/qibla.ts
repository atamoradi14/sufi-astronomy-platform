/** Kaaba coordinates (WGS84) */
export const KAABA = { lat: 21.4225, lon: 39.8262 };

const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

export function toRad(deg: number) {
  return deg * DEG;
}

export function toDeg(rad: number) {
  return rad * RAD;
}

/** Great-circle initial bearing from A to B (degrees, 0–360, from north). */
export function bearingTo(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number,
): number {
  const φ1 = toRad(fromLat);
  const φ2 = toRad(toLat);
  const Δλ = toRad(toLon - fromLon);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/** Great-circle distance in km (Haversine). */
export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371.0088;
  const dφ = toRad(lat2 - lat1);
  const dλ = toRad(lon2 - lon1);
  const a =
    Math.sin(dφ / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dλ / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function qiblaBearing(lat: number, lon: number): number {
  return bearingTo(lat, lon, KAABA.lat, KAABA.lon);
}

export function qiblaDistanceKm(lat: number, lon: number): number {
  return haversineKm(lat, lon, KAABA.lat, KAABA.lon);
}

/** Destination point given start, bearing (deg), and distance (km). */
export function destinationPoint(
  lat: number,
  lon: number,
  bearingDeg: number,
  distanceKm: number,
): { lat: number; lon: number } {
  const R = 6371.0088;
  const δ = distanceKm / R;
  const θ = toRad(bearingDeg);
  const φ1 = toRad(lat);
  const λ1 = toRad(lon);
  const φ2 = Math.asin(
    Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ),
  );
  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
      Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2),
    );
  return { lat: toDeg(φ2), lon: ((toDeg(λ2) + 540) % 360) - 180 };
}

/** Sample points along a great-circle path. */
export function greatCirclePath(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  steps = 64,
): Array<[number, number]> {
  const φ1 = toRad(lat1);
  const λ1 = toRad(lon1);
  const φ2 = toRad(lat2);
  const λ2 = toRad(lon2);
  const Δ =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((φ2 - φ1) / 2) ** 2 +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2,
      ),
    );
  if (Δ < 1e-10) return [[lat1, lon1], [lat2, lon2]];

  const points: Array<[number, number]> = [];
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const A = Math.sin((1 - f) * Δ) / Math.sin(Δ);
    const B = Math.sin(f * Δ) / Math.sin(Δ);
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    const φ = Math.atan2(z, Math.sqrt(x * x + y * y));
    const λ = Math.atan2(y, x);
    points.push([toDeg(φ), toDeg(λ)]);
  }
  return points;
}

/** Circle of equal angular radius around a point (small circle on sphere). */
export function equalDistanceCircle(
  lat: number,
  lon: number,
  radiusKm: number,
  steps = 72,
): Array<[number, number]> {
  const points: Array<[number, number]> = [];
  for (let i = 0; i <= steps; i++) {
    const bearing = (360 * i) / steps;
    const p = destinationPoint(lat, lon, bearing, radiusKm);
    points.push([p.lat, p.lon]);
  }
  return points;
}
