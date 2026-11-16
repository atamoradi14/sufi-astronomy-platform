"use client";
import { LocalizedDigits } from "@/components/digits/DigitScript";
import { useLanguage } from "@/components/language/Language";
import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
function SkyLoading() {
  const { t } = useLanguage();
  return (
    <p role="status" className="p-8 text-[var(--muted)]">
      {t("بارگذاری آسمان‌نما…", "Loading the sky chart…")}
    </p>
  );
}
const LiveSky = dynamic(
  () => import("@/components/sky/LiveSky").then((m) => m.LiveSky),
  { ssr: false, loading: SkyLoading },
);
const ConstellationViewer = dynamic(
  () =>
    import("@/components/sky/ConstellationViewer").then(
      (m) => m.ConstellationViewer,
    ),
  { ssr: false, loading: SkyLoading },
);
export default function SkyPage() {
  const [tab, setTab] = useState<"live" | "sufi">("live");
  const { t } = useLanguage();
  return (
    <LocalizedDigits>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sky-page">
        <header className="space-y-3">
          <p className="study-kicker">
            {t("رصدخانهٔ تعاملی", "Interactive observatory")}
          </p>
          <h1 className="text-3xl text-[var(--parchment)] md:text-4xl">
            {t("آسمان‌نما", "The night sky")}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-[var(--muted)]">
            {t(
              "مکان و زمان را انتخاب کنید و در آسمان گردش کنید؛ یا نمای تمام‌آسمان را برای دیدن گنبد آسمان باز کنید. ستاره‌ها تا قدر ۷ و خطوط صورت‌های فلکی در دسترس‌اند.",
              "Choose a place and time, then explore the sky or open the all-sky dome. Browse stars down to magnitude 7 and constellation outlines.",
            )}
          </p>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label={t("بخش آسمان‌نما", "Sky section")}
          >
            <Button
              size="sm"
              aria-pressed={tab === "live"}
              variant={tab === "live" ? "default" : "secondary"}
              onClick={() => setTab("live")}
            >
              {t("آسمان زنده", "Live sky")}
            </Button>
            <Button
              size="sm"
              aria-pressed={tab === "sufi"}
              variant={tab === "sufi" ? "default" : "secondary"}
              onClick={() => setTab("sufi")}
            >
              {t("صور صوفی", "Sufi constellations")}
            </Button>
            <Link
              href="/atlas"
              className="inline-flex items-center px-3 text-sm text-[var(--teal)] underline underline-offset-4"
            >
              {t("اطلس کامل صوفی", "Full Sufi atlas")}
            </Link>
          </div>
        </header>
        {tab === "live" ? <LiveSky /> : <ConstellationViewer />}
      </div>
    </LocalizedDigits>
  );
}
