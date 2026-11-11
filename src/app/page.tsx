import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LESSONS } from "@/lib/content/lessons";
import { CONSTELLATIONS } from "@/lib/astronomy/constellations";
import { BookOpen, Compass, Map, Orbit, Sigma, Stars } from "lucide-react";

const FEATURES = [
  {
    href: "/learn",
    title: "ریاضیات کروی",
    desc: "دروس، فرمول‌ها و آزمایشگاه تعاملی فاصلهٔ زاویه‌ای و تبدیل مختصات.",
    icon: Sigma,
  },
  {
    href: "/compass",
    title: "قطب‌نما و قبله",
    desc: "حسگر جهت‌گیری و GPS برای سمت قبله روی دایرهٔ عظیمه.",
    icon: Compass,
  },
  {
    href: "/map",
    title: "نقشه و ماهواره",
    desc: "سرعت، موقعیت، جهت و دایره‌های هم‌فاصله روی تصویر ماهواره‌ای.",
    icon: Map,
  },
  {
    href: "/sky",
    title: "آسمان‌نما صوفی",
    desc: "صورت‌های فلکی صور الکواکب با سمت و ارتفاع زنده.",
    icon: Stars,
  },
  {
    href: "/charts",
    title: "نمودار و زمان نجومی",
    desc: "میل، بعد، سمت، ارتفاع، JD، LST و رویدادهای تقریبی.",
    icon: Orbit,
  },
  {
    href: "/problems",
    title: "مسائل و راه‌حل",
    desc: "تمرین‌های طبقه‌بندی‌شده با راهنما و پاسخ تشریحی.",
    icon: BookOpen,
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="manuscript-rule mb-10" />
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--gold-soft)] md:text-3xl animate-in-fade">
          ویژگی‌ها
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)] animate-in-fade animate-delay-1">
          وب‌اپلیکیشن سازگار با اندروید که از GPS، قطب‌نما و نقشه بهره می‌برد — آماده برای استقرار میکروسرویس روی Kubernetes.
        </p>
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

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>مسیر یادگیری</CardTitle>
              <CardDescription>از کره تا رصد — به ترتیب پیشنهادی</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {LESSONS.map((l, i) => (
                <Link
                  key={l.id}
                  href={`/learn#${l.id}`}
                  className="flex gap-3 rounded-lg border border-[var(--border)] px-3 py-3 hover:border-[var(--gold)]/40"
                >
                  <span className="font-[family-name:var(--font-display)] text-[var(--gold)]">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-[var(--parchment)]">{l.title}</span>
                    <span className="block text-xs text-[var(--muted)] leading-6">{l.summary}</span>
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>صورت‌های برگزیده</CardTitle>
              <CardDescription>از سنت نگاشتهٔ عبدالرحمن صوفی</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {CONSTELLATIONS.map((c) => (
                <Link
                  key={c.id}
                  href="/sky"
                  className="rounded-lg border border-[var(--border)] px-3 py-3 text-sm hover:border-[var(--gold)]/40"
                >
                  <span className="block text-[var(--gold-soft)]">{c.nameFa}</span>
                  <span className="block text-[11px] text-[var(--muted)]">{c.nameAr}</span>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
