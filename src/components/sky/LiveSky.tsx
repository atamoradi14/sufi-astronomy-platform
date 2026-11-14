"use client";
import {
  useDigitScript,
  LocalizedDigits,
} from "@/components/digits/DigitScript";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  bvToColor,
  equatorialToAzAlt,
  magToRadius,
  panLook,
  projectAzAlt,
  zoomLook,
  type Look,
  type SkyStar,
} from "@/lib/sky/project";
import { formatDigits } from "@/lib/digits";
import { lstHours } from "@/lib/astronomy/time";
import { greatArc, sphToCart, cartToLonLat } from "@/lib/astronomy/sphereGeom";
import { Button } from "@/components/ui/button";
import {
  Search,
  LocateFixed,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Minus,
  Plus,
} from "lucide-react";
type Cons = {
  id: string;
  name: string;
  en: string;
  rank: number;
  lines: Array<Array<[number, number]>>;
};
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
type ConsCatalog = {
  count: number;
  constellations: Cons[];
  source: string;
};
function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function expandStars(raw: StarCatalogV1 | StarCatalogV2): {
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
export function LiveSky() {
  const script = useDigitScript();
  const [lat, setLat] = useState(35.6892),
    [lon, setLon] = useState(51.389);
  const [locationLabel, setLocationLabel] = useState(
    "نمونهٔ تهران · Tehran sample",
  );
  const [now, setNow] = useState(() => new Date()),
    [playing, setPlaying] = useState(true);
  const [magLimit, setMagLimit] = useState(5.5),
    [showLines, setShowLines] = useState(true),
    [showNames, setShowNames] = useState(true),
    [showGrid, setShowGrid] = useState(true),
    [showHorizon, setShowHorizon] = useState(true);
  const [starsAll, setStarsAll] = useState<SkyStar[]>([]),
    [cons, setCons] = useState<ConsCatalog | null>(null),
    [error, setError] = useState<string | null>(null),
    [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<SkyStar | null>(null),
    [query, setQuery] = useState("");
  const [look, setLook] = useState<Look>({ az: 180, alt: 35, fov: 75 });
  const canvasRef = useRef<HTMLCanvasElement>(null),
    stageRef = useRef<HTMLDivElement>(null);
  const pickRef = useRef<
    Array<{
      star: SkyStar;
      x: number;
      y: number;
    }>
  >([]);
  const pointers = useRef(
    new Map<
      number,
      {
        x: number;
        y: number;
      }
    >(),
  );
  const gesture = useRef({ x: 0, y: 0, moved: false, pinch: 0 });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const abort = new AbortController();
    setError(null);
    setLoaded(false);
    Promise.all([
      fetch("/data/stars-mag7.json", { signal: abort.signal }).then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      }),
      fetch("/data/constellations-iau.json", { signal: abort.signal }).then(
        (r) => {
          if (!r.ok) throw Error();
          return r.json();
        },
      ),
    ])
      .then(([s, c]) => {
        setStarsAll(expandStars(s).stars);
        setCons(c);
        setLoaded(true);
      })
      .catch((e) => {
        if (e.name !== "AbortError")
          setError(
            "دریافت کاتالوگ ناموفق بود. اتصال را بررسی و دوباره تلاش کنید.",
          );
      });
    return () => abort.abort();
  }, [retry]);
  useEffect(() => {
    if (!playing) return;
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [playing]);
  const horizontal = useMemo(
    () =>
      starsAll
        .filter((s) => s.mag <= magLimit)
        .map((star) => ({
          star,
          ...equatorialToAzAlt(star.ra, star.dec, lat, lon, now),
        })),
    [starsAll, magLimit, lat, lon, now],
  );
  const constellationPaths = useMemo(
    () =>
      cons?.constellations.flatMap((c) =>
        c.lines.flatMap((line) =>
          line.slice(1).map((p, i) =>
            greatArc(
              sphToCart(line[i][0] * 15, line[i][1]),
              sphToCart(p[0] * 15, p[1]),
              12,
            ).map((v) => {
              const p = cartToLonLat(v);
              return equatorialToAzAlt(
                (((p.lon / 15) % 24) + 24) % 24,
                p.lat,
                lat,
                lon,
                now,
              );
            }),
          ),
        ),
      ) ?? [],
    [cons, lat, lon, now],
  );
  const draw = useCallback(() => {
    const canvas = canvasRef.current,
      ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const w = canvas.clientWidth,
      h = canvas.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cx = w / 2,
      cy = h / 2,
      scale = h / 2;
    const screen = (az: number, alt: number) => {
      const p = projectAzAlt(az, alt, look);
      return { ...p, x: cx + p.x * scale, y: cy - p.y * scale };
    };
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, "#050b17");
    gradient.addColorStop(1, "#162d46");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    const horizonY =
      cy +
      (scale * Math.tan((look.alt * Math.PI) / 180)) /
        Math.tan((look.fov * Math.PI) / 360);
    if (showHorizon) {
      ctx.fillStyle = "#101f24";
      ctx.fillRect(0, Math.max(0, horizonY), w, h);
      ctx.strokeStyle = "#91b4a8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(w, horizonY);
      ctx.stroke();
    }
    const path = (
      points: Array<{
        az: number;
        alt: number;
      }>,
      color: string,
      width: number,
      above = false,
    ) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      let prev: {
        x: number;
        y: number;
      } | null = null;
      for (const q of points) {
        const p = screen(q.az, q.alt);
        if (
          !p.visible ||
          (above && q.alt < 0) ||
          Math.abs(p.x - cx) > w * 3 ||
          Math.abs(p.y - cy) > h * 3
        ) {
          prev = null;
          continue;
        }
        if (!prev || Math.hypot(p.x - prev.x, p.y - prev.y) > w)
          ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
        prev = p;
      }
      ctx.stroke();
    };
    if (showGrid) {
      for (const alt of [0, 15, 30, 45, 60, 75])
        path(
          Array.from({ length: 181 }, (_, i) => ({ az: i * 2, alt })),
          "#678ca533",
          1,
        );
      for (let az = 0; az < 360; az += 30)
        path(
          Array.from({ length: 90 }, (_, alt) => ({ az, alt })),
          "#678ca533",
          1,
        );
    }
    if (showLines)
      for (const points of constellationPaths)
        path(points, "#709cc580", 1.1, true);
    const hits: Array<{
      star: SkyStar;
      x: number;
      y: number;
    }> = [];
    const occupied: Array<{
      x: number;
      y: number;
    }> = [];
    for (const q of horizontal) {
      if (q.alt < 0) continue;
      const p = screen(q.az, q.alt);
      if (!p.visible || p.x < -10 || p.y < -10 || p.x > w + 10 || p.y > h + 10)
        continue;
      hits.push({ star: q.star, x: p.x, y: p.y });
      const radius = magToRadius(q.star.mag, 0.75);
      ctx.fillStyle = bvToColor(q.star.bv);
      if (q.star.mag < 1.3) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 5);
        g.addColorStop(0, bvToColor(q.star.bv) + "70");
        g.addColorStop(1, "#ffffff00");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = bvToColor(q.star.bv);
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
      ctx.fill();
      if (selected?.id === q.star.id) {
        ctx.strokeStyle = "#f1cf7b";
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius + 8, 0, 2 * Math.PI);
        ctx.stroke();
      }
      if (
        showNames &&
        q.star.n &&
        q.star.mag < 2.5 &&
        !occupied.some(
          (t) => Math.abs(t.x - p.x) < 100 && Math.abs(t.y - p.y) < 20,
        )
      ) {
        ctx.font = "12px sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = "#d7e4ef";
        ctx.fillText(formatDigits(q.star.n, script), p.x + radius + 7, p.y + 4);
        occupied.push(p);
      }
    }
    pickRef.current = hits;
    if (showHorizon) {
      ctx.textAlign = "center";
      ctx.font = "bold 12px sans-serif";
      for (const [az, label] of [
        [0, "N · شمال"],
        [90, "E · شرق"],
        [180, "S · جنوب"],
        [270, "W · غرب"],
      ] as const) {
        const p = screen(az, 0);
        if (p.visible && p.x > 25 && p.x < w - 25 && p.y > 0 && p.y < h) {
          ctx.fillStyle = "#0a1525";
          ctx.fillRect(p.x - 35, p.y - 10, 70, 22);
          ctx.fillStyle = "#f1cf7b";
          ctx.fillText(label, p.x, p.y + 5);
        }
      }
    }
    ctx.strokeStyle = "#cad9e54d";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 7, cy);
    ctx.lineTo(cx + 7, cy);
    ctx.moveTo(cx, cy - 7);
    ctx.lineTo(cx, cy + 7);
    ctx.stroke();
  }, [
    look,
    horizontal,
    constellationPaths,
    showGrid,
    showLines,
    showNames,
    showHorizon,
    selected,
    script,
  ]);
  useEffect(() => {
    const id = requestAnimationFrame(draw);
    const ro = new ResizeObserver(draw);
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
    };
  }, [draw]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      setLook((l) => zoomLook(l, Math.exp(e.deltaY * 0.001)));
    };
    canvas.addEventListener("wheel", wheel, { passive: false });
    return () => canvas.removeEventListener("wheel", wheel);
  }, []);
  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1)
      gesture.current = { x: e.clientX, y: e.clientY, moved: false, pinch: 0 };
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      gesture.current.pinch = Math.hypot(a.x - b.x, a.y - b.y);
      gesture.current.moved = true;
    }
  };
  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const old = pointers.current.get(e.pointerId);
    if (!old) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()],
        distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance > 0 && gesture.current.pinch > 0)
        setLook((l) => zoomLook(l, gesture.current.pinch / distance));
      gesture.current.pinch = distance;
      return;
    }
    if (
      Math.hypot(e.clientX - gesture.current.x, e.clientY - gesture.current.y) >
      4
    )
      gesture.current.moved = true;
    setLook((l) =>
      panLook(
        l,
        e.clientX - old.x,
        e.clientY - old.y,
        e.currentTarget.clientHeight,
      ),
    );
  };
  const onUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.delete(e.pointerId);
    if (!gesture.current.moved && e.type !== "pointercancel") {
      const r = e.currentTarget.getBoundingClientRect();
      let best: SkyStar | null = null,
        d = 16;
      for (const p of pickRef.current) {
        const n = Math.hypot(
          p.x - (e.clientX - r.left),
          p.y - (e.clientY - r.top),
        );
        if (n < d) {
          d = n;
          best = p.star;
        }
      }
      setSelected(best);
    }
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const locate = () => {
    if (!navigator.geolocation) {
      setLocationLabel(
        "موقعیت‌یابی پشتیبانی نمی‌شود؛ مختصات را دستی وارد کنید.",
      );
      return;
    }
    setLocationLabel("در حال دریافت موقعیت…");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLat(p.coords.latitude);
        setLon(p.coords.longitude);
        setLocationLabel("موقعیت دستگاه · Device location");
      },
      () => setLocationLabel("موقعیت دریافت نشد؛ مختصات فعلی حفظ شد."),
      { timeout: 10000 },
    );
  };
  const focus = (s: SkyStar) => {
    setSelected(s);
    const p = equatorialToAzAlt(s.ra, s.dec, lat, lon, now);
    setLook((l) => ({
      ...l,
      az: p.az,
      alt: Math.max(-85, Math.min(90, p.alt)),
    }));
    setQuery("");
  };
  const results = query.trim()
    ? starsAll
        .filter((s) =>
          (s.n ?? String(s.id))
            .toLowerCase()
            .includes(formatDigits(query.trim(), "en").toLowerCase()),
        )
        .slice(0, 7)
    : [];
  const selectedH = selected
    ? equatorialToAzAlt(selected.ra, selected.dec, lat, lon, now)
    : null;
  return (
    <LocalizedDigits>
      {
        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] items-start">
            <div className="workspace" ref={stageRef}>
              <div className="workspace-toolbar">
                <span className="study-kicker">SKY / OBSERVATORY</span>
                <div className="relative min-w-0 flex-1">
                  <label className="sr-only" htmlFor="star-search">
                    جست‌وجوی ستاره / Search stars
                  </label>
                  <Search
                    size={15}
                    className="absolute start-3 top-3 text-[var(--muted)]"
                  />
                  <input
                    id="star-search"
                    className="control-input !ps-9"
                    placeholder="نام ستاره یا شناسه · Sirius"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {query && (
                    <div className="absolute inset-x-0 top-full z-30 mt-2 rounded-xl border border-[var(--border)] bg-[#0d1d31] p-2 shadow-xl">
                      {results.map((s) => (
                        <button
                          type="button"
                          key={s.id}
                          className="block w-full rounded-lg p-3 text-start text-sm hover:bg-white/5"
                          onClick={() => focus(s)}
                        >
                          {s.n ?? `Star ${s.id}`}{" "}
                          <span className="text-xs text-[var(--muted)]">
                            mag {s.mag.toFixed(1)}
                          </span>
                        </button>
                      ))}
                      {results.length === 0 && (
                        <p className="p-3 text-xs">ستاره‌ای یافت نشد.</p>
                      )}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Fullscreen sky / تمام‌صفحه"
                  onClick={() => {
                    if (document.fullscreenElement)
                      void document.exitFullscreen();
                    else void stageRef.current?.requestFullscreen();
                  }}
                >
                  <Maximize2 size={17} />
                </Button>
              </div>
              <div className="workspace-stage touch-none select-none">
                <canvas
                  ref={canvasRef}
                  role="img"
                  aria-label="Interactive sky chart. Arrow keys pan, plus and minus zoom. Drag or pinch to explore; click a star to select."
                  tabIndex={0}
                  className="h-[min(72vh,690px)] min-h-[360px] w-full cursor-grab active:cursor-grabbing"
                  onPointerDown={onDown}
                  onPointerMove={onMove}
                  onPointerUp={onUp}
                  onPointerCancel={onUp}
                  onKeyDown={(e) => {
                    if (
                      [
                        "ArrowLeft",
                        "ArrowRight",
                        "ArrowUp",
                        "ArrowDown",
                        "+",
                        "=",
                        "-",
                        "Escape",
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                      if (e.key === "Escape") {
                        setSelected(null);
                        setQuery("");
                      } else if (["+", "=", "-"].includes(e.key))
                        setLook((l) =>
                          zoomLook(l, e.key === "-" ? 1.15 : 0.85),
                        );
                      else
                        setLook((l) => ({
                          ...l,
                          az:
                            (l.az +
                              (e.key === "ArrowRight"
                                ? 5
                                : e.key === "ArrowLeft"
                                  ? -5
                                  : 0) +
                              360) %
                            360,
                          alt: Math.max(
                            -85,
                            Math.min(
                              89,
                              l.alt +
                                (e.key === "ArrowUp"
                                  ? 5
                                  : e.key === "ArrowDown"
                                    ? -5
                                    : 0),
                            ),
                          ),
                        }));
                    }
                  }}
                />
                {(!loaded || error) && (
                  <div
                    className="absolute inset-0 flex flex-col gap-4 items-center justify-center bg-[#07121fe6] p-6 text-sm text-center"
                    role="status"
                  >
                    {error ?? "در حال دریافت کاتالوگ ستارگان…"}
                    {error && (
                      <Button size="sm" onClick={() => setRetry((v) => v + 1)}>
                        تلاش دوباره
                      </Button>
                    )}
                  </div>
                )}
                <div
                  className="pointer-events-none absolute start-4 top-4 rounded-xl border border-white/10 bg-[#07121fdb] px-4 py-3 text-xs space-y-1"
                  dir="ltr"
                >
                  <p className="text-[#e9d59e]">
                    AZ {look.az.toFixed(1)}° · ALT {look.alt.toFixed(1)}°
                  </p>
                  <p className="text-[#9fb5cc]">
                    VERTICAL FOV {look.fov.toFixed(0)}° ·{" "}
                    {playing ? "LIVE" : "PAUSED"}
                  </p>
                </div>
                <div className="absolute end-3 bottom-3 flex flex-col gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    aria-label="Zoom in / بزرگ‌نمایی"
                    onClick={() => setLook((l) => zoomLook(l, 0.8))}
                  >
                    <Plus size={17} />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    aria-label="Zoom out / کوچک‌نمایی"
                    onClick={() => setLook((l) => zoomLook(l, 1.25))}
                  >
                    <Minus size={17} />
                  </Button>
                </div>
              </div>
              <div className="workspace-legend">
                <span>شمال ۰° · شرق ۹۰° · جنوب ۱۸۰° · غرب ۲۷۰°</span>
                <span>
                  کشیدن / کلیدهای جهت · زوم دو انگشتی · انتخاب با کلیک
                </span>
              </div>
            </div>
            <aside className="space-y-4 rounded-2xl border border-[var(--border)] bg-[#101d30] p-5">
              <p className="study-kicker">OBSERVER / TIME</p>
              <h2 className="text-lg text-[var(--gold-soft)]">
                مکان و زمان رصد
              </h2>
              <p
                role="status"
                className="text-xs leading-6 text-[var(--muted)]"
              >
                {locationLabel}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <CoordinateInput
                  label="عرض شمالی φ"
                  value={lat}
                  limit={90}
                  onCommit={(v) => {
                    setLat(v);
                    setLocationLabel("مختصات دستی · Manual coordinates");
                  }}
                />
                <CoordinateInput
                  label="طول شرقی λ"
                  value={lon}
                  limit={180}
                  onCommit={(v) => {
                    setLon(v);
                    setLocationLabel("مختصات دستی · Manual coordinates");
                  }}
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={locate}
              >
                <LocateFixed size={15} />
                موقعیت دستگاه
              </Button>
              <label className="block text-xs space-y-2">
                زمان UTC
                <input
                  aria-label="Observation time UTC"
                  type="datetime-local"
                  className="control-input"
                  dir="ltr"
                  value={now.toISOString().slice(0, 16)}
                  onChange={(e) => {
                    const d = new Date(e.target.value + "Z");
                    if (Number.isFinite(d.getTime())) {
                      setNow(d);
                      setPlaying(false);
                    }
                  }}
                />
              </label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={playing ? "default" : "secondary"}
                  onClick={() => setPlaying((p) => !p)}
                >
                  {playing ? <Pause size={14} /> : <Play size={14} />}{" "}
                  {playing ? "توقف" : "زنده"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setNow(new Date());
                    setPlaying(true);
                  }}
                >
                  <RotateCcw size={14} />
                  اکنون
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setNow((d) => new Date(d.getTime() - 3600000));
                    setPlaying(false);
                  }}
                >
                  −۱ ساعت
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setNow((d) => new Date(d.getTime() + 3600000));
                    setPlaying(false);
                  }}
                >
                  +۱ ساعت
                </Button>
              </div>
              <div className="border-t border-[var(--border)] pt-4 space-y-3">
                <h3 className="text-sm text-[var(--gold-soft)]">
                  لایه‌ها و جهت نگاه
                </h3>
                {[
                  [showLines, setShowLines, "خطوط صورت‌های فلکی"],
                  [showNames, setShowNames, "نام ستاره‌ها"],
                  [showGrid, setShowGrid, "شبکهٔ سمت و ارتفاع"],
                  [showHorizon, setShowHorizon, "افق هندسی"],
                ].map(([value, setter, label], i) => (
                  <label
                    className="flex items-center justify-between gap-2 text-xs"
                    key={i}
                  >
                    <span>{label as string}</span>
                    <input
                      type="checkbox"
                      checked={value as boolean}
                      onChange={(e) =>
                        (setter as (v: boolean) => void)(e.target.checked)
                      }
                      className="accent-[var(--gold)] h-4 w-4"
                    />
                  </label>
                ))}
                <label className="block text-xs">
                  حد قدر · {magLimit.toFixed(1)}
                  <input
                    aria-label="Limiting magnitude / حد قدر"
                    type="range"
                    min={2}
                    max={7}
                    step={0.1}
                    value={magLimit}
                    onChange={(e) => setMagLimit(+e.target.value)}
                    className="w-full accent-[var(--gold)]"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    [0, "N"],
                    [90, "E"],
                    [180, "S"],
                    [270, "W"],
                  ].map(([az, label]) => (
                    <Button
                      key={label}
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setLook((l) => ({ ...l, az: Number(az), alt: 25 }))
                      }
                    >
                      {label}
                    </Button>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setLook((l) => ({ ...l, alt: 90, fov: 90 }))}
                  >
                    سرسو
                  </Button>
                </div>
              </div>
              <p className="text-xs text-[var(--teal)]" dir="ltr">
                LST {lstHours(now, lon).toFixed(4)} h ·{" "}
                {starsAll.length.toLocaleString("en")} catalogue stars
              </p>
            </aside>
          </div>
          {selected && selectedH && (
            <section
              className="rounded-2xl border border-[var(--gold)]/35 bg-[#14243a] p-5 space-y-3"
              aria-live="polite"
            >
              <div className="flex flex-wrap justify-between gap-3">
                <h2 className="text-lg text-[var(--gold-soft)]">
                  {selected.n ?? `Star ${selected.id}`}
                </h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelected(null)}
                >
                  بستن انتخاب
                </Button>
              </div>
              <p className="text-sm" dir="ltr">
                RA {selected.ra.toFixed(4)} h · Dec {selected.dec.toFixed(3)}° ·
                Mag {selected.mag.toFixed(2)} · Az {selectedH.az.toFixed(2)}° ·
                Alt {selectedH.alt.toFixed(2)}°
              </p>
              {selectedH.alt < 0 && (
                <p className="text-sm text-[var(--rose-ink)]">
                  این ستاره در زمان و مکان انتخابی زیر افق است. برای دیدن آن،
                  زمان را تغییر دهید.
                </p>
              )}
            </section>
          )}
          <p className="max-w-4xl text-xs leading-7 text-[var(--muted)]">
            نمای گنومونیک با میدان دید عمودی؛ موقعیت‌ها هندسی‌اند و شکست جو
            اعمال نشده است. مختصات کاتالوگ HYG/Hipparcos با زمان نجومی متوسط
            تقریبی تبدیل می‌شوند؛ تقدیم، ترقّص و حرکت خاص برای تاریخ رصد اعمال
            نشده‌اند. این ابزار آموزشی جای محاسبهٔ اخترسنجی دقیق را نمی‌گیرد.
            شمار ستاره‌های کاتالوگ یا فیلتر قدر، شمار ستاره‌های قابل‌دیدن در قاب
            نیست.
          </p>
        </div>
      }
    </LocalizedDigits>
  );
}
function CoordinateInput({
  label,
  value,
  limit,
  onCommit,
}: {
  label: string;
  value: number;
  limit: number;
  onCommit: (v: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  const [error, setError] = useState(false);
  useEffect(() => {
    setDraft(String(value));
    setError(false);
  }, [value]);
  const commit = () => {
    const normalized = draft
      .replace(/[۰-۹]/g, (c) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(c)))
      .replace(/٫/g, ".")
      .replace(/−/g, "-");
    const n = Number(normalized);
    if (normalized.trim() && Number.isFinite(n) && Math.abs(n) <= limit) {
      onCommit(n);
      setError(false);
    } else setError(true);
  };
  return (
    <LocalizedDigits>
      {
        <label className="text-xs space-y-2">
          {label}
          <input
            className="control-input"
            type="text"
            inputMode="decimal"
            dir="ltr"
            value={draft}
            aria-invalid={error}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
          />
          {error && (
            <span role="alert" className="block text-[var(--rose-ink)]">
              عددی بین {-limit} و {limit} وارد کنید.
            </span>
          )}
        </label>
      }
    </LocalizedDigits>
  );
}
