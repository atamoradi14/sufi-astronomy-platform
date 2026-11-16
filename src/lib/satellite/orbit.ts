import {
  cross,
  unit,
  normalized,
  mul,
  type Vec,
  type Quat,
} from "../mobile-sensors/math";
export const EARTH_RADIUS_KM = 6378.137,
  MU = 398600.4418;
export type Elements = {
  a: number;
  e: number;
  i: number;
  raan: number;
  argp: number;
  meanAnomaly: number;
  epoch: string;
};
export const DEFAULT_ORBIT: Elements = {
  a: 6878.137,
  e: 0.001,
  i: 51.6,
  raan: 0,
  argp: 0,
  meanAnomaly: 0,
  epoch: "2026-11-17T00:00:00Z",
};
export function validateElements(o: Elements): string | null {
  if (
    ![o.a, o.e, o.i, o.raan, o.argp, o.meanAnomaly].every(Number.isFinite) ||
    !Number.isFinite(Date.parse(o.epoch))
  )
    return "Enter six finite elements and a valid UTC epoch.";
  if (o.e < 0 || o.e >= 0.95)
    return "Eccentricity must be from 0 up to 0.95 (excluded).";
  if (o.a * (1 - o.e) <= EARTH_RADIUS_KM + 80)
    return "Perigee must be above 80 km altitude.";
  if (o.a > 200000 || o.i < 0 || o.i > 180)
    return "Semi-major axis must be below 200,000 km and inclination 0–180°.";
  return null;
}
export function orbitState(o: Elements, date: Date) {
  const error = validateElements(o);
  if (error) throw Error(error);
  const rad = Math.PI / 180,
    n = Math.sqrt(MU / o.a ** 3),
    dt = (date.getTime() - Date.parse(o.epoch)) / 1000;
  const mean =
    (((o.meanAnomaly * rad + n * dt) % (2 * Math.PI)) + 2 * Math.PI) %
    (2 * Math.PI);
  let E = mean;
  for (let k = 0; k < 30; k++) {
    const step = (E - o.e * Math.sin(E) - mean) / (1 - o.e * Math.cos(E));
    E -= step;
    if (Math.abs(step) < 1e-13) break;
  }
  const cos = Math.cos(E),
    sin = Math.sin(E),
    root = Math.sqrt(1 - o.e ** 2),
    distance = o.a * (1 - o.e * cos);
  const p: Vec = [o.a * (cos - o.e), o.a * root * sin, 0],
    v: Vec = [
      (-o.a * n * sin) / (1 - o.e * cos),
      (o.a * n * root * cos) / (1 - o.e * cos),
      0,
    ];
  const O = o.raan * rad,
    w = o.argp * rad,
    I = o.i * rad,
    cO = Math.cos(O),
    sO = Math.sin(O),
    cw = Math.cos(w),
    sw = Math.sin(w),
    cI = Math.cos(I),
    sI = Math.sin(I);
  const rotate = (a: Vec): Vec => [
    (cO * cw - sO * sw * cI) * a[0] + (-cO * sw - sO * cw * cI) * a[1],
    (sO * cw + cO * sw * cI) * a[0] + (-sO * sw + cO * cw * cI) * a[1],
    sw * sI * a[0] + cw * sI * a[1],
  ];
  return {
    r: rotate(p),
    v: rotate(v),
    period: (2 * Math.PI) / n,
    altitude: distance - EARTH_RADIUS_KM,
    perigee: o.a * (1 - o.e) - EARTH_RADIUS_KM,
    apogee: o.a * (1 + o.e) - EARTH_RADIUS_KM,
  };
}
export function lvlhQuaternion(r: Vec, v: Vec): Quat {
  const radial = unit(r),
    normal = unit(cross(r, v)),
    x = unit(cross(normal, radial)),
    y = normal.map((a) => -a) as Vec,
    z = radial.map((a) => -a) as Vec;
  const m = [x[0], y[0], z[0], x[1], y[1], z[1], x[2], y[2], z[2]],
    tr = m[0] + m[4] + m[8];
  let q: Quat;
  if (tr > 0) {
    const s = Math.sqrt(tr + 1) * 2;
    q = [(m[7] - m[5]) / s, (m[2] - m[6]) / s, (m[3] - m[1]) / s, s / 4];
  } else if (m[0] > m[4] && m[0] > m[8]) {
    const s = Math.sqrt(1 + m[0] - m[4] - m[8]) * 2;
    q = [s / 4, (m[1] + m[3]) / s, (m[2] + m[6]) / s, (m[7] - m[5]) / s];
  } else if (m[4] > m[8]) {
    const s = Math.sqrt(1 + m[4] - m[0] - m[8]) * 2;
    q = [(m[1] + m[3]) / s, s / 4, (m[5] + m[7]) / s, (m[2] - m[6]) / s];
  } else {
    const s = Math.sqrt(1 + m[8] - m[0] - m[4]) * 2;
    q = [(m[2] + m[6]) / s, (m[5] + m[7]) / s, s / 4, (m[3] - m[1]) / s];
  }
  return normalized(q);
}
export const commandedAttitude = (r: Vec, v: Vec, phone: Quat) =>
  normalized(mul(lvlhQuaternion(r, v), phone));
export function earthOccults(r: Vec, direction: Vec) {
  const b = r.reduce((sum, x, i) => sum + x * direction[i], 0),
    c = r.reduce((sum, x) => sum + x * x, 0) - EARTH_RADIUS_KM ** 2;
  return b < 0 && b * b >= c;
}
