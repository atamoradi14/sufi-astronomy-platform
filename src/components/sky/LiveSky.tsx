"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import {
  bvToColor,
  equatorialToAzAlt,
  magToRadius,
  panLook,
  projectAzAlt,
  projectStar,
  zoomLook,
  type Look,
  type SkyStar,
} from "@/lib/sky/project";
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
  const [playing, setPlaying] = useState(false);
  const [magLimit, setMagLimit] = useState(6.5);
  const [showLines, setShowLines] = useState(true);
  const [showNames, setShowNames] = useState(true);
  const [showHorizon, setShowHorizon] = useState(true);
  const [catalog, setCatalog] = useState<StarCatalog | null>(null);
  const [cons, setCons] = useState<ConsCatalog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SkyStar | null>(null);
  const [look, setLook] = useState<Look>({ az: 180, alt: 35, fov: 60 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lookRef = useRef(look);
  const dragRef = useRef<{
    active: boolean;
    moved: boolean;
    x: number;
    y: number;
    pointerId: number | null;
  }>({ active: false, moved: false, x: 0, y: 0, pointerId: null });
  const rafRef = useRef(0);

  useEffect(() => {
    lookRef.current = look;
  }, [look]);

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
    if (w < 10 || h < 10) return;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const L = lookRef.current;
    const cx = w / 2;
    const cy = h / 2;
    const scale = Math.min(w, h) / 2;

    // Sky background
    const g = ctx.createRadialGradient(cx, cy * 0.85, 0, cx, cy, Math.max(w, h) * 0.7);
    g.addColorStop(0, "#152238");
    g.addColorStop(0.55, "#0a1220");
    g.addColorStop(1, "#05080f");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const toScreen = (x: number, y: number) => ({
      sx: cx + x * scale,
      sy: cy + y * scale,
    });

    // Horizon ground fill + line
    if (showHorizon) {
      const horizonPts: Array<{ x: number; y: number }> = [];
      for (let az = 0; az <= 360; az += 2) {
        const p = projectAzAlt(az, 0, L);
        if (!p.visible) continue;
        horizonPts.push({ x: p.x, y: -p.y });
      }
      if (horizonPts.length > 2) {
        // Sample below horizon for fill
        ctx.beginPath();
        let started = false;
        for (let az = 0; az <= 360; az += 3) {
          const p = projectAzAlt(az, -20, L);
          if (!p.visible && p.depth <= 0) continue;
          const { sx, sy } = toScreen(p.x, -p.y);
          if (!started) {
            ctx.moveTo(sx, sy);
            started = true;
          } else ctx.lineTo(sx, sy);
        }
        // crude ground: fill bottom of canvas when looking near horizon
        if (L.alt < 40) {
          ctx.fillStyle = "rgba(12, 18, 12, 0.55)";
          // redraw as polygon using horizon
          ctx.beginPath();
          horizonPts.forEach((p, i) => {
            const { sx, sy } = toScreen(p.x, p.y);
            if (i === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          });
          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();
          ctx.fill();
        }
        ctx.beginPath();
        horizonPts.forEach((p, i) => {
          const { sx, sy } = toScreen(p.x, p.y);
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        });
        ctx.strokeStyle = "rgba(201,162,39,0.55)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Cardinal ticks on horizon
      const cards: Array<[number, string]> = [
        [0, "ش"],
        [90, "ق"],
        [180, "ج"],
        [270, "غ"],
      ];
      ctx.font = "13px Vazirmatn, sans-serif";
      ctx.textAlign = "center";
      for (const [az, label] of cards) {
        const p = projectAzAlt(az, 1.5, L);
        if (!p.visible) continue;
        const { sx, sy } = toScreen(p.x, -p.y);
        ctx.fillStyle = "#e6d39a";
        ctx.fillText(label, sx, sy);
      }
    }

    // Altitude grid (subtle)
    ctx.strokeStyle = "rgba(91,124,153,0.18)";
    ctx.lineWidth = 1;
    for (const alt of [0, 30, 60]) {
      ctx.beginPath();
      let started = false;
      for (let az = 0; az <= 360; az += 3) {
        const p = projectAzAlt(az, alt, L);
        if (!p.visible) {
          started = false;
          continue;
        }
        const { sx, sy } = toScreen(p.x, -p.y);
        if (!started) {
          ctx.moveTo(sx, sy);
          started = true;
        } else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    }

    // Constellation lines
    if (showLines && cons) {
      ctx.strokeStyle = "rgba(91,124,153,0.65)";
      ctx.lineWidth = 1.15;
      for (const c of cons.constellations) {
        for (const line of c.lines) {
          let started = false;
          ctx.beginPath();
          for (const [ra, dec] of line) {
            const { az, alt } = equatorialToAzAlt(ra, dec, lat, lon, now);
            const p = projectAzAlt(az, alt, L);
            if (!p.visible || alt < -3) {
              started = false;
              continue;
            }
            const { sx, sy } = toScreen(p.x, -p.y);
            if (!started) {
              ctx.moveTo(sx, sy);
              started = true;
            } else ctx.lineTo(sx, sy);
          }
          ctx.stroke();
        }
      }
    }

    // Stars
    for (const s of stars) {
      const p = projectStar(s, lat, lon, now, L);
      if (!p.visible) continue;
      const { sx, sy } = toScreen(p.x, p.y);
      const rad = magToRadius(s.mag, (scale / 260) * (60 / L.fov));
      ctx.beginPath();
      ctx.fillStyle = bvToColor(s.bv);
      ctx.arc(sx, sy, rad, 0, Math.PI * 2);
      ctx.fill();
      if (selected?.id === s.id) {
        ctx.strokeStyle = "#c9a227";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(sx, sy, rad + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (showNames && s.n && s.mag < 2.0) {
        ctx.fillStyle = "rgba(230,211,154,0.9)";
        ctx.font = "11px Vazirmatn, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(s.n, sx + rad + 3, sy + 3);
      }
    }

    // Constellation names
    if (showNames && cons) {
      ctx.fillStyle = "rgba(154,166,184,0.8)";
      ctx.font = "12px Vazirmatn, sans-serif";
      ctx.textAlign = "center";
      for (const c of cons.constellations) {
        if (c.rank > 2) continue;
        let sx = 0,
          sy = 0,
          n = 0;
        for (const line of c.lines) {
          for (const [ra, dec] of line) {
            const { az, alt } = equatorialToAzAlt(ra, dec, lat, lon, now);
            const p = projectAzAlt(az, alt, L);
            if (!p.visible || alt < 0) continue;
            sx += p.x;
            sy += -p.y;
            n++;
          }
        }
        if (n < 4) continue;
        const { sx: x, sy: y } = toScreen(sx / n, sy / n);
        ctx.fillText(c.en, x, y);
      }
    }

    // Crosshair
    ctx.strokeStyle = "rgba(230,211,154,0.25)";
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy);
    ctx.lineTo(cx + 10, cy);
    ctx.moveTo(cx, cy - 10);
    ctx.lineTo(cx, cy + 10);
    ctx.stroke();

    // HUD
    ctx.fillStyle = "rgba(7,13,24,0.65)";
    ctx.fillRect(10, 10, 210, 54);
    ctx.strokeStyle = "rgba(201,162,39,0.25)";
    ctx.strokeRect(10, 10, 210, 54);
    ctx.fillStyle = "#e6d39a";
    ctx.font = "11px ui-monospace, monospace";
    ctx.textAlign = "left";
    ctx.fillText(
      `Az ${L.az.toFixed(1)}°  Alt ${L.alt.toFixed(1)}°`,
      18,
      30,
    );
    ctx.fillStyle = "#9aa6b8";
    ctx.fillText(`FOV ${L.fov.toFixed(0)}°  · drag / scroll`, 18, 48);
  }, [
    stars,
    cons,
    lat,
    lon,
    now,
    showLines,
    showNames,
    showHorizon,
    selected,
  ]);

  const scheduleDraw = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);
  }, [draw]);

  useEffect(() => {
    scheduleDraw();
  }, [scheduleDraw, look]);

  useEffect(() => {
    const onResize = () => scheduleDraw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [scheduleDraw]);

  const pickStar = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = Math.min(w, h) / 2;
    const mx = clientX - rect.left;
    const my = clientY - rect.top;
    let best: SkyStar | null = null;
    let bestD = 14;
    const L = lookRef.current;
    for (const s of stars) {
      if (s.mag > 5) continue;
      const p = projectStar(s, lat, lon, now, L);
      if (!p.visible) continue;
      const sx = cx + p.x * scale;
      const sy = cy + p.y * scale;
      const d = Math.hypot(sx - mx, sy - my);
      if (d < bestD) {
        bestD = d;
        best = s;
      }
    }
    setSelected(best);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      active: true,
      moved: false,
      x: e.clientX,
      y: e.clientY,
      pointerId: e.pointerId,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    if (Math.hypot(dx, dy) > 3) dragRef.current.moved = true;
    dragRef.current.x = e.clientX;
    dragRef.current.y = e.clientY;
    const w = e.currentTarget.clientWidth;
    setLook((L) => panLook(L, dx, dy, w));
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragRef.current.pointerId !== e.pointerId) return;
    const wasDrag = dragRef.current.moved;
    dragRef.current.active = false;
    dragRef.current.pointerId = null;
    if (!wasDrag) pickStar(e.clientX, e.clientY);
  };

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1.08 : 0.92;
      setLook((L) => zoomLook(L, factor));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const lst = lstHours(now, lon);
  const selectedHoriz = selected
    ? equatorialToAzAlt(selected.ra, selected.dec, lat, lon, now)
    : null;

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] px-3 py-2.5">
          <Button
            size="sm"
            variant={playing ? "default" : "secondary"}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? "زمان زنده" : "توقف زمان"}
          </Button>
          <Button
            size="sm"
            variant={showLines ? "default" : "secondary"}
            onClick={() => setShowLines((v) => !v)}
          >
            خطوط IAU
          </Button>
          <Button
            size="sm"
            variant={showNames ? "default" : "secondary"}
            onClick={() => setShowNames((v) => !v)}
          >
            نام‌ها
          </Button>
          <Button
            size="sm"
            variant={showHorizon ? "default" : "secondary"}
            onClick={() => setShowHorizon((v) => !v)}
          >
            افق
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setLook({ az: 180, alt: 35, fov: 60 })}
          >
            جنوب
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setLook({ az: 0, alt: 89, fov: 90 })}
          >
            سمت‌الرأس
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
            <span className="w-10 text-[var(--parchment)]">
              {toPersianDigits(magLimit.toFixed(1))}
            </span>
          </label>
        </div>

        <div className="relative touch-none select-none">
          <canvas
            ref={canvasRef}
            className="h-[min(78vh,720px)] w-full cursor-grab active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
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
          <div className="pointer-events-none absolute bottom-3 inset-x-0 flex justify-center">
            <div className="rounded-md border border-[var(--border)] bg-[var(--ink)]/85 px-3 py-1.5 text-[11px] text-[var(--muted)]">
              بکشید برای نگاه کردن · اسکرول برای زوم · ضربه/کلیک برای انتخاب ستاره
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="نگاه — سمت" value={formatDeg(look.az, 1)} />
        <Stat label="نگاه — ارتفاع" value={formatDeg(look.alt, 1)} />
        <Stat label="FOV" value={`${toPersianDigits(look.fov.toFixed(0))}°`} />
        <Stat label="LST" value={formatHours(lst, 3)} />
      </div>

      {selected && selectedHoriz && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selected.n ?? `Star #${selected.id}`}
            </CardTitle>
            <CardDescription className="dir-ltr text-left font-mono text-xs">
              α {selected.ra.toFixed(4)}ʰ · δ {selected.dec.toFixed(3)}° · mag{" "}
              {selected.mag.toFixed(2)}
              {selected.bv != null ? ` · B−V ${selected.bv.toFixed(2)}` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <Stat label="سمت" value={formatDeg(selectedHoriz.az, 2)} />
            <Stat label="ارتفاع" value={formatDeg(selectedHoriz.alt, 2)} />
            <Stat label="مکان ناظر" value={`${formatDeg(lat, 2)} ، ${formatDeg(lon, 2)}`} />
            <Button size="sm" variant="outline" onClick={() => setSelected(null)}>
              پاک کردن انتخاب
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">حالت Stellarium</CardTitle>
          <CardDescription>
            تصویرگرایی گنومونیک حول جهت نگاه؛ کشیدن ماوس/انگشت افق را می‌چرخاند، چرخ‌ماوس FOV را عوض می‌کند. داده: Hipparcos/Yale تا قدر ۷ + خطوط IAU.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs leading-7 text-[var(--muted)]">
          {catalog?.source} · {toPersianDigits(stars.length)} ستاره در نمای فعلی (فیلتر قدر)
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
