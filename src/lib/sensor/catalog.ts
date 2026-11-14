import {
  addAberration,
  radecToVec,
  type Vec3,
} from "@/lib/sensor/math";

export type SensorCatalog = {
  source: string;
  n: number;
  indexN: number;
  epochJd: number;
  cons: string[];
  consEn: string[];
  hip: Uint32Array;
  raU: Uint32Array;
  decI: Int32Array;
  pmra: Int16Array;
  pmdec: Int16Array;
  mag100: Int16Array;
  plx10: Uint16Array;
  con: Uint8Array;
  names: Record<string, string>;
  /** Triangle vertex indices, angle-sorted, length 3 * triN. */
  triAbc: Uint16Array;
  /** short/long and mid/long, ×10000. */
  triShape: Uint16Array;
  /** Quantized shape → triangle ids. */
  bins: Map<number, number[]>;
};

export type SkyContext = {
  jd: number;
  /** Barycentric observer position, ICRS, AU. */
  posAu?: Vec3;
  /** Observer velocity / c, ICRS. */
  beta?: Vec3;
};

const AU_PER_PC = 206264.80624709636;

function b64ToU8(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function view<T extends ArrayBufferView>(
  b64: string,
  make: (buf: ArrayBuffer) => T,
): T {
  const u8 = b64ToU8(b64);
  const buf = new ArrayBuffer(u8.byteLength);
  new Uint8Array(buf).set(u8);
  return make(buf);
}

type RawCatalog = {
  source: string;
  n: number;
  indexN: number;
  epochJd: number;
  cons: string[];
  consEn: string[];
  hip: string;
  ra: string;
  dec: string;
  pmra: string;
  pmdec: string;
  mag: string;
  plx: string;
  con: string;
  names: Record<string, string>;
  tri: { n: number; abc: string; shape: string };
};

export function decodeCatalog(raw: RawCatalog): SensorCatalog {
  const triAbc = view(raw.tri.abc, (buf) => new Uint16Array(buf));
  const triShape = view(raw.tri.shape, (buf) => new Uint16Array(buf));
  const bins = new Map<number, number[]>();
  const triN = raw.tri.n;
  for (let t = 0; t < triN; t++) {
    const r1 = triShape[t * 2];
    const r2 = triShape[t * 2 + 1];
    const key = (Math.round(r1 / 100) << 8) | Math.round(r2 / 100);
    let list = bins.get(key);
    if (!list) bins.set(key, (list = []));
    list.push(t);
  }
  return {
    source: raw.source,
    n: raw.n,
    indexN: raw.indexN,
    epochJd: raw.epochJd,
    cons: raw.cons,
    consEn: raw.consEn,
    hip: view(raw.hip, (buf) => new Uint32Array(buf)),
    raU: view(raw.ra, (buf) => new Uint32Array(buf)),
    decI: view(raw.dec, (buf) => new Int32Array(buf)),
    pmra: view(raw.pmra, (buf) => new Int16Array(buf)),
    pmdec: view(raw.pmdec, (buf) => new Int16Array(buf)),
    mag100: view(raw.mag, (buf) => new Int16Array(buf)),
    plx10: view(raw.plx, (buf) => new Uint16Array(buf)),
    con: view(raw.con, (buf) => new Uint8Array(buf)),
    names: raw.names,
    triAbc,
    triShape,
    bins,
  };
}

export function starMag(cat: SensorCatalog, i: number) {
  return cat.mag100[i] / 100;
}

export function starName(cat: SensorCatalog, i: number) {
  return cat.names[String(i)] ?? null;
}

/** Geometric ICRS direction at `ctx.jd`, with proper motion and annual parallax. */
export function starGeometric(cat: SensorCatalog, i: number, ctx: SkyContext): Vec3 {
  const ra0 = cat.raU[i] / 1e6;
  const dec0 = cat.decI[i] / 1e6;
  const years = (ctx.jd - cat.epochJd) / 365.25;
  const dec = dec0 + (cat.pmdec[i] * years) / 3.6e6;
  const cosd = Math.cos((dec0 * Math.PI) / 180) || 1e-8;
  let ra = ra0 + (cat.pmra[i] * years) / 3.6e6 / cosd;
  ra = ((ra % 360) + 360) % 360;
  const geo = radecToVec(ra, dec);
  const plxMas = cat.plx10[i] / 10;
  if (plxMas > 0.2 && ctx.posAu) {
    const distAu = (1000 / plxMas) * AU_PER_PC;
    const sx = geo[0] * distAu - ctx.posAu[0];
    const sy = geo[1] * distAu - ctx.posAu[1];
    const sz = geo[2] * distAu - ctx.posAu[2];
    const n = Math.hypot(sx, sy, sz) || 1;
    return [sx / n, sy / n, sz / n];
  }
  return geo;
}

/** Direction the sensor should match: geometric place plus stellar aberration. */
export function starApparent(cat: SensorCatalog, i: number, ctx: SkyContext): Vec3 {
  const geo = starGeometric(cat, i, ctx);
  return ctx.beta ? addAberration(geo, ctx.beta) : geo;
}

export function lookupTriangles(cat: SensorCatalog, r1: number, r2: number): number[] {
  const q1 = Math.round(r1 * 100);
  const q2 = Math.round(r2 * 100);
  const out: number[] = [];
  for (let a = -2; a <= 2; a++) {
    for (let b = -2; b <= 2; b++) {
      const list = cat.bins.get(((q1 + a) << 8) | (q2 + b));
      if (list) out.push(...list);
    }
  }
  return out;
}
