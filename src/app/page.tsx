import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { COURSES } from "@/lib/content/courses";
import { Box, BookOpen, Compass, Map, Orbit, PenLine, ScrollText, Stars } from "lucide-react";

const FEATURES = [
  {
    href: "/lab",
    title: "کرهٔ تعاملی",
    desc: "عظیمه، صغیره، مثلث، زیادی کروی، فرمول‌های زنده روی اندازه‌گیری.",
    icon: Box,
  },
  {
    href: "/proofs",
    title: "اثبات‌ها",
    desc: "صورت‌های (A)(B)(C)(D) اسمارت، مثلث قطبی، نپر، هاورساین، PZX و زمان نجومی با فرمول زنده.",
    icon: PenLine,
  },
  {
    href: "/learn",
    title: "درس‌نامه جامع",
    desc: "نه فصل Part 1 اسمارت: مثلثات، کرهٔ سماوی، شکست، زمان، پدیده‌ها و اختلاف‌منظر.",
    icon: BookOpen,
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
    href: "/problems",
    title: "مسائل با شکل",
    desc: "راه‌حل‌ها با نمودار کروی و ارجاع Smart/المپیاد.",
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
            فهرست دروس
          </h2>
          <Link href="/compass" className="text-sm text-[var(--muted)] hover:text-[var(--gold-soft)]">
            <span className="inline-flex items-center gap-1">
              <Compass className="h-3.5 w-3.5" /> قبله
            </span>
          </Link>
        </div>
        <div className="mt-5 grid gap-2 md:grid-cols-2">
          {COURSES.map((l, i) => (
            <Link
              key={l.id}
              href={`/learn/${l.id}`}
              className="flex gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel)]/55 px-4 py-3 hover:border-[var(--gold)]/45"
            >
              <span className="text-[var(--gold)] font-[family-name:var(--font-display)]">
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-[var(--parchment)]">{l.titleFa}</span>
                <span className="mt-0.5 block text-[11px] text-[var(--muted)] dir-ltr text-left">
                  {l.chapter} · {l.titleEn}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
