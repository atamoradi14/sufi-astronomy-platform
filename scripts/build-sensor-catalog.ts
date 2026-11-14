/**
 * Build the star-sensor catalog from a HYG CSV (v4 column names).
 * Usage: npx tsx scripts/build-sensor-catalog.ts /tmp/hyg.csv
 * The committed file is public/data/sensor-catalog.json.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type Star = {
  hip: number;
  ra: number;
  dec: number;
  pmra: number;
  pmdec: number;
  mag: number;
  plxMas: number;
  con: string;
  name: string;
};

const DEG = Math.PI / 180;
const csvPath = process.argv[2] ?? "/tmp/hyg.csv";
const outPath = resolve("public/data/sensor-catalog.json");
const iau = JSON.parse(
  readFileSync(resolve("public/data/constellations-iau.json"), "utf8"),
) as { constellations: { id: string; en: string }[] };
const conName = new Map<string, string>();
for (const c of iau.constellations) if (!conName.has(c.id)) conName.set(c.id, c.en);

function parseCsv(text: string): Star[] {
  const lines = text.split(/\r?\n/);
  const header = splitCsv(lines[0]).map((cell) => cell.trim());
  const idx = (name: string) => header.indexOf(name);
  const I = {
    hip: idx("hip"),
    bf: idx("bf"),
    proper: idx("proper"),
    ra: idx("ra"),
    dec: idx("dec"),
    dist: idx("dist"),
    pmra: idx("pmra"),
    pmdec: idx("pmdec"),
    mag: idx("mag"),
    con: idx("con"),
  };
  const stars: Star[] = [];
  for (let li = 1; li < lines.length; li++) {
    const line = lines[li];
    if (!line) continue;
    const row = splitCsv(line);
    const mag = Number(row[I.mag]);
    if (!Number.isFinite(mag) || mag < -1.5 || mag > 6.5) continue;
    const raH = Number(row[I.ra]);
    const dec = Number(row[I.dec]);
    if (!Number.isFinite(raH) || !Number.isFinite(dec)) continue;
    const dist = Number(row[I.dist]);
    const plxMas = dist > 0.05 && dist < 20000 ? 1000 / dist : 0;
    const proper = row[I.proper]?.trim() ?? "";
    const bf = row[I.bf]?.trim() ?? "";
    stars.push({
      hip: Number(row[I.hip]) || 0,
      ra: raH * 15,
      dec,
      pmra: Number(row[I.pmra]) || 0,
      pmdec: Number(row[I.pmdec]) || 0,
      mag,
      plxMas,
      con: row[I.con]?.trim() || "?",
      name: proper || bf,
    });
  }
  stars.sort((a, b) => a.mag - b.mag || a.hip - b.hip);
  return stars;
}

function splitCsv(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"') q = false;
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function ang(a: Star, b: Star): number {
  const ra1 = a.ra * DEG;
  const d1 = a.dec * DEG;
  const ra2 = b.ra * DEG;
  const d2 = b.dec * DEG;
  const c1 = Math.cos(d1);
  const c2 = Math.cos(d2);
  const dot =
    c1 * Math.cos(ra1) * c2 * Math.cos(ra2) +
    c1 * Math.sin(ra1) * c2 * Math.sin(ra2) +
    Math.sin(d1) * Math.sin(d2);
  return Math.acos(Math.min(1, Math.max(-1, dot)));
}

function buildTriangles(
  stars: Star[],
  indexN: number,
  minSide: number,
  maxSide: number,
  neighbors: number,
) {
  const neigh: number[][] = [];
  for (let i = 0; i < indexN; i++) {
    const found: { j: number; a: number }[] = [];
    for (let j = 0; j < indexN; j++) {
      if (i === j) continue;
      const a = ang(stars[i], stars[j]);
      if (a >= minSide && a <= maxSide) found.push({ j, a });
    }
    found.sort((p, q) => p.a - q.a);
    neigh.push(found.slice(0, neighbors).map((p) => p.j));
  }
  const seen = new Set<string>();
  const abc: number[] = [];
  const shape: number[] = [];
  for (let i = 0; i < indexN; i++) {
    const nb = neigh[i];
    for (let p = 0; p < nb.length; p++) {
      for (let q = p + 1; q < nb.length; q++) {
        const j = nb[p];
        const k = nb[q];
        const key = [i, j, k].sort((a, b) => a - b).join("-");
        if (seen.has(key)) continue;
        const s01 = ang(stars[i], stars[j]);
        const s02 = ang(stars[i], stars[k]);
        const s12 = ang(stars[j], stars[k]);
        const sides = [s01, s02, s12].sort((a, b) => a - b);
        if (sides[2] > maxSide || sides[2] < minSide) continue;
        if (sides[0] / sides[2] < 0.22) continue;
        const opp = [s12, s02, s01];
        const id = [i, j, k];
        const order = [0, 1, 2].sort((a, b) => opp[b] - opp[a]);
        const o0 = opp[order[0]];
        const o1 = opp[order[1]];
        const o2 = opp[order[2]];
        if ((o0 - o1) / o0 < 0.045 || (o1 - o2) / o0 < 0.03) continue;
        seen.add(key);
        abc.push(id[order[0]], id[order[1]], id[order[2]]);
        shape.push(
          Math.round((sides[0] / sides[2]) * 10000),
          Math.round((sides[1] / sides[2]) * 10000),
        );
      }
    }
  }
  return { abc, shape };
}

function b64(buf: Buffer) {
  return buf.toString("base64");
}

const stars = parseCsv(readFileSync(csvPath, "utf8"));
const indexN = stars.filter((s) => s.mag <= 6).length;
const brightN = stars.filter((s) => s.mag <= 4.4).length;
const wide = buildTriangles(stars, brightN, 1.5 * DEG, 28 * DEG, 8);
const deep = buildTriangles(stars, indexN, 0.22 * DEG, 10 * DEG, 6);
const abc = wide.abc.concat(deep.abc);
const shape = wide.shape.concat(deep.shape);
const cons: string[] = [];
const conIndex = new Map<string, number>();
function conId(code: string) {
  let i = conIndex.get(code);
  if (i === undefined) {
    i = cons.length;
    cons.push(code);
    conIndex.set(code, i);
  }
  return i;
}

const n = stars.length;
const hip = Buffer.alloc(n * 4);
const ra = Buffer.alloc(n * 4);
const dec = Buffer.alloc(n * 4);
const pmra = Buffer.alloc(n * 2);
const pmdec = Buffer.alloc(n * 2);
const mag = Buffer.alloc(n * 2);
const plx = Buffer.alloc(n * 2);
const con = Buffer.alloc(n);
const names: Record<string, string> = {};
for (let i = 0; i < n; i++) {
  const s = stars[i];
  hip.writeUInt32LE(s.hip >>> 0, i * 4);
  ra.writeUInt32LE(Math.round(s.ra * 1e6) >>> 0, i * 4);
  dec.writeInt32LE(Math.round(s.dec * 1e6), i * 4);
  pmra.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(s.pmra))), i * 2);
  pmdec.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(s.pmdec))), i * 2);
  mag.writeInt16LE(Math.round(s.mag * 100), i * 2);
  plx.writeUInt16LE(Math.max(0, Math.min(65535, Math.round(s.plxMas * 10))), i * 2);
  con[i] = conId(s.con);
  if (s.name && (s.mag <= 5.2 || /[A-Za-z]/.test(s.name) && s.name.length < 18 && !/^\d/.test(s.name) && s.mag <= 6.5)) {
    if (s.mag <= 4.8 || !/^\d/.test(s.name)) names[String(i)] = s.name;
  }
}
const namesKept: Record<string, string> = {};
for (const [k, v] of Object.entries(names)) {
  if (stars[Number(k)].mag <= 5.4 || !/\d/.test(v)) namesKept[k] = v;
}

const payload = {
  v: 1,
  source: "HYG v4.1 (Hipparcos/Yale), ICRS J2000, V ≤ 6.5. Proper motion in mas/yr, parallax in 0.1 mas.",
  n,
  indexN,
  epochJd: 2451545.0,
  cons,
  consEn: cons.map((c) => conName.get(c) ?? c),
  hip: b64(hip),
  ra: b64(ra),
  dec: b64(dec),
  pmra: b64(pmra),
  pmdec: b64(pmdec),
  mag: b64(mag),
  plx: b64(plx),
  con: b64(con),
  names: namesKept,
  tri: {
    n: abc.length / 3,
    abc: b64(Buffer.from(Uint16Array.from(abc).buffer)),
    shape: b64(Buffer.from(Uint16Array.from(shape).buffer)),
  },
};
writeFileSync(outPath, JSON.stringify(payload));
console.log(
  `stars ${n} index ${indexN} triangles ${payload.tri.n} names ${Object.keys(namesKept).length} bytes ${Buffer.byteLength(JSON.stringify(payload))}`,
);
