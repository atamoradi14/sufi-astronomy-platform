export type Centroid = {
  x: number;
  y: number;
  flux: number;
  peak: number;
};

/**
 * Sub-pixel star centroids on a grayscale frame.
 * Background is a wide boxcar; peaks are moment-centroids of round sources.
 */
export function detectStars(
  gray: Float32Array,
  width: number,
  height: number,
): Centroid[] {
  const n = width * height;
  const integral = new Float64Array(n);
  const row = new Float64Array(width);
  for (let y = 0; y < height; y++) {
    let run = 0;
    const yoff = y * width;
    for (let x = 0; x < width; x++) {
      run += gray[yoff + x];
      row[x] = run;
      integral[yoff + x] = row[x] + (y > 0 ? integral[yoff - width + x] : 0);
    }
  }
  const radius = Math.max(12, Math.round(Math.min(width, height) / 48));
  const box = (x0: number, y0: number, x1: number, y1: number) => {
    const A = integral[y1 * width + x1];
    const B = x0 > 0 ? integral[y1 * width + (x0 - 1)] : 0;
    const C = y0 > 0 ? integral[(y0 - 1) * width + x1] : 0;
    const D = x0 > 0 && y0 > 0 ? integral[(y0 - 1) * width + (x0 - 1)] : 0;
    return A - B - C + D;
  };
  const signal = new Float32Array(n);
  const sample: number[] = [];
  for (let y = 0; y < height; y++) {
    const y0 = Math.max(0, y - radius);
    const y1 = Math.min(height - 1, y + radius);
    for (let x = 0; x < width; x++) {
      const x0 = Math.max(0, x - radius);
      const x1 = Math.min(width - 1, x + radius);
      const area = (x1 - x0 + 1) * (y1 - y0 + 1);
      const bg = box(x0, y0, x1, y1) / area;
      const s = gray[y * width + x] - bg;
      signal[y * width + x] = s;
      if ((x & 7) === 0 && (y & 7) === 0) sample.push(s);
    }
  }
  sample.sort((a, b) => a - b);
  const mid = sample[Math.floor(sample.length / 2)] ?? 0;
  const dev = sample.map((v) => Math.abs(v - mid)).sort((a, b) => a - b);
  const mad = dev[Math.floor(dev.length / 2)] ?? 1;
  const sigma = Math.max(0.4, 1.4826 * mad);
  const threshold = mid + 5.2 * sigma;

  const peaks: { x: number; y: number; peak: number }[] = [];
  const margin = radius;
  for (let y = margin; y < height - margin; y++) {
    for (let x = margin; x < width - margin; x++) {
      const v = signal[y * width + x];
      if (v < threshold) continue;
      let max = true;
      for (let dy = -1; dy <= 1 && max; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          if (signal[(y + dy) * width + x + dx] > v) {
            max = false;
            break;
          }
        }
      }
      if (max) peaks.push({ x, y, peak: v });
    }
  }
  peaks.sort((a, b) => b.peak - a.peak);
  const kept: { x: number; y: number; peak: number }[] = [];
  for (const p of peaks) {
    if (kept.some((k) => (k.x - p.x) ** 2 + (k.y - p.y) ** 2 < 16)) continue;
    kept.push(p);
    if (kept.length >= 160) break;
  }

  const out: Centroid[] = [];
  const win = 4;
  for (const p of kept) {
    let wsum = 0;
    let sx = 0;
    let sy = 0;
    let xx = 0;
    let yy = 0;
    let xy = 0;
    let hot = 0;
    let pixels = 0;
    const floor = Math.max(0, p.peak * 0.25);
    for (let dy = -win; dy <= win; dy++) {
      for (let dx = -win; dx <= win; dx++) {
        const x = p.x + dx;
        const y = p.y + dy;
        const s = signal[y * width + x];
        if (s <= floor) continue;
        pixels++;
        if (gray[y * width + x] > 250) hot++;
        wsum += s;
        sx += s * x;
        sy += s * y;
      }
    }
    if (wsum <= 0 || hot > 18 || pixels < 5 || p.peak < Math.max(6, threshold)) continue;
    const cx = sx / wsum;
    const cy = sy / wsum;
    for (let dy = -win; dy <= win; dy++) {
      for (let dx = -win; dx <= win; dx++) {
        const x = p.x + dx;
        const y = p.y + dy;
        const s = signal[y * width + x];
        if (s <= floor) continue;
        const ex = x - cx;
        const ey = y - cy;
        xx += s * ex * ex;
        yy += s * ey * ey;
        xy += s * ex * ey;
      }
    }
    xx /= wsum;
    yy /= wsum;
    xy /= wsum;
    const tr = xx + yy;
    const det = xx * yy - xy * xy;
    const disc = Math.sqrt(Math.max(0, tr * tr / 4 - det));
    const major = tr / 2 + disc;
    const minor = Math.max(1e-3, tr / 2 - disc);
    if (major / minor > 3.4) continue;
    if (cx < win || cy < win || cx > width - win || cy > height - win) continue;
    out.push({ x: cx, y: cy, flux: wsum, peak: p.peak });
  }
  out.sort((a, b) => b.flux - a.flux);
  return out;
}

export function imageDataToGray(data: Uint8ClampedArray, width: number, height: number) {
  const gray = new Float32Array(width * height);
  for (let i = 0, p = 0; i < gray.length; i++, p += 4) {
    gray[i] = 0.2126 * data[p] + 0.7152 * data[p + 1] + 0.0722 * data[p + 2];
  }
  return gray;
}
