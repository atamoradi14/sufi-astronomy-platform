"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { bvToColor, magToRadius, projectStar, type SkyStar } from "@/lib/sky/project";
import { lstHours } from "@/lib/astronomy/time";
import { formatDeg, formatHours, toPersianDigits } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Cons = {
  id: string;
  name: string;
  en: string;
  rank: number;
  lines: Array<Array<[number, number]>>;
};

type StarCatalog = { count: number; stars: SkyStar[]; source: string };
type ConsCatalog = { count: number; constellations: Cons[]; source: string };

export function LiveSky() {
  const geo = useGeolocation(false);
  const lat = geo.reading?.lat ?? 35.6892;
  const lon = geo.reading?.lon ?? 51.389;
  const [now, setNow] = useState(() => new Date());
  const [playing, setPlaying] = useState(true);
  const [magLimit, setMagLimit] = useState(6.5);
  const [showLines, setShowLines] = useState(true);
  const [showNames, setShowNames] = useState(true);
  const [catalog, setCatalog] = useState<StarCatalog | null>(null);
  const [cons, setCons] = useState<ConsCatalog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/data/stars-mag7.json").then((r) => r.json()),
      fetch("/data/constellations-iau.json").then((r) => r.json()),
    ])
      .then(([s, c]) => {
        if (!cancelled) {
          setCatalog(s);
          setCons(c);
        }
      })
      .catch(() => {
        if (!cancelled) setError("بارگذاری کاتالوگ ستارگان ناموفق بود.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, [playing]);

  const stars = useMemo(() => {
    if (!catalog) return [];
    return catalog.stars.filter((s) => s.mag <= magLimit);
  }, [catalog, magLimit]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = "#050a12";
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * 0.48;

    // horizon disk
    const grd = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R);
    grd.addColorStop(0, "#0d1a2e");
    grd.addColorStop(1, "#070d18");
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.strokeStyle = "rgba(201,162,39,0.45)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // cardinal labels
    ctx.fillStyle = "#e6d39a";
    ctx.font = "12px Vazirmatn, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ش", cx, cy - R - 8);
    ctx.fillText("ج", cx, cy + R + 16);
    ctx.fillText("ق", cx + R + 14, cy + 4);
    ctx.fillText("غ", cx - R - 14, cy + 4);

    const project = (ra: number, dec: number) =>
      projectStar({ id: 0, ra, dec, mag: 0, bv: null, n: null }, lat, lon, now);

    if (showLines && cons) {
      ctx.strokeStyle = "rgba(91,124,153,0.55)";
      ctx.lineWidth = 1;
      for (const c of cons.constellations) {
        for (const line of c.lines) {
          let started = false;
          ctx.beginPath();
          for (const [ra, dec] of line) {
            const p = project(ra, dec);
            if (!p.visible) {
              started = false;
              continue;
            }
            const x = cx + p.x * R;
            const y = cy + p.y * R;
            if (!started) {
              ctx.moveTo(x, y);
              started = true;
            } else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }
    }

    // stars
    for (const s of stars) {
      const p = projectStar(s, lat, lon, now);
      if (!p.visible) continue;
      const x = cx + p.x * R;
      const y = cy + p.y * R;
      const rad = magToRadius(s.mag, R / 280);
      ctx.beginPath();
      ctx.fillStyle = bvToColor(s.bv);
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
      if (showNames && s.n && s.mag < 2.2) {
        ctx.fillStyle = "rgba(230,211,154,0.85)";
        ctx.font = "10px Vazirmatn, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(s.n, x + rad + 3, y + 3);
      }
    }

    // constellation name near centre of visible segments
    if (showNames && cons) {
      ctx.fillStyle = "rgba(154,166,184,0.75)";
      ctx.font = "11px Vazirmatn, sans-serif";
      ctx.textAlign = "center";
      for (const c of cons.constellations) {
        if (c.rank > 2) continue;
        let sx = 0,
          sy = 0,
          n = 0;
        for (const line of c.lines) {
          for (const [ra, dec] of line) {
            const p = project(ra, dec);
            if (!p.visible) continue;
            sx += p.x;
            sy += p.y;
            n++;
          }
        }
        if (n < 3) continue;
        ctx.fillText(c.en, cx + (sx / n) * R, cy + (sy / n) * R);
      }
    }
  }, [stars, cons, lat, lon, now, showLines, showNames]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [draw]);

  const lst = lstHours(now, lon);

  const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!catalog) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * 0.48;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let best: SkyStar | null = null;
    let bestD = 12;
    for (const s of stars) {
      if (s.mag > 4.5) continue;
      const p = projectStar(s, lat, lon, now);
      if (!p.visible) continue;
      const x = cx + p.x * R;
      const y = cy + p.y * R;
      const d = Math.hypot(x - mx, y - my);
      if (d < bestD) {
        bestD = d;
        best = s;
      }
    }
    setHover(
      best
        ? `${best.n ?? "HIP/ID " + best.id} · mag ${best.mag.toFixed(2)} · α ${best.ra.toFixed(3)}ʰ δ ${best.dec.toFixed(2)}°`
        : null,
    );
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] px-4 py-3">
          <Button size="sm" variant={playing ? "default" : "secondary"} onClick={() => setPlaying((p) => !p)}>
            {playing ? "توقف زمان" : "زمان زنده"}
          </Button>
          <Button size="sm" variant={showLines ? "default" : "secondary"} onClick={() => setShowLines((v) => !v)}>
            خطوط IAU
          </Button>
          <Button size="sm" variant={showNames ? "default" : "secondary"} onClick={() => setShowNames((v) => !v)}>
            نام‌ها
          </Button>
          <label className="mr-auto flex items-center gap-2 text-xs text-[var(--muted)]">
            حد قدر
            <input
              type="range"
              min={3}
              max={7}
              step={0.1}
              value={magLimit}
              onChange={(e) => setMagLimit(Number(e.target.value))}
              className="accent-[var(--gold)]"
            />
            <span className="w-10 text-[var(--parchment)]">{toPersianDigits(magLimit.toFixed(1))}</span>
          </label>
        </div>
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="h-[min(70vh,640px)] w-full cursor-crosshair"
            onMouseMove={onMove}
            onMouseLeave={() => setHover(null)}
          />
          {!catalog && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--ink)]/70 text-[var(--muted)]">
              بارگذاری کاتالوگ (قدرت ≤ ۷)…
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center text-[var(--rose-ink)]">
              {error}
            </div>
          )}
          {hover && (
            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-md border border-[var(--border)] bg-[var(--ink)]/90 px-3 py-1.5 font-mono text-[11px] text-[var(--gold-soft)] dir-ltr">
              {hover}
            </div>
          )}
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="عرض ناظر" value={formatDeg(lat, 3)} />
        <Stat label="طول ناظر" value={formatDeg(lon, 3)} />
        <Stat label="LST" value={formatHours(lst, 3)} />
        <Stat
          label="ستارگان رسم‌شده"
          value={catalog ? toPersianDigits(stars.length.toLocaleString("en-US")) : "…"}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">منبع داده</CardTitle>
          <CardDescription>
            ستارگان تا قدر ۷ از کاتالوگ ترکیبی Hipparcos/Yale (celestial_data) در مختصات J2000؛ خطوط صورت‌ها بر اساس شکل‌های IAU (d3-celestial). نمایش افقی با تصویرگرایی از سمت‌الرأس.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-[var(--muted)] leading-7">
          {catalog?.source} · {cons?.count ?? "—"} صورت · {catalog?.count ?? "—"} ستاره در فایل
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/85 px-4 py-3">
      <div className="text-[11px] text-[var(--muted)]">{label}</div>
      <div className="mt-1 font-[family-name:var(--font-display)] text-[var(--gold-soft)]">
        {value}
      </div>
    </div>
  );
}
