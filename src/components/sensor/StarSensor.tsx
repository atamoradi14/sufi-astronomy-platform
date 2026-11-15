"use client";

import { useLanguage } from "@/components/language/Language";
import { LocalizedDigits } from "@/components/digits/DigitScript";
import { Button } from "@/components/ui/button";
import { downloadCsv } from "@/lib/charts/csv";
import { formatDms } from "@/lib/astronomy/angle";
import { useGeolocation } from "@/hooks/useGeolocation";
import { decodeCatalog, type SensorCatalog } from "@/lib/sensor/catalog";
import { detectStars, imageDataToGray } from "@/lib/sensor/detect";
import { readExif } from "@/lib/sensor/exif";
import { radecToVec, type Vec3 } from "@/lib/sensor/math";
import { planetIcrs, reducePlace, skyContext, type ReducedPlace, type Site } from "@/lib/sensor/place";
import { addNoise, renderPlate } from "@/lib/sensor/render";
import {
  apparentToPixel,
  cameraFromBoresight,
  solvePlate,
  type PlateSolution,
} from "@/lib/sensor/solve";
import { Camera, Crosshair, ImagePlus, Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";

type LineFile = {
  constellations: { id: string; en: string; lines: number[][][] }[];
};

type Hold = {
  solution: PlateSolution;
  at: number;
  lat: number;
  lon: number;
};

const inputClass =
  "h-10 w-full rounded-md border border-[var(--border)] bg-[var(--ink)] px-3 text-sm text-[var(--parchment)] outline-none focus:border-[var(--gold)]";

let catalogPromise: Promise<SensorCatalog> | null = null;
let linePromise: Promise<LineFile> | null = null;

function loadCatalog() {
  catalogPromise ??= fetch("/data/sensor-catalog.json")
    .then((res) => {
      if (!res.ok) throw new Error("catalog");
      return res.json();
    })
    .then((raw) => decodeCatalog(raw));
  return catalogPromise;
}

function loadLines() {
  linePromise ??= fetch("/data/constellations-iau.json").then((res) => res.json());
  return linePromise;
}

function formatRa(deg: number) {
  const hours = (((deg % 360) + 360) % 360) / 15;
  const h = Math.floor(hours);
  const mFloat = (hours - h) * 60;
  const m = Math.floor(mFloat);
  const s = (mFloat - m) * 60;
  return `${h}h ${String(m).padStart(2, "0")}m ${s.toFixed(2)}s`;
}

function formatSigma(arcsec: number) {
  const digits = Math.abs(arcsec) >= 10 ? 1 : 2;
  return `${arcsec.toFixed(digits)}″`;
}

function localInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function drawLines(ctx: CanvasRenderingContext2D, solution: PlateSolution, file: LineFile) {
  const known = new Set(solution.constellations.map((c) => c.code));
  ctx.strokeStyle = "rgba(120, 186, 176, 0.55)";
  ctx.lineWidth = 1;
  for (const con of file.constellations) {
    if (!known.has(con.id)) continue;
    for (const poly of con.lines) {
      let open = false;
      ctx.beginPath();
      for (const pt of poly) {
        const pix = apparentToPixel(solution.camera, radecToVec(pt[0] * 15, pt[1]));
        if (
          !pix ||
          pix.x < -20 ||
          pix.y < -20 ||
          pix.x > solution.width + 20 ||
          pix.y > solution.height + 20
        ) {
          open = false;
          continue;
        }
        if (!open) {
          ctx.moveTo(pix.x, pix.y);
          open = true;
        } else ctx.lineTo(pix.x, pix.y);
      }
      ctx.stroke();
    }
  }
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  solution: PlateSolution,
  site: Site,
  labelNames: boolean,
  picked: number | null,
) {
  const cx = (solution.width - 1) / 2;
  const cy = (solution.height - 1) / 2;
  ctx.strokeStyle = "rgba(232, 196, 106, 0.9)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 18, cy);
  ctx.lineTo(cx + 18, cy);
  ctx.moveTo(cx, cy - 18);
  ctx.lineTo(cx, cy + 18);
  ctx.stroke();
  solution.stars.forEach((star, i) => {
    const pickedStar = i === picked;
    ctx.beginPath();
    ctx.strokeStyle = pickedStar
      ? "rgba(255,255,255,0.95)"
      : star.matched
        ? "rgba(232, 196, 106, 0.85)"
        : "rgba(180, 190, 200, 0.45)";
    ctx.lineWidth = pickedStar ? 2 : 1;
    ctx.arc(star.x, star.y, pickedStar ? 9 : star.matched ? 6 : 4, 0, Math.PI * 2);
    ctx.stroke();
    if (labelNames && star.matched && star.name && (star.mag ?? 9) <= 3.2) {
      ctx.fillStyle = "rgba(244, 236, 216, 0.92)";
      ctx.font = "12px sans-serif";
      ctx.fillText(star.name, star.x + 8, star.y - 6);
    }
  });
  for (const planet of planetIcrs(site)) {
    const pix = apparentToPixel(solution.camera, planet.vec);
    if (!pix) continue;
    if (pix.x < 0 || pix.y < 0 || pix.x > solution.width || pix.y > solution.height) continue;
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 176, 120, 0.95)";
    ctx.arc(pix.x, pix.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 210, 170, 0.95)";
    ctx.font = "12px sans-serif";
    ctx.fillText(planet.name, pix.x + 7, pix.y + 4);
  }
}

function movedKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const p = Math.PI / 180;
  const dLat = (lat2 - lat1) * p;
  const dLon = (lon2 - lon1) * p;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * p) * Math.cos(lat2 * p) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function StarSensor() {
  const { t } = useLanguage();
  const geo = useGeolocation(false);
  const viewRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const siteLock = useRef(false);
  const paintGen = useRef(0);
  const [lat, setLat] = useState("35.6892");
  const [lon, setLon] = useState("51.389");
  const [height, setHeight] = useState("1200");
  const [when, setWhen] = useState(() => localInputValue(new Date()));
  const [exifNote, setExifNote] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hold, setHold] = useState<Hold | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [namesOn, setNamesOn] = useState(true);
  const [hasFrame, setHasFrame] = useState(false);

  useEffect(() => {
    if (siteLock.current || !geo.reading) return;
    setLat(geo.reading.lat.toFixed(5));
    setLon(geo.reading.lon.toFixed(5));
    if (geo.reading.altitude != null) setHeight(String(Math.round(geo.reading.altitude)));
  }, [geo.reading]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const site = useMemo<Site>(() => {
    const parsed = new Date(when);
    return {
      lat: Number(lat),
      lon: Number(lon),
      height: Number(height) || 0,
      date: Number.isNaN(parsed.getTime()) ? new Date() : parsed,
    };
  }, [lat, lon, height, when]);

  const siteOk =
    Number.isFinite(site.lat) &&
    site.lat <= 90 &&
    site.lat >= -90 &&
    Number.isFinite(site.lon) &&
    Number.isFinite(site.height);
  const places = useMemo(() => {
    if (!hold || !siteOk) return null;
    const ctx = skyContext(site);
    const beta = ctx.beta ?? ([0, 0, 0] as Vec3);
    const center = reducePlace(
      radecToVec(hold.solution.raDeg, hold.solution.decDeg),
      site,
      beta,
    );
    const stars = hold.solution.stars.map((star) =>
      reducePlace(radecToVec(star.raDeg, star.decDeg), site, beta),
    );
    return { center, stars };
  }, [hold, site, siteOk]);

  useEffect(() => {
    const view = viewRef.current;
    const frame = frameRef.current;
    if (!view || !frame || !hold || !siteOk) return;
    const token = ++paintGen.current;
    const solution = hold.solution;
    view.width = frame.width;
    view.height = frame.height;
    const ctx = view.getContext("2d");
    if (!ctx) return;
    const redraw = () => {
      if (paintGen.current !== token) return;
      ctx.drawImage(frame, 0, 0);
      drawFrame(ctx, solution, site, namesOn, selected);
    };
    redraw();
    void loadLines()
      .then((file) => {
        if (paintGen.current !== token) return;
        ctx.drawImage(frame, 0, 0);
        drawLines(ctx, solution, file);
        drawFrame(ctx, solution, site, namesOn, selected);
      })
      .catch(() => redraw());
  }, [hold, namesOn, selected, site, siteOk]);

  async function solveFrame(canvas: HTMLCanvasElement) {
    if (!siteOk) {
      setError(
        t(
          "عرض باید بین ۹۰− و ۹۰+ باشد و طول و ارتفاع عدد باشند.",
          "Latitude must be between −90 and +90, and longitude and height must be numbers.",
        ),
      );
      return;
    }
    setBusy(t("در حال تطبیق با فهرست ستاره‌ها…", "Matching the star catalog…"));
    setHasFrame(true);
    setError(null);
    setSelected(null);
    const snapshot = canvas;
    frameRef.current = snapshot;
    const view = viewRef.current;
    if (view) {
      view.width = snapshot.width;
      view.height = snapshot.height;
      view.getContext("2d")?.drawImage(snapshot, 0, 0);
    }
    try {
      const cat = await loadCatalog();
      const pixels = snapshot.getContext("2d")?.getImageData(0, 0, snapshot.width, snapshot.height);
      if (!pixels) throw new Error("pixels");
      const gray = imageDataToGray(pixels.data, snapshot.width, snapshot.height);
      const dets = detectStars(gray, snapshot.width, snapshot.height);
      const ctx = skyContext(site);
      const solved = solvePlate(cat, dets, snapshot.width, snapshot.height, ctx);
      if (!solved.ok) {
        setHold(null);
        const found = String(dets.length);
        setError(
          solved.reason === "too-few-stars"
            ? t(
                `${found} نقطهٔ ستاره‌مانند پیدا شد، که برای حل کافی نیست. آسمان تاریک‌تر، ستاره‌های نقطه‌ای و افق بیرون از قاب نتیجهٔ بهتری می‌دهد.`,
                `Found ${found} star-like points, which is not enough to solve. A darker sky, sharper stars, and the horizon outside the frame work better.`,
              )
            : t(
                `${found} ستاره پیدا شد، ولی الگوی آن‌ها با فهرست جور نشد. ابر، مهتاب شدید، یا ساختمانی در قاب را کم کنید و دوباره حل کنید.`,
                `Found ${found} stars, but their pattern did not match the catalog. Keep clouds, a bright moon, and buildings out of the frame and solve again.`,
              ),
        );
        return;
      }
      setHold({
        solution: solved,
        at: site.date.getTime(),
        lat: site.lat,
        lon: site.lon,
      });
    } catch {
      setError(
        t(
          "حل تصویر ممکن نشد. اتصال را بررسی کنید و دوباره تلاش کنید.",
          "The plate could not be solved. Check the connection and try again.",
        ),
      );
    } finally {
      setBusy(null);
    }
  }

  async function ingest(blob: Blob) {
    setBusy(t("خواندن تصویر…", "Reading the image…"));
    setError(null);
    setExifNote(null);
    try {
      if (blob.type.includes("jpeg") || blob.type.includes("jpg")) {
        const info = readExif(await blob.arrayBuffer());
        if (info.date) {
          siteLock.current = true;
          setWhen(localInputValue(info.date));
          setExifNote(
            t(
              "زمان فایل منطقهٔ زمانی ندارد و به وقت محلی همین دستگاه خوانده شد.",
              "The file time has no timezone, so it was read as this device’s local time.",
            ),
          );
        }
        if (info.lat != null && info.lon != null) {
          siteLock.current = true;
          setLat(info.lat.toFixed(5));
          setLon(info.lon.toFixed(5));
          if (info.alt != null) setHeight(String(Math.round(info.alt)));
        }
      }
      let bitmap: ImageBitmap;
      try {
        bitmap = await createImageBitmap(blob, {
          imageOrientation: "from-image",
        } as ImageBitmapOptions);
      } catch {
        bitmap = await createImageBitmap(blob);
      }
      const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(2, Math.round(bitmap.width * scale));
      canvas.height = Math.max(2, Math.round(bitmap.height * scale));
      canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      await solveFrame(canvas);
    } catch {
      setBusy(null);
      setError(t("این فایل به‌عنوان تصویر باز نشد.", "This file could not be opened as an image."));
    }
  }

  async function openCamera() {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(
        t(
          "این مرورگر دوربین را در صفحه باز نمی‌کند. از دکمهٔ بارگذاری استفاده کنید.",
          "This browser cannot open a camera in the page. Use upload instead.",
        ),
      );
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1600 },
          height: { ideal: 1200 },
        },
      });
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = stream;
      setCameraOn(true);
      requestAnimationFrame(() => {
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        void video.play();
      });
    } catch {
      setError(
        t(
          "دسترسی به دوربین داده نشد.",
          "Camera access was not granted.",
        ),
      );
    }
  }

  function capture() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) void ingest(blob);
      },
      "image/jpeg",
      0.92,
    );
  }

  function closeCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOn(false);
  }

  async function showSample() {
    setBusy(t("ساخت آسمان نمونه…", "Building a sample sky…"));
    setError(null);
    setExifNote(null);
    try {
      const cat = await loadCatalog();
      const width = 960;
      const height = 720;
      const f = height / 2 / Math.tan(((46 * Math.PI) / 180) / 2);
      const cam = cameraFromBoresight(84, -2, 18, f, width, height, -0.05, 0.01);
      const plate = renderPlate(cat, cam, skyContext(site), width, height, 6.1);
      addNoise(plate.gray, 1.5, 11);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const img = ctx.createImageData(width, height);
      for (let i = 0; i < plate.gray.length; i++) {
        const v = plate.gray[i];
        img.data[i * 4] = v;
        img.data[i * 4 + 1] = v;
        img.data[i * 4 + 2] = v;
        img.data[i * 4 + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      await solveFrame(canvas);
    } catch {
      setBusy(null);
      setError(t("نمونه ساخته نشد.", "The sample plate could not be built."));
    }
  }

  function onPickStar(event: MouseEvent<HTMLCanvasElement>) {
    const canvas = viewRef.current;
    if (!canvas || !hold) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) * canvas.width) / rect.width;
    const y = ((event.clientY - rect.top) * canvas.height) / rect.height;
    let best = -1;
    let bestD = 18 ** 2;
    hold.solution.stars.forEach((star, i) => {
      const d = (star.x - x) ** 2 + (star.y - y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    setSelected(best >= 0 ? best : null);
  }

  function exportCsv() {
    if (!hold || !places) return;
    const rows = hold.solution.stars.map((star, i) => {
      const place = places.stars[i];
      return {
        kind: "star",
        name: star.name ?? "",
        hip: star.hip ?? "",
        constellation: star.con ?? "",
        mag: star.mag ?? "",
        x_px: star.x.toFixed(2),
        y_px: star.y.toFixed(2),
        ra_icrs_deg: star.raDeg.toFixed(7),
        dec_icrs_deg: star.decDeg.toFixed(7),
        ra_apparent_hours: place.raAppHours.toFixed(7),
        dec_apparent_deg: place.decAppDeg.toFixed(6),
        alt_deg: place.altDeg.toFixed(6),
        az_deg: place.azDeg.toFixed(6),
        residual_arcsec: star.residualArcsec?.toFixed(2) ?? "",
        matched: star.matched ? "yes" : "no",
      };
    });
    rows.unshift({
      kind: "center",
      name: "",
      hip: "",
      constellation: "",
      mag: "",
      x_px: ((hold.solution.width - 1) / 2).toFixed(2),
      y_px: ((hold.solution.height - 1) / 2).toFixed(2),
      ra_icrs_deg: hold.solution.raDeg.toFixed(7),
      dec_icrs_deg: hold.solution.decDeg.toFixed(7),
      ra_apparent_hours: places.center.raAppHours.toFixed(7),
      dec_apparent_deg: places.center.decAppDeg.toFixed(6),
      alt_deg: places.center.altDeg.toFixed(6),
      az_deg: places.center.azDeg.toFixed(6),
      residual_arcsec: hold.solution.sigmaCenterArcsec.toFixed(2),
      matched: "center",
    });
    downloadCsv("star-sensor.csv", rows);
  }

  const drift =
    hold &&
    (Math.abs(site.date.getTime() - hold.at) > 12 * 3600 * 1000 ||
      movedKm(hold.lat, hold.lon, site.lat, site.lon) > 400);
  const solution = hold?.solution ?? null;
  const ordered = solution
    ? solution.stars
        .map((star, index) => ({ star, index }))
        .sort((a, b) => Number(b.star.matched) - Number(a.star.matched) || (a.star.mag ?? 99) - (b.star.mag ?? 99))
    : [];

  return (
    <LocalizedDigits>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <header className="space-y-3">
          <p className="text-sm text-[var(--teal)]">
            {t("مانند حسگر ماهواره، در مرورگر", "A star tracker, in the browser")}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
            {t("حسگر ستاره (هوش مصنوعی ستاره‌یاب)", "Star sensor (AI star finder)")}
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-[var(--muted)]">
            {t(
              "عکس آسمان را بارگذاری کنید یا با دوربین بگیرید. ستاره‌ها با هندسهٔ مثلث‌ها و فهرست هیپارکوس شناسایی می‌شوند، همان روشی که حسگر ماهواره را به دقت ثانیهٔ قوسی می‌رساند. مرکز تصویر و هر ستاره، بعد و میل هندسی و ارتفاع و سمت ظاهری می‌گیرند.",
              "Upload a sky photo or take one with the camera. Stars are identified by triangle geometry against a Hipparcos catalog, the same method a satellite star tracker uses when the result has to be arcseconds. The center and every star get a geometric RA/Dec and an apparent altitude and azimuth.",
            )}
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <form
            className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="block text-xs text-[var(--muted)]">
              {t("عرض جغرافیایی", "Latitude")}
              <input
                className={inputClass}
                dir="ltr"
                inputMode="decimal"
                value={lat}
                onChange={(event) => {
                  siteLock.current = true;
                  setLat(event.target.value);
                }}
              />
            </label>
            <label className="block text-xs text-[var(--muted)]">
              {t("طول جغرافیایی", "Longitude")}
              <input
                className={inputClass}
                dir="ltr"
                inputMode="decimal"
                value={lon}
                onChange={(event) => {
                  siteLock.current = true;
                  setLon(event.target.value);
                }}
              />
            </label>
            <label className="block text-xs text-[var(--muted)]">
              {t("ارتفاع از سطح دریا (متر)", "Height above sea level (m)")}
              <input
                className={inputClass}
                dir="ltr"
                inputMode="decimal"
                value={height}
                onChange={(event) => {
                  siteLock.current = true;
                  setHeight(event.target.value);
                }}
              />
            </label>
            <label className="block text-xs text-[var(--muted)]">
              {t("زمان عکس، به وقت محلی دستگاه", "Photo time, device local")}
              <input
                className={inputClass}
                dir="ltr"
                type="datetime-local"
                value={when}
                onChange={(event) => {
                  siteLock.current = true;
                  setWhen(event.target.value);
                }}
              />
            </label>
            <p className="text-xs leading-5 text-[var(--muted)]">
              {geo.error
                ? t(geo.error, "Location is unavailable, so the Tehran sample is filled in until you edit it.")
                : t(
                    "مختصات از GPS پر می‌شود مگر اینکه فایل یا شما آن را عوض کند. ارتفاع و سمت به مکان و زمان وابسته‌اند؛ بعد و میل هندسی صفحه به آن‌ها وابسته نیست.",
                    "Coordinates fill from GPS unless the file or you replace them. Altitude and azimuth depend on place and time; the plate’s geometric RA and Dec do not.",
                  )}
            </p>
            {exifNote ? <p className="text-xs leading-5 text-[var(--teal)]">{exifNote}</p> : null}
          </form>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex">
                <input
                  className="sr-only"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (file) void ingest(file);
                  }}
                />
                <span className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md bg-[var(--gold)] px-4 text-sm font-medium text-[var(--ink)]">
                  <Upload className="h-4 w-4" />
                  {t("بارگذاری عکس", "Upload photo")}
                </span>
              </label>
              {cameraOn ? (
                <>
                  <Button type="button" onClick={capture} disabled={!!busy}>
                    <Camera className="h-4 w-4" />
                    {t("ثبت عکس", "Capture")}
                  </Button>
                  <Button type="button" variant="secondary" onClick={closeCamera}>
                    {t("بستن دوربین", "Close camera")}
                  </Button>
                </>
              ) : (
                <Button type="button" variant="secondary" onClick={() => void openCamera()}>
                  <Camera className="h-4 w-4" />
                  {t("دوربین", "Camera")}
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => void showSample()} disabled={!!busy}>
                <ImagePlus className="h-4 w-4" />
                {t("آسمان نمونه", "Sample sky")}
              </Button>
              {solution ? (
                <Button type="button" variant="ghost" onClick={exportCsv}>
                  CSV
                </Button>
              ) : null}
            </div>

            {cameraOn ? (
              <video
                ref={videoRef}
                className="max-h-[70vh] w-full rounded-xl bg-black object-contain"
                playsInline
                muted
                autoPlay
              />
            ) : null}

            <div className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-black">
              <canvas
                ref={viewRef}
                onClick={onPickStar}
                className={`max-h-[70vh] w-full object-contain ${hasFrame ? "block" : "hidden"}`}
              />
              {!hasFrame && !cameraOn ? (
                <div className="flex min-h-64 flex-col items-center justify-center gap-2 px-6 py-16 text-center text-sm text-[var(--muted)]">
                  <Crosshair className="h-8 w-8 text-[var(--gold)]" />
                  <p>
                    {t(
                      "هنوز تصویری نیست. یک عکس آسمان بارگذاری کنید، دوربین را باز کنید، یا آسمان نمونه را حل کنید.",
                      "No image yet. Upload a sky photo, open the camera, or solve the sample sky.",
                    )}
                  </p>
                </div>
              ) : null}
              {busy ? (
                <p className="absolute inset-x-0 bottom-0 bg-black/70 px-3 py-2 text-sm text-[var(--gold-soft)]">
                  {busy}
                </p>
              ) : null}
            </div>
            {solution ? (
              <label className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <input
                  type="checkbox"
                  checked={namesOn}
                  onChange={(event) => setNamesOn(event.target.checked)}
                />
                {t("نام ستاره‌های روشن", "Label bright stars")}
              </label>
            ) : null}
            {error ? (
              <p className="rounded-md border border-red-400/40 bg-red-950/40 px-3 py-2 text-sm text-red-100">
                {error}
              </p>
            ) : null}
            {drift && solution ? (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[var(--gold)]/40 px-3 py-2 text-sm">
                <p>
                  {t(
                    "مکان یا زمان بیش از حد حل قبلی عوض شده است. ارتفاع و سمت به‌روزند، اما ابیراهی و اختلاف‌منظر برای دقت ثانیه‌ای نیاز به حل دوباره دارند.",
                    "Place or time has moved well past the last solve. Altitude and azimuth are updated, but aberration and parallax need another solve for arcsecond work.",
                  )}
                </p>
                <Button
                  type="button"
                  size="sm"
                  disabled={!!busy || !frameRef.current}
                  onClick={() => {
                    if (frameRef.current) void solveFrame(frameRef.current);
                  }}
                >
                  {t("حل دوباره", "Solve again")}
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {solution && places ? (
          <section className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <CoordCard
                title={t("مرکز تصویر — بعد", "Image center — RA")}
                value={formatRa(solution.raDeg)}
                detail={t(
                  `هندسی ICRS · ${formatDms(solution.raDeg, 1)}`,
                  `Geometric ICRS · ${formatDms(solution.raDeg, 1)}`,
                )}
              />
              <CoordCard
                title={t("مرکز تصویر — میل", "Image center — Dec")}
                value={formatDms(solution.decDeg, 1)}
                detail={t("هندسی ICRS", "Geometric ICRS")}
              />
              <CoordCard
                title={t("ارتفاع ظاهری مرکز", "Apparent altitude")}
                value={formatDms(places.center.altDeg, 1)}
                detail={t(
                  `با شکست ${places.center.refractionArcsec.toFixed(1)}″`,
                  `Refraction ${places.center.refractionArcsec.toFixed(1)}″`,
                )}
              />
              <CoordCard
                title={t("سمت مرکز", "Azimuth")}
                value={formatDms(places.center.azDeg, 1)}
                detail={t("از شمال به سوی خاور", "From north toward east")}
              />
            </div>
            <p className="text-sm leading-7 text-[var(--muted)]" dir="ltr">
              ± {formatSigma(solution.sigmaCenterArcsec)} {t("روی مرکز", "on the center")}
              {" · "}
              {t("مقیاس صفحه", "plate scale")} {solution.plateScaleArcsec.toFixed(2)}″/px
              {" · "}
              RMS {solution.rmsArcsec.toFixed(1)}″
              {" · "}
              {solution.inliers}/{solution.detections} {t("ستارهٔ منطبق", "matched")}
              {" · "}
              {t("میدان", "field")} {solution.fovXDeg.toFixed(2)}° × {solution.fovYDeg.toFixed(2)}°
              {" · "}
              {t("چرخش", "roll")} {solution.rollDeg.toFixed(2)}°
              {solution.mirrored ? ` · ${t("آینه", "mirrored")}` : ""}
            </p>
            <p className="max-w-3xl text-xs leading-6 text-[var(--muted)]">
              {t(
                "دقت یک ستاره از مقیاس صفحه بهتر نمی‌شود: هر پیکسل همان ثانیه‌های قوسی بالاست. مرکز، میانگین ستاره‌های منطبق است و معمولاً از یک ستاره دقیق‌تر است. نزدیک افق، هوای واقعی شکست را بیش از خطای حل جابه‌جا می‌کند.",
                "One star cannot be placed more finely than the plate scale: one pixel is the arcsecond figure above. The center is an average of the matched stars and is usually tighter than any single star. Near the horizon, real air moves refraction by more than the fit error.",
              )}
            </p>
            {places.center.altDeg < 20 ? (
              <p className="text-sm text-[var(--gold-soft)]">
                {t(
                  "مرکز زیر ۲۰ درجه است. شکست به دما و فشار وابسته‌تر از خطای هندسی حل است.",
                  "The center is below 20°. Refraction depends on temperature and pressure more than on the geometric fit.",
                )}
              </p>
            ) : null}
            {solution.constellations.length ? (
              <p className="text-sm text-[var(--parchment)]">
                {t("صورت‌های شناسایی‌شده: ", "Constellations in the frame: ")}
                {solution.constellations.map((c) => `${c.en} (${c.code})`).join(" · ")}
              </p>
            ) : null}

            <div className="overflow-auto rounded-xl border border-[var(--border)]">
              <table className="min-w-[860px] w-full text-left text-xs">
                <thead className="bg-[var(--panel)] text-[var(--muted)]">
                  <tr>
                    {[
                      t("ستاره", "Star"),
                      "HIP",
                      t("صورت", "Con"),
                      t("قدر", "Mag"),
                      t("بعد ICRS", "RA ICRS"),
                      t("میل ICRS", "Dec ICRS"),
                      t("ارتفاع", "Alt"),
                      t("سمت", "Az"),
                      t("باقیمانده", "Residual"),
                    ].map((head) => (
                      <th key={head} className="px-2 py-2 font-medium">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ordered.map(({ star, index }) => {
                    const place: ReducedPlace = places.stars[index];
                    const active = selected === index;
                    return (
                      <tr
                        key={`${star.x.toFixed(1)}-${star.y.toFixed(1)}-${index}`}
                        className={active ? "bg-[var(--gold)]/15" : "odd:bg-white/[0.02]"}
                        onClick={() => setSelected(index)}
                      >
                        <td className="px-2 py-1.5">{star.name ?? (star.matched ? "—" : t("بدون نام", "unnamed"))}</td>
                        <td className="px-2 py-1.5" dir="ltr">{star.hip ?? "—"}</td>
                        <td className="px-2 py-1.5">{star.con ?? "—"}</td>
                        <td className="px-2 py-1.5" dir="ltr">{star.mag?.toFixed(2) ?? "—"}</td>
                        <td className="px-2 py-1.5" dir="ltr">{formatRa(star.raDeg)}</td>
                        <td className="px-2 py-1.5" dir="ltr">{formatDms(star.decDeg, 1)}</td>
                        <td className="px-2 py-1.5" dir="ltr">{formatDms(place.altDeg, 1)}</td>
                        <td className="px-2 py-1.5" dir="ltr">{formatDms(place.azDeg, 1)}</td>
                        <td className="px-2 py-1.5" dir="ltr">
                          {star.residualArcsec != null
                            ? formatSigma(star.residualArcsec)
                            : `±${formatSigma(solution.plateScaleArcsec)}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[var(--muted)]">
              {t(
                "ستاره‌های بدون نام هنوز مختصات صفحه را دارند. باقیماندهٔ آن‌ها با مقیاس صفحه نشان داده می‌شود، چون به ستارهٔ فهرستی گره نخورده‌اند. فهرست تا قدر ۶٫۵ است.",
                "Unnamed detections still have plate coordinates. Their uncertainty is the plate scale, because they are not tied to a catalog star. The catalog goes to magnitude 6.5.",
              )}
            </p>
          </section>
        ) : null}
      </div>
    </LocalizedDigits>
  );
}

function CoordCard({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-3">
      <p className="text-xs text-[var(--muted)]">{title}</p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-xl text-[var(--gold-soft)]" dir="ltr">
        {value}
      </p>
      <p className="mt-1 text-xs text-[var(--muted)]" dir="ltr">
        {detail}
      </p>
    </div>
  );
}
