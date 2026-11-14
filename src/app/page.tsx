import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LESSONS, SMART_CHAPTERS } from "@/lib/content/lessons";
import { Box, BookOpen, Map, Orbit, PenLine, ScrollText, Stars } from "lucide-react";

const FEATURES = [
  {
    href: "/course",
    title: "درس‌نامهٔ متمرکز",
    desc: "فصل‌های ۱–۳ اسمارت در یک فهرست: مسیر، دروس، مثال‌ها، مسائل، اثبات‌ها و کره.",
    icon: BookOpen,
  },
  {
    href: "/course?tab=lab",
    title: "کرهٔ تعاملی",
    desc: "عظیمه، صغیره، مثلث، برچسب کامل، اندازه‌گیری زنده.",
    icon: Box,
  },
  {
    href: "/course?tab=proofs",
    title: "اثبات‌ها",
    desc: "صورت‌های (A)(B)(C)(D)، هاورساین، PZX و ژیرار گام‌به‌گام.",
    icon: PenLine,
  },
  {
    href: "/sky",
    title: "آسمان زنده",
    desc: "۱۵k+ ستاره تا قدر ۷، خطوط IAU، به‌علاوه اطلس صوفی.",
    icon: Stars,
  },
  {
    href: "/atlas",
    title: "اطلس صور الکواکب",
    desc: "۴۸ صورت با نگاره‌های واقعی نسخهٔ خطی و شرح فارسی.",
    icon: ScrollText,
  },
  {
    href: "/course?tab=problems",
    title: "مسائل با شکل",
    desc: "راه‌حل‌های تشریحی با کرهٔ سه‌بعدی دقیق.",
    icon: Orbit,
  },
  {
    href: "/map",
    title: "نقشه و قبله",
    desc: "GPS، ماهواره، دایره‌های هم‌فاصله.",
    icon: Map,
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="manuscript-rule mb-10" />
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--gold-soft)] md:text-3xl">
          ابزارها
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href}>
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

        <div className="mt-14 flex items-end justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--gold-soft)]">
            مسیر فصل‌های ۱–۳
          </h2>
          <Link href="/course" className="text-sm text-[var(--muted)] hover:text-[var(--gold-soft)]">
            ورود به درس‌نامه
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {SMART_CHAPTERS.filter((c) => ["ch1", "ch2", "ch3"].includes(c.id)).map((c) => {
            const n = LESSONS.filter((l) => l.chapterId === c.id).length;
            return (
              <Link
                key={c.id}
                href="/course?tab=path"
                className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/55 px-4 py-3 hover:border-[var(--gold)]/45"
              >
                <span className="block text-[11px] text-[var(--teal)] dir-ltr text-left">
                  Chapter {c.roman} · pp. {c.pages}
                </span>
                <span className="mt-1 block font-[family-name:var(--font-display)] text-lg text-[var(--gold-soft)]">
                  {c.titleFa}
                </span>
                <span className="mt-0.5 block text-xs text-[var(--muted)] dir-ltr text-left">
                  {c.titleEn} · {n} lessons
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
