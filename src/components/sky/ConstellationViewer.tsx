"use client";
import { LocalizedDigits } from "@/components/digits/DigitScript";
import { useEffect, useMemo, useState, useId } from "react";
import Image from "next/image";
import { useLanguage } from "@/components/language/Language";
import { createSkyProjector, azAltToVec } from "@/lib/sky/project";
import { greatArc, sphToCart, cartToLonLat } from "@/lib/astronomy/sphereGeom";
import Link from "next/link";
import { CONSTELLATIONS } from "@/lib/astronomy/constellations";
import { SUWAR_CONSTELLATIONS } from "@/lib/content/suwarCatalog";
import { equatorialToHorizontal } from "@/lib/astronomy/sphere";
import { computeAstroClock } from "@/lib/astronomy/time";
import { useGeolocation } from "@/hooks/useGeolocation";
import { formatDeg, formatHours } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export function ConstellationViewer() {
  const { fa, t } = useLanguage();
  const [id, setId] = useState(CONSTELLATIONS[0].id);
  const [now, setNow] = useState<Date | null>(null);
  const [plateView, setPlateView] = useState<"globe" | "sky">("globe");
  const geo = useGeolocation(false);
  const cons = CONSTELLATIONS.find((c) => c.id === id)!;
  const suwar = SUWAR_CONSTELLATIONS.find((c) => c.id === id);
  const lon = geo.reading?.lon ?? 51.389;
  const lat = geo.reading?.lat ?? 35.6892;
  const plate = plateView === "globe" ? suwar?.globeImage : suwar?.skyImage;
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  const clock = useMemo(
    () => (now ? computeAstroClock(now, lon) : null),
    [now, lon],
  );
  const projected = useMemo(() => {
    if (!clock) return cons.stars.map((s) => ({ ...s, az: 0, alt: 0, ha: 0 }));
    return cons.stars.map((s) => {
      const h = equatorialToHorizontal(s.ra, s.dec, lat, clock.lst);
      return { ...s, ...h };
    });
  }, [cons, lat, clock]);
  return (
    <LocalizedDigits>
      {
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("صورت‌های فلکی صوفی", "Sufi constellations")}
              </CardTitle>
              <CardDescription>
                {t(
                  "گزیده‌ای از نگاشت‌های صور الکواکب با مختصات مدرن و محاسبهٔ سمت و ارتفاع برای مکان شما.",
                  "Explore selected constellations from the Book of Fixed Stars, with modern coordinates and altitude/azimuth for your location.",
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {CONSTELLATIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setId(c.id)}
                    className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                      c.id === id
                        ? "border-[var(--gold)] bg-[var(--gold)]/15 text-[var(--gold-soft)]"
                        : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--parchment)]"
                    }`}
                  >
                    {fa ? c.nameFa : c.ptolemy}
                  </button>
                ))}
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--ink)]/40 p-4 prose-fa">
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--gold-soft)]">
                  {fa ? cons.nameFa : cons.ptolemy}
                  <span className="mr-2 text-sm text-[var(--muted)]">
                    {fa ? `(${cons.nameAr})` : ""}
                  </span>
                </h3>
                <p className="mt-2 text-sm text-[var(--parchment)]/90">
                  {fa
                    ? (suwar?.excerptFa ?? cons.description)
                    : "Compare historical manuscript views with the modern coordinates of selected bright stars. The diagram is a stereographic guide, not the original historical drawing."}
                </p>
                <p className="mt-3 text-xs text-[var(--muted)]">
                  {t("زمان نجومی ناظر", "Observer LST")}:{" "}
                  {clock ? formatHours(clock.lst, 3) : "…"} ·{" "}
                  {t("عرض", "Latitude")}: {formatDeg(lat, 2)}
                </p>
                <Link
                  href="/atlas"
                  className="mt-3 inline-block text-xs text-[var(--teal)] hover:text-[var(--gold-soft)]"
                >
                  {t(
                    "مشاهدهٔ اطلس کامل ۴۸ صورت ←",
                    "Explore all 48 constellations →",
                  )}
                </Link>
              </div>
              <ul className="space-y-2 text-sm">
                {projected.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[var(--border)] px-3 py-2"
                  >
                    <span className="text-[var(--gold-soft)]">
                      {fa
                        ? s.nameFa
                        : s.id.charAt(0).toUpperCase() +
                          s.id.slice(1).replaceAll("-", " ")}
                    </span>
                    <span className="text-[var(--muted)] text-xs">
                      RA {formatHours(s.ra, 2)} · Dec {formatDeg(s.dec, 1)} ·{" "}
                      {t("سمت", "Az")} {formatDeg(s.az, 0)} ·{" "}
                      {t("ارتفاع", "Alt")} {formatDeg(s.alt, 0)} ·{" "}
                      {t("قدر", "Mag")} {s.mag.toFixed(1)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {t("نگارهٔ نسخهٔ خطی", "Manuscript illustration")}
              </CardTitle>
              <CardDescription>
                {t(
                  "نگارهٔ نسخهٔ تاریخی صور الکواکب",
                  "Historical manuscript illustration",
                )}{" "}
                ·{" "}
                {plateView === "globe"
                  ? t("بر کره", "Globe view")
                  : t("در آسمان", "Sky view")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {suwar && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={plateView === "globe" ? "default" : "outline"}
                    onClick={() => setPlateView("globe")}
                  >
                    {t("بر کره", "Globe view")}
                  </Button>
                  <Button
                    size="sm"
                    variant={plateView === "sky" ? "default" : "outline"}
                    onClick={() => setPlateView("sky")}
                    disabled={!suwar.skyImage}
                  >
                    {t("در آسمان", "Sky view")}
                  </Button>
                </div>
              )}
              {plate ? (
                <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--ink-deep)]">
                  <Image
                    src={plate}
                    alt={fa ? cons.nameFa : cons.ptolemy}
                    width={720}
                    height={1000}
                    className="mx-auto h-auto max-h-[28rem] w-full object-contain"
                  />
                </div>
              ) : null}
              <ConstellationCanvas consId={id} />
            </CardContent>
          </Card>
        </div>
      }
    </LocalizedDigits>
  );
}
function ConstellationCanvas({ consId }: { consId: string }) {
  const cons = CONSTELLATIONS.find((c) => c.id === consId)!;
  const { fa, t } = useLanguage();
  const glowId = useId().replaceAll(":", "");
  const vectors = cons.stars.map((s) => azAltToVec(s.ra * 15, s.dec));
  const centre = [0, 1, 2].map((i) =>
    vectors.reduce((sum, v) => sum + v[i], 0),
  );
  const centreRa = (Math.atan2(centre[0], centre[1]) * 180) / Math.PI;
  const centreDec =
    (Math.atan2(centre[2], Math.hypot(centre[0], centre[1])) * 180) / Math.PI;
  const projector = createSkyProjector({
    az: centreRa,
    alt: centreDec,
    fov: 60,
  });
  const points = cons.stars.map((s) => projector.project(s.ra * 15, s.dec));
  const xs = points.map((p) => -p.x),
    ys = points.map((p) => -p.y);
  const midX = (Math.min(...xs) + Math.max(...xs)) / 2,
    midY = (Math.min(...ys) + Math.max(...ys)) / 2;
  const scale = Math.min(
    280 / Math.max(0.01, Math.max(...xs) - Math.min(...xs)),
    230 / Math.max(0.01, Math.max(...ys) - Math.min(...ys)),
  );
  const mapStar = (star: (typeof cons.stars)[number]) => {
    const p = projector.project(star.ra * 15, star.dec);
    return { x: 200 + (-p.x - midX) * scale, y: 160 + (-p.y - midY) * scale };
  };
  const byId = Object.fromEntries(cons.stars.map((s) => [s.id, s]));
  return (
    <LocalizedDigits>
      {
        <svg
          viewBox="0 0 400 340"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--ink-deep)]"
        >
          <defs>
            <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(230,211,154,0.35)" />
              <stop offset="100%" stopColor="rgba(230,211,154,0)" />
            </radialGradient>
          </defs>
          {cons.lines.map(([a, b], i) => {
            const sa = byId[a];
            const sb = byId[b];
            if (!sa || !sb) return null;
            return (
              <LocalizedDigits key={i}>
                {
                  <polyline
                    key={i}
                    points={greatArc(
                      sphToCart(sa.ra * 15, sa.dec),
                      sphToCart(sb.ra * 15, sb.dec),
                      16,
                    )
                      .map((v) => {
                        const p = cartToLonLat(v);
                        const point = mapStar({
                          ...sa,
                          ra: p.lon / 15,
                          dec: p.lat,
                        });
                        return `${point.x},${point.y}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke="rgba(93,167,158,.85)"
                    strokeWidth="1.4"
                  />
                }
              </LocalizedDigits>
            );
          })}
          {cons.stars.map((s) => {
            const r = Math.max(2.2, 6 - s.mag);
            const { x, y } = mapStar(s);
            return (
              <LocalizedDigits key={s.id}>
                {
                  <g key={s.id}>
                    <circle cx={x} cy={y} r={r * 3} fill={`url(#${glowId})`} />
                    <circle cx={x} cy={y} r={r} fill="#e6d39a" />
                    <text
                      x={x + 8}
                      y={y + 3}
                      fill="#9aa6b8"
                      fontSize="12"
                      fontFamily="var(--font-body), sans-serif"
                    >
                      {fa
                        ? s.nameFa
                        : s.id.charAt(0).toUpperCase() +
                          s.id.slice(1).replaceAll("-", " ")}
                    </text>
                  </g>
                }
              </LocalizedDigits>
            );
          })}
          <text
            x="200"
            y="325"
            textAnchor="middle"
            fill="#9aa6b8"
            fontSize="12"
            fontFamily="var(--font-body), sans-serif"
          >
            {fa ? cons.nameFa : cons.ptolemy} —{" "}
            {t("راهنمای استریوگرافیک", "stereographic guide")}
          </text>
        </svg>
      }
    </LocalizedDigits>
  );
}
