"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Box, PenLine, Stars, BookOpen } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)]">
      <div className="hero-grid absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-12 md:pt-16">
        <div className="animate-in-fade max-w-3xl">
          <p className="mb-3 text-sm text-[var(--teal)]">
            المپیاد نجوم · Smart · Stellarium-style sky
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl leading-[1.15] text-[var(--gold-soft)] md:text-6xl">
            صوفی‌آسمان
          </h1>
          <p className="mt-5 text-base leading-8 text-[var(--parchment)]/90 md:text-lg">
            کرهٔ تعاملی، اثبات‌های Smart، آسمان زنده تا قدر ۷، اطلس واقعی صور الکواکب با نگاره‌های نسخهٔ خطی، و مسائل با شکل کروی — برای المپیاد و رصد آماتوری.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/lab">
                <Box className="h-4 w-4" />
                کرهٔ تعاملی
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/sky">
                <Stars className="h-4 w-4" />
                آسمان زنده
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/proofs?kind=girard">
                <PenLine className="h-4 w-4" />
                اثبات مساحت
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/learn">
                <BookOpen className="h-4 w-4" />
                درس‌نامه
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3 animate-in-fade animate-delay-1">
          {[
            { t: "۱۷ درس", d: "Smart I–II–VI + المپیاد" },
            { t: "۱۵٬۵۴۴ ستاره", d: "قدر ≤ ۷ · J2000" },
            { t: "شکل‌محور", d: "۵۰٪+ آموزش روی کره" },
          ].map((x) => (
            <div
              key={x.t}
              className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/70 px-4 py-3"
            >
              <div className="font-[family-name:var(--font-display)] text-lg text-[var(--gold-soft)]">
                {x.t}
              </div>
              <div className="text-xs text-[var(--muted)]">{x.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
