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
  dragLook,
  createSkyProjector,
  zoomLook,
  type Look,
  type SkyStar,
} from "@/lib/sky/project";
import { expandStars } from "@/lib/sky/catalog";
import { formatDigits } from "@/lib/digits";
import { useLanguage } from "@/components/language/Language";
import { equatorialToHorizontal } from "@/lib/astronomy/sphere";
import { lstHours } from "@/lib/astronomy/time";
import { greatArc, sphToCart, cartToLonLat } from "@/lib/astronomy/sphereGeom";
import { Button } from "@/components/ui/button";
import { drawSkyArt, type SkyArt } from "@/lib/sky/art";
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
export type Cons = {
  id: string;
  name: string;
  en: string;
  rank: number;
  lines: Array<Array<[number, number]>>;
};
type ConsCatalog = {
  count: number;
  constellations: Cons[];
  source: string;
};

export function LiveSky() {
  const script = useDigitScript();
  const { fa, t } = useLanguage();
  const [visible, setVisible] = useState(true);
  const [showArt,setShowArt]=useState(false);
  const [artOpacity,setArtOpacity]=useState(0.35);
  const [artRevision,setArtRevision]=useState(0);
  const artCache=useRef<{art:SkyArt;image:HTMLImageElement}[]>([]);
  useEffect(()=>{
    if(!showArt)return;
    let active=true;
    fetch('/sky/sufi/catalog.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(async (items:SkyArt[])=>{
      for(const art of items){
        if(!active)break;
        if(artCache.current.some(c=>c.art.id===art.id))continue;
        const image=new Image();image.src=art.file;
        try{await image.decode();if(active){artCache.current.push({art,image});setArtRevision(v=>v+1);}}catch{}
      }
    }).catch(()=>setError('Artwork could not be loaded.'));
    return ()=>{active=false;};
  },[showArt]);
  const groundCache = useRef<{ key: string; canvas: HTMLCanvasElement } | null>(
    null,
  );
  const [lat, setLat] = useState(35.6892),
    [lon, setLon] = useState(51.389);
  const [locationStatus, setLocationStatus] = useState("sample");
  const locationLabel = (
    {
      sample: t("نمونهٔ تهران", "Tehran sample"),
      manual: t("مختصات دستی", "Manual coordinates"),
      waiting: t("در حال دریافت موقعیت…", "Finding your location…"),
      device: t("موقعیت دستگاه", "Device location"),
      unavailable: t(
        "موقعیت دریافت نشد؛ مختصات فعلی حفظ شد.",
        "Location unavailable; current coordinates retained.",
      ),
    } as Record<string, string>
  )[locationStatus];
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
  const [look, setLook] = useState<Look>({ az: 180, alt: 35, fov: 75, horizonLocked: true });
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
        setStarsAll(expandStars(s).stars.sort((a, b) => a.mag - b.mag));
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
    const stage = stageRef.current;
    if (!stage) return;
    let intersecting = true;
    const sync = () =>
      setVisible(intersecting && document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      sync();
    });
    observer.observe(stage);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  useEffect(() => {
    if (!playing || !visible) return;
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [playing, visible]);
  const localSidereal = useMemo(() => lstHours(now, lon), [now, lon]);
  const horizontal = useMemo(
    () =>
      starsAll
        .filter((s) => s.mag <= magLimit)
        .map((star) => ({
          star,
          ...equatorialToHorizontal(star.ra, star.dec, lat, localSidereal),
        })),
    [starsAll, magLimit, lat, localSidereal],
  );
  const celestialPaths = useMemo(
    () =>
      cons?.constellations.flatMap((c) =>
        c.lines.flatMap((line) =>
          line
            .slice(1)
            .map((p, i) =>
              greatArc(
                sphToCart(line[i][0] * 15, line[i][1]),
                sphToCart(p[0] * 15, p[1]),
                12,
              ).map((v) => cartToLonLat(v)),
            ),
        ),
      ) ?? [],
    [cons],
  );
  const constellationPaths = useMemo(
    () =>
      celestialPaths.map((points) =>
        points.map((p) =>
          equatorialToHorizontal(
            (((p.lon / 15) % 24) + 24) % 24,
            p.lat,
            lat,
            localSidereal,
          ),
        ),
      ),
    [celestialPaths, lat, localSidereal],
  );
  const draw = useCallback(() => {
    const canvas = canvasRef.current,
      ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const w = canvas.clientWidth,
      h = canvas.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    if (
      canvas.width !== Math.round(w * dpr) ||
      canvas.height !== Math.round(h * dpr)
    ) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cx = w / 2,
      cy = h / 2,
      scale =
        look.projection === "dome"
          ? Math.max(1, Math.min(w, h) / 2 - 30)
          : h / 2;
    const projector = createSkyProjector(look);
    ctx.fillStyle = "#07121c";
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    if (look.projection === "dome") {
      ctx.beginPath();
      ctx.arc(cx, cy, scale, 0, Math.PI * 2);
      ctx.clip();
    }
    const screen = (az: number, alt: number) => {
      const p = projector.project(az, alt);
      return { ...p, x: cx + p.x * scale, y: cy - p.y * scale };
    };
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, "#050b17");
    gradient.addColorStop(1, "#162d46");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
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
    if(showArt) for(const {art,image} of artCache.current) drawSkyArt(ctx,art,image,(ra,dec)=>{
      const p=equatorialToHorizontal(ra,dec,lat,localSidereal);
      return {...screen(p.az,p.alt),visible:p.alt>=0 && screen(p.az,p.alt).visible};
    },artOpacity);
    if (showHorizon)
      path(
        Array.from({ length: 721 }, (_, i) => ({ az: i / 2, alt: 0 })),
        "#9eb9ae",
        1.5,
      );
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
    const occupied: { x: number; y: number; width: number; height: number }[] =
      look.projection === "dome" && w < 500
        ? []
        : [{ x: fa ? w - 225 : 16, y: 16, width: 210, height: 80 }];
    let labels = 0;
    const ordered = selected
      ? [
          ...horizontal.filter((q) => q.star.id === selected.id),
          ...horizontal.filter((q) => q.star.id !== selected.id),
        ]
      : horizontal;
    for (const q of ordered) {
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
        (q.star.mag < (w < 500 ? 1.9 : 2.5) || selected?.id === q.star.id) &&
        labels < (w < 500 ? 9 : 35)
      ) {
        ctx.font = "14px Vazirmatn Variable, sans-serif";
        ctx.textAlign = "left";
        ctx.direction = "ltr";
        const name = formatDigits(q.star.n, script),
          width = ctx.measureText(name).width;
        const candidates = [
          { x: p.x + radius + 7, y: p.y - 10, width, height: 18 },
          { x: p.x - width - radius - 7, y: p.y - 10, width, height: 18 },
          { x: p.x - width / 2, y: p.y - radius - 24, width, height: 18 },
          { x: p.x - width / 2, y: p.y + radius + 8, width, height: 18 },
        ];
        const place = candidates.find((r) => {
          if (
            r.x < 8 ||
            r.y < 8 ||
            r.x + r.width > w - 8 ||
            r.y + r.height > h - 8
          )
            return false;
          if (
            look.projection === "dome" &&
            [
              [r.x, r.y],
              [r.x + r.width, r.y],
              [r.x, r.y + r.height],
              [r.x + r.width, r.y + r.height],
            ].some(([x, y]) => Math.hypot(x - cx, y - cy) > scale - 5)
          )
            return false;
          return !occupied.some(
            (o) =>
              r.x < o.x + o.width + 10 &&
              r.x + r.width + 10 > o.x &&
              r.y < o.y + o.height + 5 &&
              r.y + r.height + 5 > o.y,
          );
        });
        if (place) {
          ctx.fillStyle = "#d7e4ef";
          ctx.fillText(name, place.x, place.y + 14);
          occupied.push(place);
          labels++;
        }
      }
    }

    if (showHorizon && look.projection !== "dome") {
      const key = JSON.stringify([w, h, dpr, look]);
      if (groundCache.current?.key !== key) {
        const mask = document.createElement("canvas");
        mask.width = canvas.width;
        mask.height = canvas.height;
        const mc = mask.getContext("2d")!;
        mc.scale(dpr, dpr);
        mc.fillStyle = "#13221f";
        for (let row = 0; row < mask.height; row++) {
          const y = row / dpr;
          for (const [left, right] of projector.groundSpans(
            (cy - y - 0.5 / dpr) / scale,
            -cx / scale,
            cx / scale,
          ))
            mc.fillRect(cx + left * scale, y, (right - left) * scale, 1 / dpr);
        }
        groundCache.current = { key, canvas: mask };
      }
      ctx.drawImage(groundCache.current.canvas, 0, 0, w, h);
      path(
        Array.from({ length: 721 }, (_, i) => ({ az: i / 2, alt: 0 })),
        "#9eb9ae",
        1.5,
      );
    }
    ctx.restore();
    pickRef.current = hits;
    canvas.dataset.visibleStars = String(hits.length);
    if (showHorizon) {
      ctx.textAlign = "center";
      ctx.font = "600 14px Vazirmatn Variable, sans-serif";
      for (const [az, label] of [
        [0, t("شمال", "North")],
        [90, t("شرق", "East")],
        [180, t("جنوب", "South")],
        [270, t("غرب", "West")],
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
    showArt,artOpacity,artRevision,lat,localSidereal,
    look,
    horizontal,
    constellationPaths,
    showGrid,
    showLines,
    showNames,
    showHorizon,
    selected,
    script,
    fa,
    t,
  ]);
  const drawRef = useRef(draw);
  const pendingFrame = useRef<number | null>(null);
  const scheduleDraw = useCallback(() => {
    if (pendingFrame.current != null) return;
    pendingFrame.current = requestAnimationFrame(() => {
      pendingFrame.current = null;
      drawRef.current();
    });
  }, []);
  useEffect(() => {
    drawRef.current = draw;
    scheduleDraw();
  }, [draw, scheduleDraw]);
  useEffect(() => {
    const ro = new ResizeObserver(scheduleDraw);
    if (canvasRef.current) ro.observe(canvasRef.current);
    let mounted = true;
    void document.fonts.ready.then(() => {
      if (mounted) scheduleDraw();
    });
    return () => {
      mounted = false;
      ro.disconnect();
      if (pendingFrame.current != null)
        cancelAnimationFrame(pendingFrame.current);
      pendingFrame.current = null;
    };
  }, [scheduleDraw]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2,
        y = r.height / 2 - (e.clientY - r.top);
      setLook((l) => {
        const scale =
          l.projection === "dome"
            ? Math.min(r.width, r.height) / 2 - 30
            : r.height / 2;
        if (l.projection === "dome" && Math.hypot(x, y) > scale) return l;
        return zoomLook(
          l,
          Math.exp(Math.max(-200, Math.min(200, e.deltaY)) * 0.0015),
          x / scale,
          y / scale,
          x / (r.height / 2),
          y / (r.height / 2),
        );
      });
    };
    canvas.addEventListener("wheel", wheel, { passive: false });
    return () => canvas.removeEventListener("wheel", wheel);
  }, []);
  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // A pointer that is already gone should not take down the sky page.
    }
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
      const [a, b] = [...pointers.current.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      const other = [...pointers.current.entries()].find(
        ([id]) => id !== e.pointerId,
      )![1];
      const r = e.currentTarget.getBoundingClientRect();
      const from = { x: (old.x + other.x) / 2, y: (old.y + other.y) / 2 };
      const to = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const previousDistance = Math.hypot(old.x - other.x, old.y - other.y);
      if (distance > 0 && previousDistance > 0)
        setLook((l) => {
          const scale =
            l.projection === "dome"
              ? Math.min(r.width, r.height) / 2 - 30
              : r.height / 2;
          const x = (from.x - r.left - r.width / 2) / scale,
            y = (r.height / 2 - from.y + r.top) / scale;
          const zoomed = zoomLook(
            l,
            previousDistance / distance,
            x,
            y,
            (from.x - r.left - r.width / 2) / (r.height / 2),
            (r.height / 2 - from.y + r.top) / (r.height / 2),
          );
          const nextScale = r.height / 2;
          return dragLook(
            zoomed,
            (from.x - r.left - r.width / 2) / nextScale,
            (r.height / 2 - from.y + r.top) / nextScale,
            (to.x - r.left - r.width / 2) / nextScale,
            (r.height / 2 - to.y + r.top) / nextScale,
          );
        });
      gesture.current.pinch = distance;
      gesture.current.moved = true;
      return;
    }
    if (
      Math.hypot(e.clientX - gesture.current.x, e.clientY - gesture.current.y) >
      4
    )
      gesture.current.moved = true;
    // Read the event before setState. React may replay the updater during
    // render, after the pointer event has been released and currentTarget is null.
    const r = e.currentTarget.getBoundingClientRect();
    const fromX = old.x - r.left - r.width / 2,
      fromY = r.height / 2 - old.y + r.top;
    const toX = e.clientX - r.left - r.width / 2,
      toY = r.height / 2 - e.clientY + r.top;
    setLook((l) => {
      const scale =
        l.projection === "dome"
          ? Math.min(r.width, r.height) / 2 - 30
          : r.height / 2;
      return dragLook(
        l,
        fromX / scale,
        fromY / scale,
        toX / scale,
        toY / scale,
      );
    });
  };
  const onUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.delete(e.pointerId);
    // A remaining finger starts a fresh drag after a pinch; never turn it into a click.
    if (pointers.current.size === 1) {
      const remaining = [...pointers.current.values()][0];
      gesture.current = { ...remaining, moved: true, pinch: 0 };
    }
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
      setLocationStatus("unavailable");
      return;
    }
    setLocationStatus("waiting");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLat(p.coords.latitude);
        setLon(p.coords.longitude);
        setLocationStatus("device");
      },
      () => setLocationStatus("unavailable"),
      { timeout: 10000 },
    );
  };
  const focus = (s: SkyStar) => {
    setSelected(s);
    const p = equatorialToAzAlt(s.ra, s.dec, lat, lon, now);
    setLook((l) => ({
      ...l,
      az: p.az,
      alt: Math.max(-89, Math.min(90, p.alt)),
      roll: 0,
      projection: "stereographic",
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
            <div className="workspace sky-workspace" ref={stageRef}>
              <div className="workspace-toolbar">
                <fieldset className="sky-view-switch">
                  <legend className="sr-only">
                    {t("نمای آسمان", "Sky view")}
                  </legend>
                  <button
                    type="button"
                    aria-pressed={look.projection !== "dome"}
                    onClick={() =>
                      setLook({
                        horizonLocked: true,
                        az: 180,
                        alt: 35,
                        fov: 100,
                        roll: 0,
                        projection: "stereographic",
                      })
                    }
                  >
                    {t("گردش در آسمان", "Explore")}
                  </button>
                  <button
                    type="button"
                    aria-pressed={look.projection === "dome"}
                    onClick={() =>
                      setLook({
                        horizonLocked: true,
                        az: 180,
                        alt: 90,
                        fov: 180,
                        roll: 0,
                        projection: "dome",
                      })
                    }
                  >
                    {t("تمام آسمان", "All-sky dome")}
                  </button>
                </fieldset>
                <div className="relative min-w-0 flex-1">
                  <label className="sr-only" htmlFor="star-search">
                    {t("جست\u200cوجوی ستاره / Search stars", "Search stars")}
                  </label>
                  <Search
                    size={15}
                    className="absolute start-3 top-3 text-[var(--muted)]"
                  />
                  <input
                    id="star-search"
                    className="control-input !ps-9"
                    placeholder={t(
                      "نام ستاره یا شناسه · Sirius",
                      "Star name or ID · Sirius",
                    )}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {query && (
                    <div className="absolute inset-x-0 top-full z-30 mt-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-2 shadow-xl">
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
                        <p className="p-3 text-xs">
                          {t("ستاره\u200cای یافت نشد.", "No stars found.")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("Fullscreen sky / تمام‌صفحه", "Fullscreen sky")}
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
                  data-projection={look.projection ?? "stereographic"}
                  data-visible-stars={pickRef.current.length}
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
                      const key = e.key;
                      if (key === "Escape") {
                        setSelected(null);
                        setQuery("");
                      } else if (["+", "=", "-"].includes(key))
                        setLook((l) => zoomLook(l, key === "-" ? 1.15 : 0.85));
                      else
                        setLook((l) =>
                          l.projection === "dome"
                            ? {
                                ...l,
                                az:
                                  (l.az +
                                    (key === "ArrowRight"
                                      ? 5
                                      : key === "ArrowLeft"
                                        ? -5
                                        : 0) +
                                    360) %
                                  360,
                              }
                            : panLook(
                                l,
                                key === "ArrowRight"
                                  ? -35
                                  : key === "ArrowLeft"
                                    ? 35
                                    : 0,
                                key === "ArrowUp"
                                  ? 35
                                  : key === "ArrowDown"
                                    ? -35
                                    : 0,
                                690,
                              ),
                        );
                    }
                  }}
                />
                {(!loaded || error) && (
                  <div
                    className="absolute inset-0 flex flex-col gap-4 items-center justify-center bg-[var(--panel)] p-6 text-sm text-center"
                    role="status"
                  >
                    {error
                      ? t(
                          "دریافت کاتالوگ ناموفق بود. دوباره تلاش کنید.",
                          "The star catalogue could not be loaded. Try again.",
                        )
                      : t(
                          "در حال دریافت کاتالوگ ستارگان…",
                          "Loading the star catalogue…",
                        )}
                    {error && (
                      <Button size="sm" onClick={() => setRetry((v) => v + 1)}>
                        {t("تلاش دوباره", "Try again")}
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
                    {look.projection === "dome"
                      ? "ALL-SKY · 180°"
                      : `FOV ${look.fov.toFixed(0)}°`}{" "}
                    · {playing ? "LIVE" : "PAUSED"}
                  </p>
                </div>
                <div className="absolute end-3 bottom-3 flex flex-col gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    aria-label={t("Zoom in / بزرگ‌نمایی", "Zoom in")}
                    onClick={() => setLook((l) => zoomLook(l, 0.8))}
                  >
                    <Plus size={17} />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    aria-label={t("Zoom out / کوچک‌نمایی", "Zoom out")}
                    onClick={() => setLook((l) => zoomLook(l, 1.25))}
                  >
                    <Minus size={17} />
                  </Button>
                </div>
              </div>
              <div className="workspace-legend">
                <span>
                  {t(
                    "شمال ۰° · شرق ۹۰° · جنوب ۱۸۰° · غرب ۲۷۰°",
                    "North 0° · East 90° · South 180° · West 270°",
                  )}
                </span>
                <span>
                  {t(
                    "کشیدن / کلیدهای جهت · زوم دو انگشتی · انتخاب با کلیک",
                    "Drag or use arrow keys · pinch to zoom · select a star",
                  )}
                </span>
              </div>
            </div>
            <aside className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5">
              <p className="study-kicker">OBSERVER / TIME</p>
              <h2 className="text-lg text-[var(--gold-soft)]">
                {t("مکان و زمان رصد", "Observer and time")}
              </h2>
              <p
                role="status"
                className="text-xs leading-6 text-[var(--muted)]"
              >
                {locationLabel}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <CoordinateInput
                  label={t("عرض شمالی φ", "Latitude φ")}
                  value={lat}
                  limit={90}
                  onCommit={(v) => {
                    setLat(v);
                    setLocationStatus("manual");
                  }}
                />
                <CoordinateInput
                  label={t("طول شرقی λ", "Longitude λ")}
                  value={lon}
                  limit={180}
                  onCommit={(v) => {
                    setLon(v);
                    setLocationStatus("manual");
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
                {t("موقعیت دستگاه", "Use my location")}
              </Button>
              <label className="block text-xs space-y-2">
                {t("زمان UTC", "UTC time")}
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
                  {playing ? t("توقف", "Pause") : t("زنده", "Live")}
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
                  {t("اکنون", "Now")}
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
                  {t("−۱ ساعت", "−1 hour")}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setNow((d) => new Date(d.getTime() + 3600000));
                    setPlaying(false);
                  }}
                >
                  {t("+۱ ساعت", "+1 hour")}
                </Button>
              </div>
              <div className="border-t border-[var(--border)] pt-4 space-y-3">
                <h3 className="text-sm text-[var(--gold-soft)]">
                  {t("لایه\u200cها و جهت نگاه", "Layers and direction")}
                </h3>
                {[
                  [
                    showLines,
                    setShowLines,
                    t("خطوط صورت‌های فلکی", "Constellation lines"),
                  ],
                  [showNames, setShowNames, t("نام ستاره‌ها", "Star names")],
                  [showArt,setShowArt,t("نگاره‌های صوفی", "Al-Sufi artwork")],
                  [
                    showGrid,
                    setShowGrid,
                    t("شبکهٔ سمت و ارتفاع", "Altitude and azimuth grid"),
                  ],
                  [
                    showHorizon,
                    setShowHorizon,
                    t("افق هندسی", "Geometric horizon"),
                  ],
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
                {showArt && <div className="space-y-2 text-xs"><label>{t("شفافیت نگاره‌ها", "Artwork opacity")}<input aria-label="Artwork opacity" className="w-full" type="range" min="0.1" max="0.8" step="0.05" value={artOpacity} onChange={e=>setArtOpacity(Number(e.target.value))}/></label><a className="underline text-[var(--muted)]" href="/sky/sufi/ATTRIBUTION.md" target="_blank" rel="noreferrer">Stellarium · Khalid Al-Ajaji / Kutaibaa Akraa · CC BY-ND 4.0</a></div>}
                <label className="block text-xs">
                  {t("حد قدر", "Limiting magnitude")} · {magLimit.toFixed(1)}
                  <input
                    aria-label={t(
                      "Limiting magnitude / حد قدر",
                      "Limiting magnitude",
                    )}
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
                        setLook((l) => ({
                          ...l,
                          az: Number(az),
                          alt: 25,
                          roll: 0,
                          projection: "stereographic",
                        }))
                      }
                    >
                      {label}
                    </Button>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setLook((l) => ({
                        ...l,
                        alt: 90,
                        fov: 90,
                        roll: 0,
                        projection: "stereographic",
                      }))
                    }
                  >
                    {t("سرسو", "Zenith")}
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
              className="rounded-2xl border border-[var(--gold)]/35 bg-[var(--panel)] p-5 space-y-3"
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
                  {t("بستن انتخاب", "Close selection")}
                </Button>
              </div>
              <p className="text-sm" dir="ltr">
                RA {selected.ra.toFixed(4)} h · Dec {selected.dec.toFixed(3)}° ·
                Mag {selected.mag.toFixed(2)} · Az {selectedH.az.toFixed(2)}° ·
                Alt {selectedH.alt.toFixed(2)}°
              </p>
              {selectedH.alt < 0 && (
                <p className="text-sm text-[var(--rose-ink)]">
                  {t(
                    "این ستاره در زمان و مکان انتخابی زیر افق است. برای دیدن آن، زمان را تغییر دهید.",
                    "This star is below the horizon at the selected time and place. Change the time to see it.",
                  )}
                </p>
              )}
            </section>
          )}
          <p className="max-w-4xl text-sm leading-7 text-[var(--muted)]">
            {t(
              "نمای گردش، استریوگرافیک است؛ نمای تمام‌آسمان فاصلهٔ زاویه‌ای از سرسو را حفظ می‌کند. ستاره‌ها، شبکه و افق از یک مدل کروی رسم می‌شوند. موقعیت‌ها هندسی‌اند؛ شکست جو، تقدیم، ترقّص و حرکت خاص برای تاریخ رصد اعمال نشده‌اند. این ابزار آموزشی جای محاسبهٔ اخترسنجی دقیق را نمی‌گیرد.",
              "Explore uses stereographic projection; the all-sky dome preserves angular distance from the zenith. Stars, grid and horizon share one spherical model. Positions are geometric: refraction, precession, nutation and proper motion for the observation date are not applied. This educational chart does not replace precise astrometry.",
            )}
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
  const { t } = useLanguage();
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
              {t(
                `عددی بین ${-limit} و ${limit} وارد کنید.`,
                `Enter a number between ${-limit} and ${limit}.`,
              )}
            </span>
          )}
        </label>
      }
    </LocalizedDigits>
  );
}
