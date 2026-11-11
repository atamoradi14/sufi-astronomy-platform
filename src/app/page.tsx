import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { COURSES } from "@/lib/content/courses";
import { Box, BookOpen, Compass, Map, Orbit, PenLine, Stars } from "lucide-react";

const FEATURES = [
  {
    href: "/lab",
    title: "کرهٔ تعاملی سه‌بعدی",
    desc: "چرخش و tilt، دایره‌های عظیمه و صغیره، مثلث کروی با اندازه‌گیری زنده.",
    icon: Box,
  },
  {
    href: "/proofs",
    title: "اثبات sin و cos کروی",
    desc: "انیمیشن گام‌به‌گام به سبک Smart و جزوه‌های المپیاد ایران.",
    icon: PenLine,
  },
  {
    href: "/learn",
    title: "درس‌نامه المپیادی",
    desc: "مسیر Smart I–II–VI + هندسه/مثلثات کروی المپیاد نجوم.",
    icon: BookOpen,
  },
  {
    href: "/sky",
    title: "آسمان‌نما صوفی",
    desc: "صورت‌های صور الکواکب با سمت و ارتفاع.",
    icon: Stars,
  },
  {
    href: "/charts",
    title: "زمان و نمودار",
    desc: "JD، LST، میل و بعد، سمت و ارتفاع.",
    icon: Orbit,
  },
  {
    href: "/map",
    title: "نقشه و قبله",
    desc: "GPS، ماهواره، دایره‌های هم‌فاصله و قطب‌نما.",
    icon: Map,
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="manuscript-rule mb-10" />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--gold-soft)] md:text-3xl">
              ابزارهای اصلی
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              تمرکز روی تجسم کروی و استدلال ریاضی — برای المپیاد و رصد.
            </p>
          </div>
          <Link
            href="/compass"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--gold-soft)]"
          >
            <Compass className="h-4 w-4" />
            قطب‌نما و قبله
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href} className="animate-in-fade">
              <Card className="h-full transition-colors hover:border-[var(--gold)]/50">
                <CardHeader>
                  <f.icon className="mb-2 h-5 w-5 text-[var(--gold)]" />
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                  <CardDescription>{f.desc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-14">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--gold-soft)]">
            مسیر دوره
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {COURSES.map((l, i) => (
              <Link
                key={l.id}
                href={`/learn#${l.id}`}
                className="group flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel)]/60 px-4 py-3 transition-colors hover:border-[var(--gold)]/45"
              >
                <span className="font-[family-name:var(--font-display)] text-lg text-[var(--gold)]">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-[var(--parchment)] group-hover:text-[var(--gold-soft)]">
                    {l.title}
                  </span>
                  <span className="mt-1 block text-[11px] leading-6 text-[var(--muted)]">
                    {l.smartRef} · {l.olympiadTag}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
