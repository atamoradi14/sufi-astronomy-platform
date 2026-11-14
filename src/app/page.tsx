"use client";
import { useLanguage } from "@/components/language/Language";
import { LocalizedDigits } from "@/components/digits/DigitScript";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LESSONS, SMART_CHAPTERS } from "@/lib/content/lessons";
import {
  Box,
  BookOpen,
  Map,
  Orbit,
  PenLine,
  ScrollText,
  Crosshair,
  Stars,
} from "lucide-react";
const FEATURES = [
  {
    href: "/course",
    title: "درس‌نامهٔ متمرکز",
    titleEn: "Course hub",
    desc: "فصل‌های ۱–۳ اسمارت در یک فهرست: مسیر، دروس، مثال‌ها، مسائل، اثبات‌ها و کره.",
    descEn:
      "Smart Chapters I–III: a learning path, lessons, examples, problems, proofs, and sphere.",
    icon: BookOpen,
  },
  {
    href: "/course?tab=lab",
    title: "کرهٔ تعاملی",
    titleEn: "Interactive sphere",
    desc: "عظیمه، صغیره، مثلث، برچسب کامل، اندازه‌گیری زنده.",
    descEn:
      "Great circles, small circles, and triangles with clear labels and live measurements.",
    icon: Box,
  },
  {
    href: "/course?tab=proofs",
    title: "اثبات‌ها",
    titleEn: "Proofs",
    desc: "صورت‌های (A)(B)(C)(D)، هاورساین، PZX و ژیرار گام‌به‌گام.",
    descEn:
      "Connected derivations of identities (A)–(D), haversine, PZX, and Girard.",
    icon: PenLine,
  },
  {
    href: "/sky",
    title: "آسمان زنده",
    titleEn: "Live sky",
    desc: "۱۵k+ ستاره تا قدر ۷، خطوط IAU، به‌علاوه اطلس صوفی.",
    descEn:
      "Over 15,000 stars to magnitude 7, constellation lines, and al-Sufi’s atlas.",
    icon: Stars,
  },
  {
    href: "/sensor",
    title: "ستاره‌سنج",
    titleEn: "Star sensor",
    desc: "عکس آسمان را بخوانید: صورت‌ها، بعد و میل، و ارتفاع و سمت تا چند ثانیه قوسی.",
    descEn:
      "Read a sky photo: constellations, RA/Dec, and altitude/azimuth to a few arcseconds.",
    icon: Crosshair,
  },
  {
    href: "/atlas",
    title: "اطلس صور الکواکب",
    titleEn: "Book of Fixed Stars atlas",
    desc: "۴۸ صورت با نگاره‌های واقعی نسخهٔ خطی و شرح فارسی.",
    descEn: "48 constellations with historical manuscript illustrations.",
    icon: ScrollText,
  },
  {
    href: "/course?tab=problems",
    title: "مسائل با شکل",
    titleEn: "Illustrated problems",
    desc: "راه‌حل‌های تشریحی با کرهٔ سه‌بعدی دقیق.",
    descEn: "Worked solutions with geometric 3D diagrams.",
    icon: Orbit,
  },
  {
    href: "/map",
    title: "نقشه و قبله",
    titleEn: "Map and qibla",
    desc: "GPS، ماهواره، دایره‌های هم‌فاصله.",
    descEn: "Location, satellite imagery, and distance circles.",
    icon: Map,
  },
];
export default function HomePage() {
  const { fa, t } = useLanguage();
  return (
    <LocalizedDigits>
      {
        <>
          <Hero />
          <section className="mx-auto max-w-6xl px-4 pb-16">
            <div className="manuscript-rule mb-10" />
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--gold-soft)] md:text-3xl">
              {t("ابزارها", "Explore")}
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <Link key={f.href} href={f.href}>
                  <Card className="h-full transition-colors hover:border-[var(--gold)]/50">
                    <CardHeader>
                      <f.icon className="mb-2 h-5 w-5 text-[var(--gold)]" />
                      <CardTitle className="text-lg">
                        {fa ? f.title : f.titleEn}
                      </CardTitle>
                      <CardDescription>
                        {fa ? f.desc : f.descEn}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-14 flex items-end justify-between gap-4">
              <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--gold-soft)]">
                {t("مسیر فصل‌های ۱–۳", "Chapters I–III learning path")}
              </h2>
              <Link
                href="/course"
                className="text-sm text-[var(--muted)] hover:text-[var(--gold-soft)]"
              >
                {t("ورود به درس‌نامه", "Open the course")}
              </Link>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {SMART_CHAPTERS.filter((c) =>
                ["ch1", "ch2", "ch3"].includes(c.id),
              ).map((c) => {
                const n = LESSONS.filter((l) => l.chapterId === c.id).length;
                return (
                  <LocalizedDigits key={c.id}>
                    {
                      <Link
                        key={c.id}
                        href="/course?tab=path"
                        className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/55 px-4 py-3 hover:border-[var(--gold)]/45"
                      >
                        <span className="block text-[11px] text-[var(--teal)] dir-ltr text-left">
                          {t("فصل", "Chapter")} {c.roman} · {t("ص.", "pp.")}{" "}
                          {c.pages}
                        </span>
                        <span className="mt-1 block font-[family-name:var(--font-display)] text-lg text-[var(--gold-soft)]">
                          {fa ? c.titleFa : c.titleEn}
                        </span>
                        <span className="mt-0.5 block text-xs text-[var(--muted)] dir-ltr text-left">
                          {n} {t("درس", "lessons")}
                        </span>
                      </Link>
                    }
                  </LocalizedDigits>
                );
              })}
            </div>
          </section>
        </>
      }
    </LocalizedDigits>
  );
}
