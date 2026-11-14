/** 3-vectors and 3×3 matrices, row-major. */

export type Vec3 = [number, number, number];
export type Mat3 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export const ARCSEC_PER_RAD = 206264.80624709636;
export const DEG = Math.PI / 180;

export function vdot(a: Vec3, b: Vec3) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function vnorm(a: Vec3): number {
  return Math.hypot(a[0], a[1], a[2]);
}

export function vscale(a: Vec3, s: number): Vec3 {
  return [a[0] * s, a[1] * s, a[2] * s];
}

export function vadd(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function vsub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function vcross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

export function vunit(a: Vec3): Vec3 {
  const n = vnorm(a) || 1;
  return [a[0] / n, a[1] / n, a[2] / n];
}

export function clamp(x: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, x));
}

export function radecToVec(raDeg: number, decDeg: number): Vec3 {
  const ra = raDeg * DEG;
  const dec = decDeg * DEG;
  const c = Math.cos(dec);
  return [c * Math.cos(ra), c * Math.sin(ra), Math.sin(dec)];
}

export function vecToRaDec(v: Vec3): { raDeg: number; decDeg: number } {
  const dec = Math.asin(clamp(v[2], -1, 1)) / DEG;
  let ra = Math.atan2(v[1], v[0]) / DEG;
  if (ra < 0) ra += 360;
  return { raDeg: ra, decDeg: dec };
}

export function angleRad(a: Vec3, b: Vec3) {
  return Math.acos(clamp(vdot(a, b), -1, 1));
}

/** First-order stellar aberration. `beta` is v/c in the same frame as `s`. */
export function addAberration(s: Vec3, beta: Vec3): Vec3 {
  const d = vdot(s, beta);
  return vunit([
    s[0] + beta[0] - s[0] * d,
    s[1] + beta[1] - s[1] * d,
    s[2] + beta[2] - s[2] * d,
  ]);
}

export function removeAberration(sApp: Vec3, beta: Vec3): Vec3 {
  const d = vdot(sApp, beta);
  return vunit([
    sApp[0] - beta[0] + sApp[0] * d,
    sApp[1] - beta[1] + sApp[1] * d,
    sApp[2] - beta[2] + sApp[2] * d,
  ]);
}

export function identity(): Mat3 {
  return [1, 0, 0, 0, 1, 0, 0, 0, 1];
}

export function transpose(m: Mat3): Mat3 {
  return [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]];
}

export function matVec(m: Mat3, v: Vec3): Vec3 {
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
  ];
}

export function matMul(a: Mat3, b: Mat3): Mat3 {
  const o = new Array<number>(9);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      o[r * 3 + c] =
        a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c];
    }
  }
  return o as Mat3;
}

export function det3(m: Mat3) {
  return (
    m[0] * (m[4] * m[8] - m[5] * m[7]) -
    m[1] * (m[3] * m[8] - m[5] * m[6]) +
    m[2] * (m[3] * m[7] - m[4] * m[6])
  );
}

function jacobiRotate(m: number[], v: number[], p: number, q: number, c: number, s: number) {
  for (let k = 0; k < 3; k++) {
    if (k === p || k === q) continue;
    const mkp = m[k * 3 + p];
    const mkq = m[k * 3 + q];
    const nkp = c * mkp - s * mkq;
    const nkq = s * mkp + c * mkq;
    m[k * 3 + p] = m[p * 3 + k] = nkp;
    m[k * 3 + q] = m[q * 3 + k] = nkq;
  }
  const mpp = m[p * 3 + p];
  const mqq = m[q * 3 + q];
  const mpq = m[p * 3 + q];
  m[p * 3 + p] = c * c * mpp - 2 * s * c * mpq + s * s * mqq;
  m[q * 3 + q] = s * s * mpp + 2 * s * c * mpq + c * c * mqq;
  m[p * 3 + q] = m[q * 3 + p] = 0;
  for (let r = 0; r < 3; r++) {
    const vip = v[r * 3 + p];
    const viq = v[r * 3 + q];
    v[r * 3 + p] = c * vip - s * viq;
    v[r * 3 + q] = s * vip + c * viq;
  }
}

/** Eigenpairs of a symmetric 3×3, eigenvalues descending, eigenvectors in columns of `v`. */
export function jacobiSym3(A: Mat3): { d: [number, number, number]; v: Mat3 } {
  const m = [...A];
  const v: number[] = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  for (let iter = 0; iter < 32; iter++) {
    const off: [number, number, number][] = [
      [0, 1, Math.abs(m[1])],
      [0, 2, Math.abs(m[2])],
      [1, 2, Math.abs(m[5])],
    ];
    off.sort((a, b) => b[2] - a[2]);
    const [p, q, max] = off[0];
    if (max < 1e-15) break;
    const app = m[p * 3 + p];
    const aqq = m[q * 3 + q];
    const apq = m[p * 3 + q];
    const tau = (aqq - app) / (2 * apq);
    const t = Math.sign(tau || 1) / (Math.abs(tau) + Math.sqrt(1 + tau * tau));
    const cc = 1 / Math.sqrt(1 + t * t);
    const ss = t * cc;
    jacobiRotate(m, v, p, q, cc, ss);
  }
  const order = [0, 1, 2].sort((i, j) => m[j * 3 + j] - m[i * 3 + i]);
  const d: [number, number, number] = [
    m[order[0] * 3 + order[0]],
    m[order[1] * 3 + order[1]],
    m[order[2] * 3 + order[2]],
  ];
  const vv = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let col = 0; col < 3; col++) {
    const src = order[col];
    for (let r = 0; r < 3; r++) vv[r * 3 + col] = v[r * 3 + src];
  }
  return { d, v: vv as Mat3 };
}

/** Thin SVD A = U diag(s) Vᵀ for a 3×3. */
export function svd3(A: Mat3): { u: Mat3; s: [number, number, number]; v: Mat3 } {
  const ata = matMul(transpose(A), A);
  const eig = jacobiSym3(ata);
  const s = eig.d.map((x) => Math.sqrt(Math.max(0, x))) as [number, number, number];
  const v = eig.v;
  const uArr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let k = 0; k < 3; k++) {
    if (s[k] < 1e-14) continue;
    const Av = matVec(A, [v[k], v[3 + k], v[6 + k]]);
    uArr[k] = Av[0] / s[k];
    uArr[3 + k] = Av[1] / s[k];
    uArr[6 + k] = Av[2] / s[k];
  }
  const col = (k: number): Vec3 => [uArr[k], uArr[3 + k], uArr[6 + k]];
  const setCol = (k: number, vec: Vec3) => {
    uArr[k] = vec[0];
    uArr[3 + k] = vec[1];
    uArr[6 + k] = vec[2];
  };
  if (s[0] >= 1e-14 && s[1] >= 1e-14 && s[2] < 1e-12) {
    setCol(2, vcross(col(0), col(1)));
  } else if (s[0] >= 1e-14 && s[1] < 1e-12) {
    const a = col(0);
    const tmp: Vec3 = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    const u1 = vunit(vcross(a, tmp));
    setCol(1, u1);
    setCol(2, vcross(a, u1));
  }
  for (let k = 0; k < 3; k++) setCol(k, vunit(col(k)));
  return { u: uArr as Mat3, s, v };
}

/** Wahba/Kabsch: R such that R · cam ≈ cat. */
export function wahba(cam: Vec3[], cat: Vec3[], w: number[]): Mat3 {
  const B: Mat3 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < cam.length; i++) {
    const wi = w[i];
    const c = cam[i];
    const g = cat[i];
    for (let r = 0; r < 3; r++) {
      B[r * 3] += wi * g[r] * c[0];
      B[r * 3 + 1] += wi * g[r] * c[1];
      B[r * 3 + 2] += wi * g[r] * c[2];
    }
  }
  const { u, v } = svd3(B);
  const vt = transpose(v);
  if (det3(u) * det3(v) < 0) {
    vt[6] = -vt[6];
    vt[7] = -vt[7];
    vt[8] = -vt[8];
  }
  return matMul(u, vt);
}

export function rodrigues(w: Vec3): Mat3 {
  const th = vnorm(w);
  if (th < 1e-14) {
    return [1, -w[2], w[1], w[2], 1, -w[0], -w[1], w[0], 1];
  }
  const k = vscale(w, 1 / th);
  const K: Mat3 = [0, -k[2], k[1], k[2], 0, -k[0], -k[1], k[0], 0];
  const K2 = matMul(K, K);
  const s = Math.sin(th);
  const c = 1 - Math.cos(th);
  const o = identity();
  for (let i = 0; i < 9; i++) o[i] += s * K[i] + c * K2[i];
  return o;
}

/** Solve A x = b for a small dense SPD system. Returns null if singular. */
export function solveSym(a: number[][], b: number[]): number[] | null {
  const n = b.length;
  const m = a.map((row, i) => [...row, b[i]]);
  for (let k = 0; k < n; k++) {
    let piv = k;
    for (let i = k + 1; i < n; i++) if (Math.abs(m[i][k]) > Math.abs(m[piv][k])) piv = i;
    if (Math.abs(m[piv][k]) < 1e-14) return null;
    if (piv !== k) {
      const tmp = m[k];
      m[k] = m[piv];
      m[piv] = tmp;
    }
    const div = m[k][k];
    for (let j = k; j <= n; j++) m[k][j] /= div;
    for (let i = 0; i < n; i++) {
      if (i === k) continue;
      const f = m[i][k];
      for (let j = k; j <= n; j++) m[i][j] -= f * m[k][j];
    }
  }
  return m.map((row) => row[n]);
}

export function invertSym(a: number[][]): number[][] | null {
  const n = a.length;
  const inv: number[][] = [];
  for (let col = 0; col < n; col++) {
    const e = new Array(n).fill(0);
    e[col] = 1;
    const x = solveSym(a, e);
    if (!x) return null;
    for (let i = 0; i < n; i++) {
      inv[i] ??= new Array(n).fill(0);
      inv[i][col] = x[i];
    }
  }
  return inv;
}
