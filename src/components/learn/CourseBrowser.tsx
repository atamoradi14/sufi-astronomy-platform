"use client";

import Link from "next/link";
import { COURSES } from "@/lib/content/courses";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toPersianDigits } from "@/lib/utils";

const DEMO_HREF: Record<string, string> = {
  "sphere-circles": "/lab?preset=basics",
  "sphere-triangle": "/lab?preset=astro-tri",
  "proof-sine": "/proofs?kind=sine",
  "proof-cosine": "/proofs?kind=cosine",
  coords: "/lab?preset=ecliptic",
  time: "/charts",
};

export function CourseBrowser() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/70 p-4 text-sm leading-8 text-[var(--muted)]">
        مسیر درسی بر اساس{" "}
        <span className="text-[var(--gold-soft)]">
          W.M. Smart — Textbook on Spherical Astronomy
        </span>{" "}
        (فصل‌های I و II و VI) و سرفصل‌های{" "}
        <span className="text-[var(--gold-soft)]">المپیاد نجوم ایران</span>{" "}
        (هندسه/مثلثات کروی، دستگاه‌ها، زمان) تنظیم شده است.
      </div>

      {COURSES.map((c, i) => (
        <Card key={c.id} id={c.id} className="overflow-hidden">
          <CardHeader className="border-b border-[var(--border)] bg-[var(--ink)]/30">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] text-[var(--teal)]">
                  {toPersianDigits(i + 1)}. {c.smartRef}
                </p>
                <CardTitle className="mt-1">{c.title}</CardTitle>
                <CardDescription className="mt-1">{c.olympiadTag}</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="rounded-md border border-[var(--border)] px-2 py-1 text-[var(--gold-soft)]">
                  {c.level}
                </span>
                <span className="rounded-md border border-[var(--border)] px-2 py-1 text-[var(--muted)]">
                  ≈ {toPersianDigits(c.minutes)} دقیقه
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            <div>
              <h4 className="mb-2 text-sm text-[var(--gold-soft)]">اهداف یادگیری</h4>
              <ul className="space-y-1.5 text-sm leading-7 text-[var(--parchment)]/90">
                {c.goals.map((g) => (
                  <li key={g} className="flex gap-2">
                    <span className="text-[var(--teal)]">▸</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
            {c.theory.map((t) => (
              <div key={t.heading} className="prose-fa">
                <h4 className="text-sm font-medium text-[var(--gold-soft)]">{t.heading}</h4>
                <p className="mt-1 text-sm text-[var(--parchment)]/90">{t.body}</p>
                {t.formula && (
                  <p className="mt-2 rounded-md border border-[var(--border)] bg-[var(--ink)]/50 px-3 py-2 font-mono text-xs text-[var(--teal)] dir-ltr text-left">
                    {t.formula}
                  </p>
                )}
              </div>
            ))}
            <Button asChild variant="outline" size="sm">
              <Link href={DEMO_HREF[c.demo] ?? "/lab"}>باز کردن آزمایش تعاملی</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
