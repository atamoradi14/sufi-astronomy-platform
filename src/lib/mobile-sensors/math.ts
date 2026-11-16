import { lstHours } from "../astronomy/time";

export type Vec = [number, number, number];
/** [x,y,z,w], active rotation from physical device axes to east/north/up. */
export type Quat = [number, number, number, number];
export const RAD = Math.PI / 180;
export const wrap = (v: number) => ((v % 360) + 360) % 360;
export const delta = (a: number, b: number) => ((a - b + 540) % 360) - 180;
export const norm = (v: readonly number[]) => Math.hypot(...v);
export const finiteVec = (v: readonly unknown[]): v is Vec =>
  v.length === 3 && v.every((x) => typeof x === "number" && Number.isFinite(x));
export const unit = (v: Vec): Vec => v.map((x) => x / (norm(v) || 1)) as Vec;
export const dot = (a: Vec, b: Vec) => a.reduce((s, v, i) => s + v * b[i], 0);
export const cross = (a: Vec, b: Vec): Vec => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const conjugate = (q: Quat): Quat => [-q[0], -q[1], -q[2], q[3]];
export const normalized = (q: Quat): Quat =>
  q.map((x) => x / (norm(q) || 1)) as Quat;
export function mul(a: Quat, b: Quat): Quat {
  return [
    a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
    a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
    a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
  ];
}
export function exp(v: Vec): Quat {
  const angle = norm(v),
    k = angle < 1e-9 ? 0.5 : Math.sin(angle / 2) / angle;
  return normalized([v[0] * k, v[1] * k, v[2] * k, Math.cos(angle / 2)]);
}
export function log(q: Quat): Vec {
  const s = q[3] < 0 ? -1 : 1,
    n = norm(q.slice(0, 3));
  const k = n < 1e-9 ? 2 : (2 * Math.atan2(n, Math.abs(q[3]))) / n;
  return [s * q[0] * k, s * q[1] * k, s * q[2] * k];
}
export function rotate(q: Quat, v: Vec): Vec {
  return mul(mul(q, [...v, 0]), conjugate(q)).slice(0, 3) as Vec;
}
/** W3C intrinsic Z-X'-Y'' Euler angles; never flip the alpha convention by event type. */
export function fromOrientation(
  alpha: number,
  beta: number,
  gamma: number,
): Quat {
  return normalized(
    mul(
      mul(exp([0, 0, alpha * RAD]), exp([beta * RAD, 0, 0])),
      exp([0, gamma * RAD, 0]),
    ),
  );
}
export function topHeading(q: Quat, screenAngle = 0): number | null {
  const a = screenAngle * RAD;
  const v = rotate(q, [-Math.sin(a), Math.cos(a), 0]);
  return Math.hypot(v[0], v[1]) < 0.02
    ? null
    : wrap(Math.atan2(v[0], v[1]) / RAD);
}
export function poseAngles(q: Quat) {
  // Intrinsic ZYX Euler angles: yaw about up, pitch about Y', roll about X''.
  const [x, y, z, w] = q;
  return {
    yaw: wrap(Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z)) / RAD),
    pitch: Math.asin(Math.max(-1, Math.min(1, 2 * (w * y - z * x)))) / RAD,
    roll: Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y)) / RAD,
  };
}
/** TRIAD: measured support acceleration points up; horizontal magnetic field points north. */
export function fromAccelMag(accel: Vec, mag: Vec): Quat | null {
  if (
    Math.abs(norm(accel) - 9.80665) > 1.4 ||
    norm(mag) < 10 ||
    norm(mag) > 100
  )
    return null;
  const up = unit(accel),
    east = unit(cross(mag, up));
  if (norm(cross(unit(mag), up)) < 0.12) return null;
  const north = unit(cross(up, east));
  // Rows of body->ENU matrix. Stable matrix->quaternion conversion, including half turns.
  const m = [...east, ...north, ...up],
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

type Matrix = number[][];
const identity = (): Matrix => [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];
const transpose = (a: Matrix) => a[0].map((_, i) => a.map((r) => r[i]));
const mm = (a: Matrix, b: Matrix): Matrix =>
  a.map((r) => b[0].map((_, j) => r.reduce((s, x, k) => s + x * b[k][j], 0)));
const add = (a: Matrix, b: Matrix) =>
  a.map((r, i) => r.map((x, j) => x + b[i][j]));
function inverse(a: Matrix): Matrix {
  const [r, s, t] = a,
    det = dot(r as Vec, cross(s as Vec, t as Vec));
  return transpose([
    cross(s as Vec, t as Vec),
    cross(t as Vec, r as Vec),
    cross(r as Vec, s as Vec),
  ]).map((r) => r.map((x) => x / det));
}
/** Three-state multiplicative attitude-error EKF. Bias is measured separately at rest.
 * Gyro predicts a unit quaternion; shortest quaternion-log innovation updates a full
 * 3x3 covariance with a Joseph update. Browser orientation is a correlated fused
 * reference: its noise floor is deliberately retained; covariance is NOT accuracy.
 */
export class AttitudeKalman {
  q: Quat | null = null;
  p: Matrix = identity().map((r) => r.map((x) => x * (8 * RAD) ** 2));
  predict(rate: Vec, dt: number) {
    if (!this.q || dt <= 0 || dt > 0.15 || !finiteVec(rate)) return;
    this.q = normalized(mul(this.q, exp(rate.map((x) => x * dt) as Vec)));
    const [x, y, z] = rate,
      f = [
        [1, z * dt, -y * dt],
        [-z * dt, 1, x * dt],
        [y * dt, -x * dt, 1],
      ];
    this.p = add(
      mm(mm(f, this.p), transpose(f)),
      identity().map((r) => r.map((v) => v * (1.5 * RAD) ** 2 * dt)),
    );
  }
  update(measurement: Quat, noiseDeg = 5, dt = 0.1, hasGyro = false) {
    if (!measurement.every(Number.isFinite) || norm(measurement) < 0.5) return;
    const measured = normalized(measurement);
    if (!this.q) {
      this.q = measured;
      return;
    }
    if (!hasGyro)
      this.p = add(
        this.p,
        identity().map((r) =>
          r.map((v) => v * (12 * RAD) ** 2 * Math.min(0.2, dt)),
        ),
      );
    const residual = log(mul(conjugate(this.q), measured));
    // Large innovations during a real turn need quick acquisition, not a slow lock.
    const floor = (Math.max(2, noiseDeg) * RAD) ** 2;
    this.p = this.p.map((r, i) =>
      r.map((v, j) => (i === j ? Math.max(v, floor * 0.08) : v)),
    );
    const r = identity().map((row) => row.map((v) => v * floor));
    const k = mm(this.p, inverse(add(this.p, r)));
    const correction = k.map((row) => dot(row as Vec, residual)) as Vec;
    this.q = normalized(mul(this.q, exp(correction)));
    const imk = identity().map((row, i) => row.map((v, j) => v - k[i][j]));
    this.p = add(
      mm(mm(imk, this.p), transpose(imk)),
      mm(mm(k, r), transpose(k)),
    );
    // Recenter the local attitude-error covariance after multiplicative injection.
    const [x, y, z] = correction,
      g = [
        [1, z / 2, -y / 2],
        [-z / 2, 1, x / 2],
        [y / 2, -x / 2, 1],
      ];
    this.p = mm(mm(g, this.p), transpose(g));
  }
  get sigmaDeg() {
    return Math.sqrt(Math.max(...this.p.map((r, i) => r[i]))) / RAD;
  }
}

/** Continuous angle for CSS transforms: 359 -> 0 becomes 359 -> 360. */
export class HeadingFilter {
  value: number | null = null;
  variance = 16;
  update(value: number, dt: number) {
    if (this.value === null) return (this.value = value);
    this.variance += 36 * Math.min(Math.max(dt, 0.005), 0.2);
    const k = this.variance / (this.variance + 9);
    this.value += k * delta(value, wrap(this.value));
    this.variance *= 1 - k;
    return this.value;
  }
}
export class SourceLock {
  source = "";
  priority = 0;
  at = -Infinity;
  accept(source: string, priority: number, at: number) {
    if (
      source !== this.source &&
      priority <= this.priority &&
      at - this.at < 2000
    )
      return false;
    this.source = source;
    this.priority = priority;
    this.at = at;
    return true;
  }
}
export type MagCalibration = { offset: Vec; scale: Vec };
export function calibrateMag(samples: Vec[]): MagCalibration | null {
  if (samples.length < 100) return null;
  const low = [0, 1, 2].map((i) =>
    Math.min(...samples.map((v) => v[i])),
  ) as Vec;
  const high = [0, 1, 2].map((i) =>
    Math.max(...samples.map((v) => v[i])),
  ) as Vec;
  const half = high.map((v, i) => (v - low[i]) / 2) as Vec;
  if (
    Math.min(...half) < 15 ||
    Math.max(...half) > 100 ||
    Math.max(...half) / Math.min(...half) > 3
  )
    return null;
  const avg = half.reduce((a, b) => a + b, 0) / 3;
  const result = {
    offset: high.map((v, i) => (v + low[i]) / 2) as Vec,
    scale: half.map((v) => avg / v) as Vec,
  };
  const radii = samples.map((v) => norm(correctMag(v, result))),
    mean = radii.reduce((a, b) => a + b, 0) / radii.length;
  if (
    Math.sqrt(radii.reduce((s, x) => s + (x - mean) ** 2, 0) / radii.length) /
      mean >
    0.2
  )
    return null;
  return result;
}
export const correctMag = (v: Vec, c: MagCalibration): Vec =>
  v.map((x, i) => (x - c.offset[i]) * c.scale[i]) as Vec;
export function stationaryBias(
  gyro: Vec[],
  accel: Vec[],
  orientations: Quat[] = [],
): Vec | null {
  if (
    orientations.length > 1 &&
    orientations.some(
      (q) => norm(log(mul(conjugate(orientations[0]), q))) > 2 * RAD,
    )
  )
    return null;
  if (
    gyro.length < 90 ||
    accel.length < 90 ||
    accel.some((v) => Math.abs(norm(v) - 9.80665) > 0.35)
  )
    return null;
  const mean = gyro[0].map(
    (_, i) => gyro.reduce((s, v) => s + v[i], 0) / gyro.length,
  ) as Vec;
  if (
    norm(mean) > 0.08 ||
    gyro.some((v) => norm(v.map((x, i) => x - mean[i])) > 0.025)
  )
    return null;
  // A changing gravity direction also means the phone moved, even with small rate.
  const up = unit(accel[0]);
  if (accel.some((v) => dot(unit(v), up) < 0.999)) return null;
  return mean;
}
export function skyPoint(
  q: Quat,
  axis: Vec,
  declination: number,
  date: Date,
  gps?: { lat: number; lon: number },
) {
  // East-positive magnetic declination is clockwise, hence negative ENU rotation.
  const v = rotate(mul(exp([0, 0, -declination * RAD]), q), axis);
  const horizontal = Math.hypot(v[0], v[1]);
  const az = horizontal < 0.02 ? null : wrap(Math.atan2(v[0], v[1]) / RAD),
    alt = Math.atan2(v[2], horizontal) / RAD;
  if (!gps) return { az, alt, ra: null, dec: null };
  const lat = gps.lat * RAD,
    sinDec = v[1] * Math.cos(lat) + v[2] * Math.sin(lat);
  const h = Math.atan2(-v[0], v[2] * Math.cos(lat) - v[1] * Math.sin(lat));
  const dec = Math.asin(Math.max(-1, Math.min(1, sinDec))) / RAD;
  const ra =
    Math.abs(Math.cos(dec * RAD)) < 1e-8
      ? null
      : wrap(lstHours(date, gps.lon) * 15 - h / RAD) / 15;
  return { az, alt, ra, dec };
}
