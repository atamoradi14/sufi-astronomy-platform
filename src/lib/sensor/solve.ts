import {
  lookupTriangles,
  starApparent,
  starMag,
  starName,
  type SensorCatalog,
  type SkyContext,
} from "@/lib/sensor/catalog";
import type { Centroid } from "@/lib/sensor/detect";
import {
  ARCSEC_PER_RAD,
  DEG,
  addAberration,
  angleRad,
  clamp,
  det3,
  identity,
  invertSym,
  matMul,
  matVec,
  radecToVec,
  removeAberration,
  rodrigues,
  solveSym,
  svd3,
  transpose,
  vecToRaDec,
  vunit,
  wahba,
  type Mat3,
  type Vec3,
} from "@/lib/sensor/math";

export type Camera = {
  R: Mat3;
  f: number;
  k1: number;
  k2: number;
  cx: number;
  cy: number;
  mirror: boolean;
};

export type SolvedStar = {
  x: number;
  y: number;
  flux: number;
  raDeg: number;
  decDeg: number;
  mag: number | null;
  name: string | null;
  con: string | null;
  hip: number | null;
  residualArcsec: number | null;
  matched: boolean;
};

export type PlateSolution = {
  ok: true;
  camera: Camera;
  width: number;
  height: number;
  /** Geometric ICRS of the image center. */
  raDeg: number;
  decDeg: number;
  sigmaCenterArcsec: number;
  sigmaRollArcsec: number;
  rmsArcsec: number;
  rmsPx: number;
  plateScaleArcsec: number;
  fovXDeg: number;
  fovYDeg: number;
  rollDeg: number;
  inliers: number;
  detections: number;
  mirrored: boolean;
  constellations: { code: string; en: string; count: number }[];
  stars: SolvedStar[];
  beta: Vec3 | null;
};

export type PlateFailure = { ok: false; reason: "too-few-stars" | "no-match" };

export function cameraFromBoresight(
  raDeg: number,
  decDeg: number,
  rollDeg: number,
  f: number,
  width: number,
  height: number,
  k1 = 0,
  k2 = 0,
): Camera {
  const z = radecToVec(raDeg, decDeg);
  const north: Vec3 = [0, 0, 1];
  const drop = north[0] * z[0] + north[1] * z[1] + north[2] * z[2];
  let proj: Vec3 = [north[0] - drop * z[0], north[1] - drop * z[1], north[2] - drop * z[2]];
  if (Math.hypot(...proj) < 1e-4) proj = [1, 0, 0];
  const n = vunit(proj);
  const y0 = vunit([-n[0], -n[1], -n[2]]);
  const x0: Vec3 = [
    z[1] * y0[2] - z[2] * y0[1],
    z[2] * y0[0] - z[0] * y0[2],
    z[0] * y0[1] - z[1] * y0[0],
  ];
  const cr = Math.cos(rollDeg * DEG);
  const sr = Math.sin(rollDeg * DEG);
  const x = vunit([
    x0[0] * cr + y0[0] * sr,
    x0[1] * cr + y0[1] * sr,
    x0[2] * cr + y0[2] * sr,
  ]);
  const y = vunit([
    -x0[0] * sr + y0[0] * cr,
    -x0[1] * sr + y0[1] * cr,
    -x0[2] * sr + y0[2] * cr,
  ]);
  const R: Mat3 = [x[0], y[0], z[0], x[1], y[1], z[1], x[2], y[2], z[2]];
  return {
    R,
    f,
    k1,
    k2,
    cx: (width - 1) / 2,
    cy: (height - 1) / 2,
    mirror: false,
  };
}

function cameraUnit(cam: Camera, x: number, y: number): Vec3 {
  const sign = cam.mirror ? -1 : 1;
  const xd = (sign * (x - cam.cx)) / cam.f;
  const yd = (y - cam.cy) / cam.f;
  let xu = xd;
  let yu = yd;
  for (let i = 0; i < 7; i++) {
    const r2 = xu * xu + yu * yu;
    const s = 1 + cam.k1 * r2 + cam.k2 * r2 * r2;
    if (Math.abs(s) < 1e-8) break;
    xu = xd / s;
    yu = yd / s;
  }
  return vunit([xu, yu, 1]);
}

export function pixelToApparent(cam: Camera, x: number, y: number): Vec3 {
  return matVec(cam.R, cameraUnit(cam, x, y));
}

export function pixelToIcrs(cam: Camera, x: number, y: number, beta: Vec3 | null): Vec3 {
  const app = pixelToApparent(cam, x, y);
  return beta ? removeAberration(app, beta) : app;
}

export function apparentToPixel(cam: Camera, vApp: Vec3): { x: number; y: number } | null {
  const Rt = transpose(cam.R);
  const c = matVec(Rt, vApp);
  if (c[2] <= 0.02) return null;
  const xu = c[0] / c[2];
  const yu = c[1] / c[2];
  const r2 = xu * xu + yu * yu;
  const s = 1 + cam.k1 * r2 + cam.k2 * r2 * r2;
  const sign = cam.mirror ? -1 : 1;
  return { x: cam.cx + sign * cam.f * xu * s, y: cam.cy + cam.f * yu * s };
}

function dist2(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

type Pair = { det: number; star: number; d2: number };

function collectInliers(
  catN: number,
  vecs: Float64Array,
  cam: Camera,
  dets: Centroid[],
  width: number,
  height: number,
  threshPx: number,
): Pair[] {
  const bore = matVec(cam.R, [0, 0, 1]);
  const half = Math.hypot(width, height) / 2;
  const maxAng = Math.atan((half + threshPx) / cam.f) + 0.03;
  const cosMin = Math.cos(maxAng);
  const cell = Math.max(4, threshPx);
  const grid = new Map<number, number[]>();
  const key = (x: number, y: number) =>
    (Math.floor(x / cell) + 4000) * 8000 + Math.floor(y / cell) + 4000;
  dets.forEach((d, i) => {
    const k = key(d.x, d.y);
    const list = grid.get(k);
    if (list) list.push(i);
    else grid.set(k, [i]);
  });
  const found: Pair[] = [];
  for (let s = 0; s < catN; s++) {
    const vx = vecs[s * 3];
    const vy = vecs[s * 3 + 1];
    const vz = vecs[s * 3 + 2];
    if (vx * bore[0] + vy * bore[1] + vz * bore[2] < cosMin) continue;
    const pix = apparentToPixel(cam, [vx, vy, vz]);
    if (!pix) continue;
    if (pix.x < -threshPx || pix.y < -threshPx || pix.x > width + threshPx || pix.y > height + threshPx)
      continue;
    const gx = Math.floor(pix.x / cell);
    const gy = Math.floor(pix.y / cell);
    let best = -1;
    let bestD = threshPx * threshPx;
    for (let oy = -1; oy <= 1; oy++) {
      for (let ox = -1; ox <= 1; ox++) {
        const list = grid.get((gx + ox + 4000) * 8000 + (gy + oy + 4000));
        if (!list) continue;
        for (const di of list) {
          const d2 = dist2(pix.x, pix.y, dets[di].x, dets[di].y);
          if (d2 < bestD) {
            bestD = d2;
            best = di;
          }
        }
      }
    }
    if (best >= 0) found.push({ det: best, star: s, d2: bestD });
  }
  found.sort((a, b) => a.d2 - b.d2);
  const usedD = new Set<number>();
  const usedS = new Set<number>();
  const pairs: Pair[] = [];
  for (const p of found) {
    if (usedD.has(p.det) || usedS.has(p.star)) continue;
    usedD.add(p.det);
    usedS.add(p.star);
    pairs.push(p);
  }
  return pairs;
}

function paramNames(nPairs: number) {
  const names = ["wx", "wy", "wz", "logf"];
  if (nPairs >= 10) names.push("k1");
  if (nPairs >= 16) names.push("k2");
  if (nPairs >= 22) names.push("cx", "cy");
  return names;
}

function applyDelta(cam: Camera, names: string[], d: number[]): Camera {
  const next: Camera = { ...cam, R: [...cam.R] as Mat3 };
  let k = 0;
  const w: Vec3 = [d[k++] ?? 0, d[k++] ?? 0, d[k++] ?? 0];
  next.R = matMul(rodrigues(w), cam.R);
  next.f = cam.f * Math.exp(clamp(d[k++] ?? 0, -0.4, 0.4));
  if (names.includes("k1")) next.k1 = clamp(cam.k1 + (d[k++] ?? 0), -0.7, 0.7);
  if (names.includes("k2")) next.k2 = clamp(cam.k2 + (d[k++] ?? 0), -0.5, 0.5);
  if (names.includes("cx")) {
    next.cx = cam.cx + (d[k++] ?? 0);
    next.cy = cam.cy + (d[k++] ?? 0);
  }
  return next;
}

function residuals(
  cam: Camera,
  pairs: Pair[],
  dets: Centroid[],
  vecs: Float64Array,
): number[] {
  const r: number[] = [];
  for (const p of pairs) {
    const pix = apparentToPixel(cam, [
      vecs[p.star * 3],
      vecs[p.star * 3 + 1],
      vecs[p.star * 3 + 2],
    ]);
    if (!pix) {
      r.push(40, 40);
      continue;
    }
    r.push(pix.x - dets[p.det].x, pix.y - dets[p.det].y);
  }
  return r;
}

function chi2(r: number[]) {
  let s = 0;
  for (const v of r) s += v * v;
  return s;
}

function fitCamera(
  cam0: Camera,
  pairs: Pair[],
  dets: Centroid[],
  vecs: Float64Array,
): { cam: Camera; resid: number[]; names: string[] } {
  const names = paramNames(pairs.length);
  const eps: Record<string, number> = {
    wx: 1e-5,
    wy: 1e-5,
    wz: 1e-5,
    logf: 1e-4,
    k1: 2e-4,
    k2: 2e-4,
    cx: 0.05,
    cy: 0.05,
  };
  let cam = cam0;
  let resid = residuals(cam, pairs, dets, vecs);
  let cost = chi2(resid);
  let lambda = 1e-2;
  for (let iter = 0; iter < 14; iter++) {
    const n = names.length;
    const m = resid.length;
    const J: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
    for (let p = 0; p < n; p++) {
      const step = new Array(n).fill(0);
      step[p] = eps[names[p]];
      const rp = residuals(applyDelta(cam, names, step), pairs, dets, vecs);
      const h = step[p] || 1;
      for (let i = 0; i < m; i++) J[i][p] = (rp[i] - resid[i]) / h;
    }
    const A: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    const b = new Array(n).fill(0);
    for (let i = 0; i < m; i++) {
      for (let c = 0; c < n; c++) {
        b[c] += J[i][c] * resid[i];
        for (let d = 0; d < n; d++) A[c][d] += J[i][c] * J[i][d];
      }
    }
    for (let c = 0; c < n; c++) A[c][c] += lambda * (A[c][c] + 1e-6);
    const delta = solveSym(A, b.map((v) => -v));
    if (!delta) {
      lambda *= 5;
      continue;
    }
    const trial = applyDelta(cam, names, delta);
    const tr = residuals(trial, pairs, dets, vecs);
    const tc = chi2(tr);
    if (tc < cost) {
      cam = trial;
      resid = tr;
      cost = tc;
      lambda = Math.max(1e-6, lambda * 0.4);
      if (Math.hypot(...delta) < 1e-8) break;
    } else {
      lambda = Math.min(1e6, lambda * 5);
    }
  }
  return { cam, resid, names };
}

function covariance(
  cam: Camera,
  names: string[],
  pairs: Pair[],
  dets: Centroid[],
  vecs: Float64Array,
  resid: number[],
) {
  const n = names.length;
  const m = resid.length;
  const eps: Record<string, number> = {
    wx: 1e-5,
    wy: 1e-5,
    wz: 1e-5,
    logf: 1e-4,
    k1: 2e-4,
    k2: 2e-4,
    cx: 0.05,
    cy: 0.05,
  };
  const J: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
  for (let p = 0; p < n; p++) {
    const step = new Array(n).fill(0);
    step[p] = eps[names[p]];
    const rp = residuals(applyDelta(cam, names, step), pairs, dets, vecs);
    for (let i = 0; i < m; i++) J[i][p] = (rp[i] - resid[i]) / (step[p] || 1);
  }
  const A: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let c = 0; c < n; c++)
      for (let d = 0; d < n; d++) A[c][d] += J[i][c] * J[i][d];
  }
  const dof = Math.max(1, m - n);
  const sigma2 = chi2(resid) / dof;
  const inv = invertSym(A);
  return { sigma2, inv, names };
}

type Hit = {
  scale: number;
  err: number;
  dets: [number, number, number];
  stars: [number, number, number];
};

function solveParity(
  cat: SensorCatalog,
  dets: Centroid[],
  vecs: Float64Array,
  width: number,
  height: number,
  mirror: boolean,
): { cam: Camera; pairs: Pair[] } | null {
  const ids = dets
    .map((_, i) => i)
    .sort((a, b) => dets[b].flux - dets[a].flux);
  const triList: { dets: [number, number, number]; cands: Hit[]; deep: boolean }[] = [];
  const pixSide = (i: number, j: number) =>
    Math.hypot(dets[i].x - dets[j].x, dets[i].y - dets[j].y);
  const angSide = (i: number, j: number) => {
    const ax = vecs[i * 3];
    const ay = vecs[i * 3 + 1];
    const az = vecs[i * 3 + 2];
    const bx = vecs[j * 3];
    const by = vecs[j * 3 + 1];
    const bz = vecs[j * 3 + 2];
    return Math.acos(clamp(ax * bx + ay * by + az * bz, -1, 1));
  };
  const seenTri = new Set<string>();
  const groups = [
    { list: ids.slice(0, 48), maxFrac: 0.72, minPx: 18, neigh: 7 },
    { list: ids.slice(0, 520), maxFrac: 0.16, minPx: 10, neigh: 5 },
  ];
  for (const group of groups) {
  const maxPix = group.maxFrac * Math.min(width, height);
  const near = new Map<number, number[]>();
  for (const a of group.list) {
    const row: { j: number; d: number }[] = [];
    for (const b of group.list) {
      if (a === b) continue;
      const d = pixSide(a, b);
      if (d >= group.minPx && d <= maxPix) row.push({ j: b, d });
    }
    row.sort((p, q) => p.d - q.d);
    near.set(a, row.slice(0, group.neigh).map((p) => p.j));
  }
  for (const a of group.list) {
    const nb = near.get(a) ?? [];
    for (let p = 0; p < nb.length; p++) {
      for (let q = p + 1; q < nb.length; q++) {
        const b = nb[p];
        const c = nb[q];
        const triKey = [a, b, c].sort((i, j) => i - j).join(",");
        if (seenTri.has(triKey)) continue;
        seenTri.add(triKey);
        const ab = pixSide(a, b);
        const ac = pixSide(a, c);
        const bc = pixSide(b, c);
        if (ab < group.minPx || ac < group.minPx || bc < group.minPx) continue;
        const sides = [ab, ac, bc].sort((p, q) => p - q);
        if (sides[2] > maxPix || sides[0] / sides[2] < 0.2) continue;
        const opp = [bc, ac, ab];
        const id = [a, b, c];
        const order = [0, 1, 2].sort((p, q) => opp[q] - opp[p]);
        if ((opp[order[0]] - opp[order[1]]) / opp[order[0]] < 0.04) continue;
        const r1 = sides[0] / sides[2];
        const r2 = sides[1] / sides[2];
        const cand = lookupTriangles(cat, r1, r2);
        const di: [number, number, number] = [id[order[0]], id[order[1]], id[order[2]]];
        const cands: Hit[] = [];
        for (const t of cand) {
          const sr1 = cat.triShape[t * 2] / 10000;
          const sr2 = cat.triShape[t * 2 + 1] / 10000;
          const err = Math.hypot(sr1 - r1, sr2 - r2);
          if (err > 0.02) continue;
          const s0 = cat.triAbc[t * 3];
          const s1 = cat.triAbc[t * 3 + 1];
          const s2 = cat.triAbc[t * 3 + 2];
          const as = [angSide(s0, s1), angSide(s0, s2), angSide(s1, s2)];
          const ps = [pixSide(di[0], di[1]), pixSide(di[0], di[2]), pixSide(di[1], di[2])];
          let smin = Infinity;
          let smax = 0;
          let ssum = 0;
          for (let k = 0; k < 3; k++) {
            const sc = as[k] / ps[k];
            ssum += sc;
            if (sc < smin) smin = sc;
            if (sc > smax) smax = sc;
          }
          if (!(smax > 0) || smax / smin > 1.08) continue;
          cands.push({ scale: ssum / 3, err, dets: di, stars: [s0, s1, s2] });
        }
        if (cands.length) {
          cands.sort((p, q) => p.err - q.err);
          triList.push({
            dets: di,
            cands: cands.slice(0, 12),
            deep: group.maxFrac < 0.4,
          });
        }
      }
    }
  }
  }
  if (triList.length < 2) return null;

  type EdgeRec = { tri: number; ci: number; sa: number; sb: number };
  const byEdge = new Map<string, EdgeRec[]>();
  const vote = new Map<Hit, number>();
  const deepVote = new Map<Hit, number>();
  for (let ti = 0; ti < triList.length; ti++) {
    const tr = triList[ti];
    for (let ci = 0; ci < tr.cands.length; ci++) {
      const stars = tr.cands[ci].stars;
      for (let e = 0; e < 3; e++) {
        const i = e;
        const j = (e + 1) % 3;
        const da = tr.dets[i];
        const db = tr.dets[j];
        const key = da < db ? `${da},${db}` : `${db},${da}`;
        const prev = byEdge.get(key);
        const rec: EdgeRec = { tri: ti, ci, sa: stars[i], sb: stars[j] };
        if (prev) {
          for (const other of prev) {
            if (other.tri === ti) continue;
            const same =
              (rec.sa === other.sa && rec.sb === other.sb) ||
              (rec.sa === other.sb && rec.sb === other.sa);
            if (!same) continue;
            const a = tr.cands[ci];
            const b = triList[other.tri].cands[other.ci];
            if (Math.abs(a.scale - b.scale) / a.scale > 0.06) continue;
            const dk = (tr.dets[0] + tr.dets[1] + tr.dets[2]) ^ (triList[other.tri].dets[0] + triList[other.tri].dets[1] + triList[other.tri].dets[2]);
            if (dk === 0 && tr.dets.every((d) => triList[other.tri].dets.includes(d))) continue;
            const pick = a.err <= b.err ? a : b;
            vote.set(pick, (vote.get(pick) ?? 0) + 1);
            if (tr.deep && triList[other.tri].deep) deepVote.set(pick, (deepVote.get(pick) ?? 0) + 1);
          }
        }
        if (!prev) byEdge.set(key, [rec]);
        else if (prev.length < 40) prev.push(rec);
      }
    }
  }
  const binOf = (h: Hit) => Math.round(1 / h.scale / 50) * 50;
  const pool = deepVote.size >= 8 ? [...deepVote.keys()] : [...vote.keys()];
  const counts = new Map<number, number>();
  for (const h of pool) counts.set(binOf(h), (counts.get(binOf(h)) ?? 0) + (deepVote.get(h) ?? vote.get(h) ?? 1));
  let peakF = 0;
  let peakN = 0;
  for (const [f, n] of counts) {
    const score = n + (counts.get(f - 50) ?? 0) + (counts.get(f + 50) ?? 0);
    if (score > peakN) {
      peakN = score;
      peakF = f;
    }
  }
  let ranked = pool
    .filter((h) => Math.abs(binOf(h) - peakF) <= 75)
    .sort(
      (a, b) =>
        (deepVote.get(b) ?? vote.get(b) ?? 0) - (deepVote.get(a) ?? vote.get(a) ?? 0) ||
        a.err - b.err,
    )
    .slice(0, 24);
  if (ranked.length < 4) {
    const singles = triList
      .map((tr) => tr.cands[0])
      .filter((h): h is Hit => !!h)
      .sort((a, b) => a.err - b.err)
      .slice(0, 24);
    ranked = singles;
  }

  const cx = (width - 1) / 2;
  const cy = (height - 1) / 2;
  let best: { cam: Camera; pairs: Pair[]; score: number } | null = null;
  for (const h of ranked) {
    const f = polishF(h, dets, vecs, 1 / h.scale, cx, cy, mirror);
    const camVecs: Vec3[] = h.dets.map((di) =>
      cameraUnit({ R: identity(), f, k1: 0, k2: 0, cx, cy, mirror }, dets[di].x, dets[di].y),
    );
    const catVecs: Vec3[] = h.stars.map((si) => [
      vecs[si * 3],
      vecs[si * 3 + 1],
      vecs[si * 3 + 2],
    ]);
    const R = wahba(camVecs, catVecs, [1, 1, 1]);
    const cam: Camera = { R, f, k1: 0, k2: 0, cx, cy, mirror };
    const loose = collectInliers(cat.n, vecs, cam, dets, width, height, 16);
    // A 16 px gate on a wide, dense plate counts chance alignments. A real
    // match also puts a core of stars within a few pixels.
    const tight = collectInliers(cat.n, vecs, cam, dets, width, height, 4);
    const pairs = tight.length >= 6 ? tight : loose;
    if (pairs.length < 6 || tight.length < 4) continue;
    const mean = pairs.reduce((s, p) => s + p.d2, 0) / pairs.length;
    const score = tight.length * 1000 - mean;
    if (!best || score > best.score) best = { cam, pairs, score };
  }
  if (!best) return null;
  return best;
}

function polishF(
  h: Hit,
  dets: Centroid[],
  vecs: Float64Array,
  f0: number,
  cx: number,
  cy: number,
  mirror: boolean,
) {
  const catAng: number[] = [];
  const pix: { x: number; y: number }[] = [];
  for (let i = 0; i < 3; i++) {
    pix.push(dets[h.dets[i]]);
    const s = h.stars[i];
    if (i) {
      const p = h.stars[0];
      catAng.push(
        Math.acos(
          clamp(
            vecs[p * 3] * vecs[s * 3] +
              vecs[p * 3 + 1] * vecs[s * 3 + 1] +
              vecs[p * 3 + 2] * vecs[s * 3 + 2],
            -1,
            1,
          ),
        ),
      );
    }
  }
  const err = (f: number) => {
    const cam: Camera = { R: identity(), f, k1: 0, k2: 0, cx, cy, mirror };
    const u = pix.map((p) => cameraUnit(cam, p.x, p.y));
    let e = 0;
    e += (angleRad(u[0], u[1]) - catAng[0]) ** 2;
    e += (angleRad(u[0], u[2]) - catAng[1]) ** 2;
    e += (angleRad(u[1], u[2]) - angleRad(
      [vecs[h.stars[1] * 3], vecs[h.stars[1] * 3 + 1], vecs[h.stars[1] * 3 + 2]],
      [vecs[h.stars[2] * 3], vecs[h.stars[2] * 3 + 1], vecs[h.stars[2] * 3 + 2]],
    )) ** 2;
    return e;
  };
  const lo = Math.max(15, f0 * 0.93);
  const hi = f0 * 1.07;
  let f = f0;
  let best = err(f);
  for (const s of [0.95, 0.98, 1, 1.02, 1.05]) {
    const trial = clamp(f0 * s, lo, hi);
    const e = err(trial);
    if (e < best) {
      best = e;
      f = trial;
    }
  }
  let step = f * 0.015;
  for (let i = 0; i < 12; i++) {
    const e0 = err(f);
    const up = Math.min(hi, f + step);
    const down = Math.max(lo, f - step);
    const ep = err(up);
    const em = err(down);
    if (ep < e0 && ep <= em) f = up;
    else if (em < e0) f = down;
    else step *= 0.45;
  }
  return f;
}

function median(values: number[]) {
  if (values.length === 0) return 0;
  const s = [...values].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function signedArea(
  a: { x: number; y: number },
  b: { x: number; y: number },
  c: { x: number; y: number },
) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

/** True when the pixel order of matched stars is a mirror of their sky order. */
function patternIsMirrored(stars: SolvedStar[], bore: Vec3): boolean {
  const matched = stars.filter((s) => s.matched).sort((a, b) => b.flux - a.flux);
  const limit = Math.min(matched.length, 10);
  let best = 0;
  let pick: [SolvedStar, SolvedStar, SolvedStar] | null = null;
  for (let i = 0; i < limit; i++) {
    for (let j = i + 1; j < limit; j++) {
      for (let k = j + 1; k < limit; k++) {
        const area = Math.abs(signedArea(matched[i], matched[j], matched[k]));
        if (area > best) {
          best = area;
          pick = [matched[i], matched[j], matched[k]];
        }
      }
    }
  }
  if (!pick || best < 40) return false;
  let ref: Vec3 = [0, 0, 1];
  const along =
    ref[0] * bore[0] + ref[1] * bore[1] + ref[2] * bore[2];
  if (Math.abs(along) > 0.95) ref = [1, 0, 0];
  const east = vunit(cross(ref, bore));
  const south = vunit(cross(east, bore));
  const tangent = (s: SolvedStar) => {
    const v = radecToVec(s.raDeg, s.decDeg);
    return {
      x: east[0] * v[0] + east[1] * v[1] + east[2] * v[2],
      y: south[0] * v[0] + south[1] * v[1] + south[2] * v[2],
    };
  };
  const sky = signedArea(tangent(pick[0]), tangent(pick[1]), tangent(pick[2]));
  const image = signedArea(pick[0], pick[1], pick[2]);
  return image * sky < 0;
}

function tightCount(
  catN: number,
  vecs: Float64Array,
  cam: Camera,
  dets: Centroid[],
  width: number,
  height: number,
  px = 3.5,
) {
  return collectInliers(catN, vecs, cam, dets, width, height, px).length;
}

/**
 * Radial distortion is weakly constrained by the inner stars alone, and a
 * free Levenberg–Marquardt step will invent k1/k2 to absorb false matches.
 * Search a small grid and keep the distortion that lands the most stars
 * within a few pixels.
 */
function tuneDistortion(
  catN: number,
  vecs: Float64Array,
  cam: Camera,
  dets: Centroid[],
  width: number,
  height: number,
): Camera {
  let best = cam;
  let bestN = tightCount(catN, vecs, cam, dets, width, height);
  for (const k1 of [-0.24, -0.16, -0.1, -0.06, -0.03, 0, 0.04, 0.08]) {
    for (const k2 of [-0.04, 0, 0.03]) {
      const trial = { ...cam, k1, k2 };
      const n = tightCount(catN, vecs, trial, dets, width, height);
      if (n > bestN) {
        bestN = n;
        best = trial;
      }
    }
  }
  return best;
}

function rollOf(cam: Camera, beta: Vec3 | null) {
  const north = beta ? addAberration([0, 0, 1], beta) : ([0, 0, 1] as Vec3);
  const n = matVec(transpose(cam.R), north);
  let deg = Math.atan2(n[0], -n[1]) / DEG;
  if (deg < 0) deg += 360;
  return deg;
}

export function solvePlate(
  cat: SensorCatalog,
  dets: Centroid[],
  width: number,
  height: number,
  ctx: SkyContext,
): PlateSolution | PlateFailure {
  if (dets.length < 4) return { ok: false, reason: "too-few-stars" };
  const vecs = new Float64Array(cat.n * 3);
  for (let i = 0; i < cat.n; i++) {
    const v = starApparent(cat, i, ctx);
    vecs[i * 3] = v[0];
    vecs[i * 3 + 1] = v[1];
    vecs[i * 3 + 2] = v[2];
  }
  const direct = solveParity(cat, dets, vecs, width, height, false);
  const flipped = solveParity(cat, dets, vecs, width, height, true);
  const pick = (a: typeof direct, b: typeof flipped) => {
    if (!a) return b;
    if (!b) return a;
    const quality = (s: NonNullable<typeof a>) => {
      const med = median(s.pairs.map((p) => Math.sqrt(p.d2)));
      return s.pairs.length / (med + 0.35);
    };
    return quality(a) >= quality(b) ? a : b;
  };
  const won = pick(direct, flipped);
  if (!won) return { ok: false, reason: "no-match" };
  const { u, v } = svd3(won.cam.R);
  let R = matMul(u, transpose(v));
  if (det3(R) < 0) {
    u[2] *= -1;
    u[5] *= -1;
    u[8] *= -1;
    R = matMul(u, transpose(v));
  }
  let cam: Camera = tuneDistortion(cat.n, vecs, { ...won.cam, R }, dets, width, height);
  let pairs = collectInliers(cat.n, vecs, cam, dets, width, height, 4.5);
  if (pairs.length < 6) pairs = won.pairs;
  let names = paramNames(pairs.length);
  for (let pass = 0; pass < 3; pass++) {
    if (pairs.length < 6) break;
    const before = tightCount(cat.n, vecs, cam, dets, width, height);
    const fit = fitCamera(cam, pairs, dets, vecs);
    const after = tightCount(cat.n, vecs, fit.cam, dets, width, height);
    if (after + 1 < before) break;
    cam = fit.cam;
    names = fit.names;
    const med = median(pairs.map((p) => Math.sqrt(p.d2)));
    const gate = clamp(Math.max(3, med * 2.2), 3, 5.5);
    const next = collectInliers(cat.n, vecs, cam, dets, width, height, gate);
    if (next.length >= 6) pairs = next;
  }
  if (pairs.length < 6) return { ok: false, reason: "no-match" };
  const wide = collectInliers(cat.n, vecs, cam, dets, width, height, 12);
  const medWide = median(wide.map((p) => Math.sqrt(p.d2)));
  const clip = clamp(Math.max(3, medWide * 2.2), 3, 6);
  const clipped = wide.filter((p) => p.d2 <= clip * clip);
  if (clipped.length >= pairs.length) pairs = clipped;
  const refit = fitCamera(cam, pairs, dets, vecs);
  if (tightCount(cat.n, vecs, refit.cam, dets, width, height) + 1 >= tightCount(cat.n, vecs, cam, dets, width, height)) {
    cam = refit.cam;
    names = refit.names;
  }
  const camF = cam;
  const resid = residuals(camF, pairs, dets, vecs);
  const rmsPx = Math.sqrt(chi2(resid) / pairs.length);
  const medPx = median(pairs.map((p) => Math.sqrt(p.d2)));
  if (pairs.length < 6 || (rmsPx > 4.5 && medPx > 3.2)) return { ok: false, reason: "no-match" };
  const plate = ARCSEC_PER_RAD / camF.f;
  const cov = covariance(camF, names, pairs, dets, vecs, resid);
  let sigmaCenter = rmsPx * plate / Math.sqrt(pairs.length);
  let sigmaRoll = sigmaCenter;
  if (cov.inv) {
    const ix = cov.names.indexOf("wx");
    const iy = cov.names.indexOf("wy");
    const iz = cov.names.indexOf("wz");
    const varBore = cov.sigma2 * (cov.inv[ix][ix] + cov.inv[iy][iy]);
    let varPx = 0;
    const icx = cov.names.indexOf("cx");
    if (icx >= 0) {
      const icy = cov.names.indexOf("cy");
      varPx = cov.sigma2 * (cov.inv[icx][icx] + cov.inv[icy][icy]);
    }
    sigmaCenter = Math.hypot(Math.sqrt(Math.max(0, varBore)), Math.sqrt(Math.max(0, varPx)) / camF.f) * ARCSEC_PER_RAD;
    sigmaRoll = Math.sqrt(Math.max(0, cov.sigma2 * cov.inv[iz][iz])) * ARCSEC_PER_RAD;
  }
  const beta = ctx.beta ?? null;
  const center = vecToRaDec(pixelToIcrs(camF, (width - 1) / 2, (height - 1) / 2, beta));
  const pairByDet = new Map(pairs.map((p) => [p.det, p]));
  const counts = new Map<number, number>();
  const stars: SolvedStar[] = dets.map((d) => {
    const icrs = vecToRaDec(pixelToIcrs(camF, d.x, d.y, beta));
    return {
      x: d.x,
      y: d.y,
      flux: d.flux,
      raDeg: icrs.raDeg,
      decDeg: icrs.decDeg,
      mag: null,
      name: null,
      con: null,
      hip: null,
      residualArcsec: null,
      matched: false,
    };
  });
  dets.forEach((d, i) => {
    const pair = pairByDet.get(i);
    if (!pair) return;
    const pix = apparentToPixel(camF, [
      vecs[pair.star * 3],
      vecs[pair.star * 3 + 1],
      vecs[pair.star * 3 + 2],
    ]);
    const dx = pix ? pix.x - d.x : 0;
    const dy = pix ? pix.y - d.y : 0;
    const code = cat.cons[cat.con[pair.star]] ?? "?";
    stars[i] = {
      ...stars[i],
      mag: starMag(cat, pair.star),
      name: starName(cat, pair.star),
      con: code === "?" ? null : code,
      hip: cat.hip[pair.star] || null,
      residualArcsec: Math.hypot(dx, dy) * plate,
      matched: true,
    };
    if (code !== "?") counts.set(cat.con[pair.star], (counts.get(cat.con[pair.star]) ?? 0) + 1);
  });
  const constellations = [...counts.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({
      code: cat.cons[id],
      en: cat.consEn[id] ?? cat.cons[id],
      count,
    }));
  const left = pixelToApparent(camF, 0, (height - 1) / 2);
  const right = pixelToApparent(camF, width - 1, (height - 1) / 2);
  const top = pixelToApparent(camF, (width - 1) / 2, 0);
  const bot = pixelToApparent(camF, (width - 1) / 2, height - 1);
  return {
    ok: true,
    camera: camF,
    width,
    height,
    raDeg: center.raDeg,
    decDeg: center.decDeg,
    sigmaCenterArcsec: sigmaCenter,
    sigmaRollArcsec: sigmaRoll,
    rmsArcsec: rmsPx * plate,
    rmsPx,
    plateScaleArcsec: plate,
    fovXDeg: angleRad(left, right) / DEG,
    fovYDeg: angleRad(top, bot) / DEG,
    rollDeg: rollOf(camF, beta),
    inliers: pairs.length,
    detections: dets.length,
    mirrored: patternIsMirrored(stars, pixelToIcrs(camF, (width - 1) / 2, (height - 1) / 2, beta)),
    constellations,
    stars,
    beta,
  };
}
