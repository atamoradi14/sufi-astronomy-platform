"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { COURSES } from "@/lib/content/courses";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toPersianDigits } from "@/lib/utils";

export function CourseBrowser() {
  const [lang, setLang] = useState<"fa" | "both">("both");
  const [level, setLevel] = useState<string>("all");

  const list = useMemo(() => {
    if (level === "all") return COURSES;
    return COURSES.filter((c) => c.level === level);
  }, [level]);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[var(--gold)]/25 bg-[var(--panel)]/80 p-4 text-sm leading-8">
        <p className="text-[var(--parchment)]">
          مرجع اصلی فرمول‌ها:{" "}
          <span className="text-[var(--gold-soft)] dir-ltr">
            W.M. Smart, Textbook on Spherical Astronomy
          </span>
          . مسیر المپیاد ایران (هندسه/مثلثات کروی، دستگاه‌ها، زمان) هم‌تراز شده است. هر درس به آزمایشگاه کره یا اثبات تعاملی وصل است.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "مقدماتی", "متوسط", "المپیاد"].map((lv) => (
          <Button
            key={lv}
            size="sm"
            variant={level === lv ? "default" : "secondary"}
            onClick={() => setLevel(lv)}
          >
            {lv === "all" ? "همه سطوح" : lv}
          </Button>
        ))}
        <Button
          size="sm"
          variant="outline"
          className="mr-auto"
          onClick={() => setLang((l) => (l === "both" ? "fa" : "both"))}
        >
          {lang === "both" ? "فقط فارسی" : "فارسی + English"}
        </Button>
      </div>

      <div className="space-y-4">
        {list.map((c, i) => (
          <Card key={c.id} id={c.id} className="overflow-hidden">
            <CardHeader className="border-b border-[var(--border)] bg-[var(--ink)]/35">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] text-[var(--teal)] dir-ltr text-left">
                    {c.chapter}
                  </p>
                  <CardTitle className="mt-1">
                    {toPersianDigits(i + 1)}. {c.titleFa}
                  </CardTitle>
                  {lang === "both" && (
                    <p className="mt-1 text-sm text-[var(--muted)] dir-ltr text-left">
                      {c.titleEn}
                    </p>
                  )}
                  <CardDescription className="mt-2">{c.summaryFa}</CardDescription>
                  <p className="mt-1 text-[11px] text-[var(--muted)]">{c.olympiad}</p>
                </div>
                <div className="flex flex-col items-end gap-1 text-[11px]">
                  <span className="rounded-md border border-[var(--border)] px-2 py-1 text-[var(--gold-soft)]">
                    {c.level}
                  </span>
                  <span className="text-[var(--muted)]">
                    ≈ {toPersianDigits(c.minutes)} دقیقه
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div>
                <h4 className="mb-2 text-xs text-[var(--gold-soft)] dir-ltr text-left">
                  Key formulae (English / Smart)
                </h4>
                <ul className="space-y-1.5">
                  {c.englishFormulas.map((f) => (
                    <li
                      key={f}
                      className="rounded-md border border-[var(--border)] bg-[var(--ink)]/40 px-3 py-2 font-mono text-[11px] leading-6 text-[var(--teal)] dir-ltr text-left"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {c.sections.map((s) => (
                <div key={s.headingEn} className="space-y-2 border-t border-[var(--border)] pt-4">
                  <h4 className="text-sm font-medium text-[var(--gold-soft)]">{s.headingFa}</h4>
                  {lang === "both" && (
                    <p className="text-xs text-[var(--muted)] dir-ltr text-left">{s.headingEn}</p>
                  )}
                  <p className="text-sm leading-8 text-[var(--parchment)]/90">{s.bodyFa}</p>
                  {lang === "both" && (
                    <p className="text-sm leading-7 text-[var(--muted)] dir-ltr text-left">
                      {s.bodyEn}
                    </p>
                  )}
                  {s.formula && (
                    <p className="rounded-md border border-[var(--gold)]/30 bg-[var(--gold)]/5 px-3 py-2 font-mono text-xs text-[var(--gold-soft)] dir-ltr text-left">
                      {s.formula}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link href={`/lab?preset=${c.spherePreset}`}>تجسم روی کره</Link>
                </Button>
                {c.proofId && (
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/proofs?kind=${c.proofId}`}>اثبات تعاملی</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
