"use client";

import { useEffect, useRef } from "react";

/** Pixel lunar disc: illumination 0 = new, 1 = full. */
export function MoonPhaseDisc({
  illumination,
  ageDays,
  size = 180,
}: {
  illumination: number;
  ageDays: number;
  size?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // draw in CSS pixel space (no DPR buffer) for simple putImageData
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.4;
    const k = Math.min(1, Math.max(0, illumination));
    const waxing = ageDays % 29.53058867 < 14.765294;
    const cosPhase = 2 * k - 1;

    const img = ctx.createImageData(size, size);
    const data = img.data;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const nx = (x - cx) / r;
        const ny = (y - cy) / r;
        if (nx * nx + ny * ny > 1) continue;
        const limbX = waxing ? nx : -nx;
        const edge = cosPhase * Math.sqrt(Math.max(0, 1 - ny * ny));
        const lit = limbX >= edge;
        const i = (y * size + x) * 4;
        if (lit) {
          const shade = 0.72 + 0.28 * Math.max(0, limbX);
          data[i] = Math.round(243 * shade);
          data[i + 1] = Math.round(235 * shade);
          data[i + 2] = Math.round(212 * shade);
          data[i + 3] = 255;
        } else {
          data[i] = 21;
          data[i + 1] = 29;
          data[i + 2] = 46;
          data[i + 3] = 255;
        }
      }
    }
    ctx.putImageData(img, 0, 0);

    const glow = ctx.createRadialGradient(cx, cy, r * 0.55, cx, cy, r * 1.35);
    glow.addColorStop(0, "rgba(244,237,216,0)");
    glow.addColorStop(0.55, "rgba(244,237,216,0.12)");
    glow.addColorStop(1, "rgba(7,13,24,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(230,211,154,0.55)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [illumination, ageDays, size]);

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="mx-auto block"
      aria-label="قرص ماه"
    />
  );
}
