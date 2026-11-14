import type { SensorCatalog, SkyContext } from "@/lib/sensor/catalog";
import { starApparent } from "@/lib/sensor/catalog";
import type { Centroid } from "@/lib/sensor/detect";
import { apparentToPixel, type Camera } from "@/lib/sensor/solve";

/** Paint a synthetic plate and return the true centroids of stars that were drawn. */
export function renderPlate(
  cat: SensorCatalog,
  cam: Camera,
  ctx: SkyContext,
  width: number,
  height: number,
  magLimit = 6.2,
): { gray: Float32Array; truth: Centroid[] } {
  const gray = new Float32Array(width * height);
  gray.fill(8);
  const truth: Centroid[] = [];
  for (let i = 0; i < cat.n; i++) {
    const mag = cat.mag100[i] / 100;
    if (mag > magLimit) continue;
    const app = starApparent(cat, i, ctx);
    const pix = apparentToPixel(cam, app);
    if (!pix) continue;
    if (pix.x < 3 || pix.y < 3 || pix.x > width - 4 || pix.y > height - 4) continue;
    const amp = Math.min(220, 55 * Math.pow(10, -0.28 * Math.max(-1.4, mag - 1.5)));
    const sigma = 1.2;
    const rad = 5;
    const x0 = Math.max(0, Math.floor(pix.x) - rad);
    const x1 = Math.min(width - 1, Math.ceil(pix.x) + rad);
    const y0 = Math.max(0, Math.floor(pix.y) - rad);
    const y1 = Math.min(height - 1, Math.ceil(pix.y) + rad);
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const r2 = (x - pix.x) ** 2 + (y - pix.y) ** 2;
        gray[y * width + x] += amp * Math.exp(-r2 / (2 * sigma * sigma));
      }
    }
    truth.push({ x: pix.x, y: pix.y, flux: amp, peak: amp });
  }
  for (let i = 0; i < gray.length; i++) gray[i] = Math.min(255, gray[i]);
  return { gray, truth };
}

export function addNoise(gray: Float32Array, amplitude: number, seed = 1) {
  let s = seed >>> 0;
  for (let i = 0; i < gray.length; i++) {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    const u = s / 4294967296;
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    const v = s / 4294967296;
    const n = Math.sqrt(-2 * Math.log(Math.max(1e-9, u))) * Math.cos(2 * Math.PI * v);
    gray[i] = Math.min(255, Math.max(0, gray[i] + n * amplitude));
  }
}
