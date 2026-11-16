"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Observer,
  MakeTime,
  RotateVector,
  Rotation_EQJ_HOR,
  Vector,
  Refraction,
} from "astronomy-engine";
import { useLanguage } from "@/components/language/Language";
import { useDigitScript } from "@/components/digits/DigitScript";
import { formatDigits } from "@/lib/digits";
import { expandStars } from "@/lib/sky/catalog";
import type { SkyStar } from "@/lib/sky/project";
import { bvToColor } from "@/lib/sky/project";
import {
  cameraProject,
  extrapolate,
  rearCameraFrame,
  verticalFovFromShortSide,
  skyReadiness,
} from "@/lib/mobile-sensors/camera";
import { exp, mul, Quat, RAD, Vec } from "@/lib/mobile-sensors/math";
import { greatArc, sphToCart, cartToLonLat } from "@/lib/astronomy/sphereGeom";
import { Snapshot } from "@/lib/mobile-sensors/capture";
type Constellation = {
  id: string;
  name: string;
  en: string;
  lines: [number, number][][];
};
type Catalog = { stars: SkyStar[]; constellations: Constellation[] };
/** A rectilinear optical view, not the exploratory stereographic /sky projection. */
export default function CameraSky({
  snapshot,
  declination,
  northConfirmed,
  onReference,
  onStart,
}: {
  snapshot: Snapshot | null;
  declination: number;
  northConfirmed: boolean;
  onReference: () => void;
  onStart: () => void;
}) {
  const { t, fa } = useLanguage(),
    digits = useDigitScript();
  const latest = useRef(snapshot);
  latest.current = snapshot;
  const canvas = useRef<HTMLCanvasElement>(null),
    stage = useRef<HTMLDivElement>(null),
    video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null),
    cameraGeneration = useRef(0);
  const [catalog, setCatalog] = useState<Catalog | null>(null),
    [error, setError] = useState(false),
    [retry, setRetry] = useState(0),
    [renderError, setRenderError] = useState<string | null>(null);
  const [fov, setFov] = useState(50),
    [magnitude, setMagnitude] = useState(5.5),
    [lines, setLines] = useState(true),
    [names, setNames] = useState(true),
    [refract, setRefract] = useState(true);
  const [camera, setCamera] = useState(false),
    [cameraBusy, setCameraBusy] = useState(false),
    [cameraError, setCameraError] = useState(false);
  const stopCamera = useCallback(() => {
    cameraGeneration.current++;
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    if (video.current) video.current.srcObject = null;
    setCamera(false);
    setCameraBusy(false);
  }, []);
  const startCamera = async () => {
    const generation = ++cameraGeneration.current;
    setCameraBusy(true);
    setCameraError(false);
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { exact: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      if (generation !== cameraGeneration.current || document.hidden) {
        media.getTracks().forEach((track) => track.stop());
        return;
      }
      stream.current = media;
      if (video.current) {
        video.current.srcObject = media;
        await video.current.play();
      }
      setCamera(true);
    } catch {
      if (generation !== cameraGeneration.current) return;
      setCameraError(true);
      stream.current?.getTracks().forEach((track) => track.stop());
      stream.current = null;
      setCamera(false);
    } finally {
      if (generation === cameraGeneration.current) setCameraBusy(false);
    }
  };
  useEffect(() => {
    const onHidden = () => {
      if (document.hidden) stopCamera();
    };
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      document.removeEventListener("visibilitychange", onHidden);
      stopCamera();
    };
  }, [stopCamera]);
  useEffect(() => {
    if (!snapshot?.running) stopCamera();
  }, [snapshot?.running, stopCamera]);
  useEffect(() => {
    const abort = new AbortController();
    setError(false);
    Promise.all(
      ["/data/stars-mag7.json", "/data/constellations-iau.json"].map((url) =>
        fetch(url, { signal: abort.signal }).then((r) => {
          if (!r.ok) throw Error();
          return r.json();
        }),
      ),
    )
      .then(([stars, cons]) =>
        setCatalog({
          stars: expandStars(stars).stars,
          constellations: cons.constellations,
        }),
      )
      .catch((e) => {
        if (e.name !== "AbortError") setError(true);
      });
    return () => abort.abort();
  }, [retry]);
  useEffect(() => {
    if (!canvas.current || !stage.current) return;
    const c = canvas.current,
      ctx = c.getContext("2d");
    if (!ctx) return;
    const fontFamily = getComputedStyle(c).fontFamily;
    let size = { w: 0, h: 0 },
      raf = 0,
      lastFrame = 0,
      cacheKey = "";
    let stars: { v: Vec; star: SkyStar }[] = [],
      segments: Vec[][] = [];
    const resize = new ResizeObserver(([entry]) => {
      size = { w: entry.contentRect.width, h: entry.contentRect.height };
      const dpr = Math.min(devicePixelRatio || 1, 2);
      c.width = Math.round(size.w * dpr);
      c.height = Math.round(size.h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    resize.observe(stage.current);
    const draw = (timestamp: number) => {
      raf = requestAnimationFrame(draw);
      if (document.hidden || timestamp - lastFrame < 32) return;
      lastFrame = timestamp;
      const { w, h } = size;
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      if (!camera) {
        ctx.fillStyle = "#081522";
        ctx.fillRect(0, 0, w, h);
      }
      const s = latest.current,
        gps = s?.gps;
      const valid = skyReadiness(s, northConfirmed) === null;
      if (!valid || !catalog || renderError || !s?.q || !gps) return;
      try {
        // Date-dependent J2000 -> local horizon rotation, including precession/nutation.
        const key = `${Math.floor(Date.now() / 1000)}:${gps.lat}:${gps.lon}:${magnitude}:${refract}`;
        if (key !== cacheKey) {
          cacheKey = key;
          const date = new Date(),
            time = MakeTime(date),
            rotation = Rotation_EQJ_HOR(
              time,
              new Observer(gps.lat, gps.lon, 0),
            );
          const toENU = (ra: number, dec: number): Vec => {
            const a = ra * 15 * RAD,
              d = dec * RAD,
              cd = Math.cos(d),
              v = RotateVector(
                rotation,
                new Vector(
                  cd * Math.cos(a),
                  cd * Math.sin(a),
                  Math.sin(d),
                  time,
                ),
              );
            let result: Vec = [-v.y, v.x, v.z];
            if (refract) {
              const alt = Math.asin(Math.max(-1, Math.min(1, result[2]))) / RAD;
              if (alt > -1 && alt < 90) {
                const apparent = (alt + Refraction("normal", alt)) * RAD,
                  az = Math.atan2(result[0], result[1]);
                result = [
                  Math.cos(apparent) * Math.sin(az),
                  Math.cos(apparent) * Math.cos(az),
                  Math.sin(apparent),
                ];
              }
            }
            return result;
          };
          stars = catalog.stars
            .filter((star) => star.mag <= magnitude)
            .map((star) => ({ star, v: toENU(star.ra, star.dec) }));
          segments = catalog.constellations.flatMap((con) =>
            con.lines.flatMap((line) =>
              line.slice(1).map((point, i) => {
                const a = line[i],
                  b = point;
                return greatArc(
                  sphToCart(a[0] * 15, a[1]),
                  sphToCart(b[0] * 15, b[1]),
                  12,
                ).map((v) => {
                  const p = cartToLonLat(v);
                  return toENU(p.lon / 15, p.lat);
                });
              }),
            ),
          );
        }
        const extrapolated = extrapolate(
          s.q!,
          s.rate,
          (performance.now() - s.poseAt) / 1000,
        );
        const corrected: Quat = mul(
            exp([0, 0, -declination * RAD]),
            extrapolated,
          ),
          frame = rearCameraFrame(corrected, screen.orientation?.angle ?? 0);
        const project = (v: Vec) => {
          const verticalFov = verticalFovFromShortSide(fov, w / h);
          const p = cameraProject(v, frame, verticalFov, w / h);
          return { ...p, x: w / 2 + (p.x * w) / 2, y: h / 2 - (p.y * h) / 2 };
        };
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, w, h);
        ctx.clip();
        if (lines) {
          ctx.strokeStyle = camera
            ? "rgba(112,213,231,.8)"
            : "rgba(112,177,199,.55)";
          ctx.lineWidth = 1;
          for (const segment of segments) {
            ctx.beginPath();
            let pen = false;
            for (const v of segment) {
              const p = project(v);
              if (
                v[2] >= 0 &&
                p.visible &&
                Math.abs(p.x - w / 2) < w * 3 &&
                Math.abs(p.y - h / 2) < h * 3
              ) {
                if (pen) ctx.lineTo(p.x, p.y);
                else ctx.moveTo(p.x, p.y);
                pen = true;
              } else pen = false;
            }
            ctx.stroke();
          }
        }
        ctx.textAlign = "left";
        ctx.font = `11px ${fontFamily}`;
        let count = 0;
        for (const { star, v } of stars) {
          if (v[2] < 0) continue;
          const p = project(v);
          if (!p.visible || p.x < 0 || p.x > w || p.y < 0 || p.y > h) continue;
          count++;
          ctx.fillStyle = bvToColor(star.bv);
          ctx.beginPath();
          ctx.arc(
            p.x,
            p.y,
            Math.max(0.65, 2.5 - star.mag * 0.25),
            0,
            Math.PI * 2,
          );
          ctx.fill();
          if (names && star.n && star.mag < 3) {
            ctx.fillStyle = "#d9e2e9";
            ctx.fillText(star.n, p.x + 5, p.y - 4);
          }
        }
        // Geometric horizon follows all camera rotations; no flat-screen horizon assumption.
        ctx.beginPath();
        ctx.strokeStyle = "#d5b574";
        ctx.lineWidth = 1.5;
        let pen = false;
        for (let az = 0; az <= 360; az++) {
          const a = az * RAD,
            p = project([Math.sin(a), Math.cos(a), 0]);
          if (
            p.visible &&
            Math.abs(p.x - w / 2) < w * 4 &&
            Math.abs(p.y - h / 2) < h * 4
          ) {
            if (pen) ctx.lineTo(p.x, p.y);
            else ctx.moveTo(p.x, p.y);
            pen = true;
          } else pen = false;
        }
        ctx.stroke();
        ctx.strokeStyle = "#e7c888";
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 9, 0, Math.PI * 2);
        ctx.moveTo(w / 2 - 19, h / 2);
        ctx.lineTo(w / 2 - 5, h / 2);
        ctx.moveTo(w / 2 + 5, h / 2);
        ctx.lineTo(w / 2 + 19, h / 2);
        ctx.moveTo(w / 2, h / 2 - 19);
        ctx.lineTo(w / 2, h / 2 - 5);
        ctx.moveTo(w / 2, h / 2 + 5);
        ctx.lineTo(w / 2, h / 2 + 19);
        ctx.stroke();
        ctx.textAlign = "left";
        ctx.font = `12px ${fontFamily}`;
        ctx.fillStyle = "#e1cfac";
        ctx.fillText(
          formatDigits(`${fov}° · ${count} ${fa ? "ستاره" : "stars"}`, digits),
          12,
          h - 14,
        );
        ctx.restore();
      } catch (error) {
        cancelAnimationFrame(raf);
        setRenderError(
          error instanceof Error ? error.message : "Renderer unavailable",
        );
      }
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
    };
  }, [
    catalog,
    declination,
    northConfirmed,
    fov,
    magnitude,
    lines,
    names,
    refract,
    camera,
    t,
    fa,
    digits,
    renderError,
  ]);
  const readiness = skyReadiness(snapshot, northConfirmed);
  const readinessMessage =
    readiness === "stopped"
      ? t(
          "برای نمایش آسمان، دریافت حسگر و موقعیت را شروع کنید.",
          "Start sensors and location to show the sky.",
        )
      : readiness === "orientation"
        ? t(
            "منتظر جهت قطب‌نمای گوشی؛ اجازهٔ حسگرها را بدهید و گوشی را آرام حرکت دهید.",
            "Waiting for phone compass orientation; allow sensors and move the phone gently.",
          )
        : readiness === "gps-denied"
          ? t(
              "دسترسی موقعیت رد شده است؛ مجوز موقعیت را برای این سایت بدهید.",
              "Location permission was denied; allow location for this site.",
            )
          : readiness === "gps"
            ? t(
                "منتظر موقعیت تازهٔ GPS؛ دریافت موقعیت ممکن است چند لحظه طول بکشد.",
                "Waiting for a fresh GPS fix; location can take a few moments.",
              )
            : readiness === "north"
              ? t(
                  "تصحیح خودکار شمال در دسترس نیست؛ تاریخ دستگاه را بررسی کنید.",
                  "Automatic north correction is unavailable; check the device date.",
                )
              : null;
  return (
    <section className="sensor-panel space-y-4">
      <h2>{t("آسمان زنده از پشت گوشی", "Live rear-camera sky")}</h2>
      <p className="sensor-note">
        {t(
          "مرکز میدان دید دقیقاً در راستای −Z گوشی است؛ راست و بالای تصویر از محورهای فیزیکی و چرخش نمایشگر می‌آیند. با حرکت یا چرخاندن گوشی، ستاره‌ها و صور فلکی در همین تب به‌روز می‌شوند؛ تغییر تب دریافت حسگر را قطع نمی‌کند.",
          "The field centre follows the phone’s −Z axis; image right/up follow physical axes and display rotation. Stars and constellations follow phone motion in this tab; changing internal tabs keeps capture active.",
        )}
      </p>
      <div
        ref={stage}
        className="relative h-[min(65vh,620px)] min-h-80 overflow-hidden rounded-xl border border-[var(--border)] bg-[#081522]"
        style={{ touchAction: "pan-y" }}
      >
        <video
          ref={video}
          playsInline
          muted
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: "none", display: camera ? "block" : "none" }}
        />
        <canvas
          ref={canvas}
          className="absolute inset-0 w-full h-full"
          role="img"
          aria-label={t(
            "نقشهٔ آسمان هم‌راستا با دوربین عقب",
            "Rear-camera-aligned sky chart",
          )}
        />
        {(readinessMessage || !catalog || renderError) && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center bg-[#081522]/95 text-[#d5e1e9] text-sm leading-7"
            role="status"
          >
            <p>
              {renderError
                ? t(
                    "نمای آسمان موقتاً متوقف شد.",
                    "The sky drawing was interrupted.",
                  )
                : error
                  ? t(
                      "دریافت نقشهٔ ستاره‌ها ناموفق بود.",
                      "Star catalog loading failed.",
                    )
                  : (readinessMessage ??
                    t(
                      "در حال دریافت کاتالوگ ستاره‌ها…",
                      "Loading the star catalog…",
                    ))}
            </p>
            {(readiness === "stopped" || readiness === "gps-denied") && (
              <button className="sensor-primary" onClick={onStart}>
                {t("شروع و درخواست مجوز", "Start & request permission")}
              </button>
            )}
            {readiness === "north" && (
              <button className="sensor-button" onClick={onReference}>
                {t("تنظیم پیشرفتهٔ شمال", "Advanced north settings")}
              </button>
            )}
            {(error || renderError) && (
              <button
                className="sensor-button"
                onClick={() => {
                  setRenderError(null);
                  setRetry((n) => n + 1);
                }}
              >
                {t("تلاش دوباره", "Retry")}
              </button>
            )}
            {renderError && (
              <details className="text-xs">
                <summary>{t("جزئیات خطا", "Error details")}</summary>
                <p dir="ltr">{renderError}</p>
              </details>
            )}
          </div>
        )}
      </div>
      {error && (
        <p role="alert">
          {t("دریافت کاتالوگ ناموفق بود.", "Catalog loading failed.")}{" "}
          <button className="underline" onClick={() => setRetry((n) => n + 1)}>
            {t("تلاش دوباره", "Retry")}
          </button>
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="sensor-label">
          {t(
            "میدان دید ضلع کوتاه تصویر؛ تنظیم با لنز واقعی",
            "Short-side FOV; calibrate against the actual lens",
          )}
          <input
            type="range"
            min="20"
            max="110"
            step="1"
            value={fov}
            onChange={(e) => setFov(Number(e.target.value))}
          />
          <span>{formatDigits(fov, digits)}°</span>
        </label>
        <label className="sensor-label">
          {t("حد قدر ستاره‌ها", "Limiting magnitude")}
          <input
            type="range"
            min="2"
            max="7"
            step="0.5"
            value={magnitude}
            onChange={(e) => setMagnitude(Number(e.target.value))}
          />
          <span>{formatDigits(magnitude, digits)}</span>
        </label>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        {(
          [
            [lines, setLines, t("خطوط صور فلکی", "Constellation lines")],
            [names, setNames, t("نام ستاره‌ها", "Star names")],
            [
              refract,
              setRefract,
              t("شکست استاندارد جو", "Standard refraction"),
            ],
          ] as const
        ).map(([value, set, label]) => (
          <label key={label} className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => set(e.target.checked)}
            />
            {label}
          </label>
        ))}
      </div>
      <button
        className="sensor-button"
        disabled={!snapshot?.running || cameraBusy}
        onClick={() => (camera ? stopCamera() : void startCamera())}
      >
        {camera
          ? t("خاموش‌کردن دوربین", "Turn camera off")
          : cameraBusy
            ? t("درخواست مجوز دوربین…", "Requesting camera permission…")
            : t("نمایش دوربین عقب با مجوز", "Show rear camera with permission")}
      </button>
      {cameraError && (
        <p role="status" className="sensor-note">
          {t(
            "دوربین عقب در دسترس نیست یا مجوز داده نشد؛ نقشهٔ آسمان بدون تصویر دوربین کار می‌کند.",
            "Rear camera unavailable or permission denied; the sky chart remains usable without video.",
          )}
        </p>
      )}
      <p className="sensor-note">
        {t(
          "این تصویر آینه‌ای نیست. با تغییر جهت نمایشگر، نسبت میدان دید افقی و عمودی خودکار تغییر می‌کند. مرورگر پارامترهای دقیق لنز و هم‌راستایی حسگر با دوربین را ارائه نمی‌کند؛ میدان دید را با ستاره‌های شناخته‌شده تنظیم کنید. ستاره‌ها از کاتالوگ واقعی J2000 با تصحیح تقدیم، ترقّص و زمان/موقعیت فعلی محاسبه می‌شوند؛ دقت نهایی به قطب‌نما، میل مغناطیسی و لنز بستگی دارد. تصویر دوربین روی دستگاه می‌ماند و هنگام ترک این تب یا پنهان‌شدن صفحه متوقف می‌شود.",
          "This view is not mirrored. Horizontal/vertical FOV adapts to display aspect. Browsers do not expose exact lens intrinsics or sensor-to-camera alignment; tune FOV against known stars. Real J2000 catalog stars include precession/nutation and current time/location. Final alignment depends on compass, declination and lens calibration. Camera video stays on-device and stops when leaving this tab or hiding the page.",
        )}
      </p>
    </section>
  );
}
