import type { SkyStar } from "./project";
type StarCatalogV1 = {
  count: number;
  source?: string;
  id: number[];
  ra: number[];
  dec: number[];
  mag: number[];
  bv: number[];
  names: Record<string, string>;
};
type StarCatalogV2 = {
  v: 2;
  c: number;
  e?: string;
  id: string;
  ra: string;
  dec: string;
  mag: string;
  bv: string;
  n: Record<string, string>;
};
function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
export function expandStars(raw: StarCatalogV1 | StarCatalogV2): {
  stars: SkyStar[];
  count: number;
  source: string;
} {
  if ("v" in raw && raw.v === 2) {
    const n = raw.c;
    const asU32 = (b64: string) => {
      const u8 = b64ToBytes(b64);
      return new Uint32Array(u8.buffer, u8.byteOffset, u8.byteLength / 4);
    };
    const asI32 = (b64: string) => {
      const u8 = b64ToBytes(b64);
      return new Int32Array(u8.buffer, u8.byteOffset, u8.byteLength / 4);
    };
    const asI16 = (b64: string) => {
      const u8 = b64ToBytes(b64);
      return new Int16Array(u8.buffer, u8.byteOffset, u8.byteLength / 2);
    };
    const id = asU32(raw.id);
    const ra = asI32(raw.ra);
    const dec = asI16(raw.dec);
    const mag = asI16(raw.mag);
    const bv = asI16(raw.bv);
    const stars: SkyStar[] = new Array(n);
    for (let i = 0; i < n; i++) {
      stars[i] = {
        id: id[i],
        ra: ra[i] / 10000,
        dec: dec[i] / 100,
        mag: mag[i] / 100,
        bv: bv[i] === -32768 ? null : bv[i] / 100,
        n: raw.n[String(i)] ?? null,
      };
    }
    return { stars, count: n, source: "HYG/Hipparcos mag≤7 (packed)" };
  }
  const c = raw as StarCatalogV1;
  const stars: SkyStar[] = new Array(c.count);
  for (let i = 0; i < c.count; i++) {
    stars[i] = {
      id: c.id[i],
      ra: c.ra[i],
      dec: c.dec[i],
      mag: c.mag[i],
      bv: c.bv[i] === -99 ? null : c.bv[i],
      n: c.names[String(i)] ?? null,
    };
  }
  return { stars, count: c.count, source: c.source ?? "star catalog" };
}
