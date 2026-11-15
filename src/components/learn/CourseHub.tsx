"use client";
import { AuthGate } from "@/components/auth/AuthProvider";
import { selectSourceText } from "@/lib/language";
import { LocalizedDigits } from "@/components/digits/DigitScript";
import { useLanguage } from "@/components/language/Language";
import Link from "next/link";
import { MathBlock } from "@/components/ui/MathBlock";
import { useMemo, useState } from "react";
import {
  COURSE_TABS,
  LEARNING_PATH,
  focusChapters,
  focusExamples,
  focusLessons,
  focusProblems,
  focusProofs,
  type CourseTab,
} from "@/lib/content/curriculum";
import { SMART_BOOK } from "@/lib/content/smart";
import { ProblemList } from "@/components/problems/ProblemList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toPersianDigits } from "@/lib/utils";
import dynamic from "next/dynamic";
const SphereLab = dynamic(
  () => import("@/components/sphere/SphereLab").then((m) => m.SphereLab),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-[var(--border)] text-[var(--muted)]">
        بارگذاری کرهٔ تعاملی…
      </div>
    ),
  },
);
export function CourseHub({ initialTab = "path" }: { initialTab?: CourseTab }) {
  const { fa, t, language } = useLanguage();
  const [tab, setTab] = useState<CourseTab>(initialTab);
  const chapters = focusChapters();
  const lessons = focusLessons();
  const examples = focusExamples();
  const problems = focusProblems();
  const proofs = focusProofs();
  const lessonCountByCh = useMemo(() => {
    const m = new Map<string, number>();
    for (const l of lessons) m.set(l.chapterId, (m.get(l.chapterId) ?? 0) + 1);
    return m;
  }, [lessons]);
  return (
    <LocalizedDigits>
      {
        <div className="space-y-6">
          <header className="space-y-3">
            <p className="text-sm text-[var(--teal)] text-start">
              {SMART_BOOK.author} ·{" "}
              {t("فصل‌های ۱ تا ۳ · ص. ۱–۷۳", "Chapters I–III · pp. 1–73")}
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
              {t(
                "درس‌نامهٔ کروی · فصل‌های ۱ تا ۳",
                "Spherical astronomy · Chapters I–III",
              )}
            </h1>
            <p className="max-w-3xl text-sm leading-8 text-[var(--muted)]">
              {t(
                "مسیر گام‌به‌گام مثلثات کروی، کرهٔ سماوی و شکست جوّی؛ درس‌ها، مثال‌های حل‌شده، مسائل شکل‌دار، اثبات‌ها و کرهٔ تعاملی در یک مجموعه.",
                "A guided path through spherical trigonometry, the celestial sphere, and atmospheric refraction, with lessons, worked examples, illustrated problems, connected proofs, and an interactive sphere.",
              )}
            </p>
          </header>

          <div
            role="tablist"
            aria-label="بخش‌های درس‌نامه"
            className="flex flex-wrap gap-2 rounded-xl border border-[var(--border)] bg-[var(--panel)]/60 p-2"
          >
            {COURSE_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  tab === t.id
                    ? "bg-[var(--gold)]/20 text-[var(--gold-soft)] border border-[var(--gold)]/45"
                    : "text-[var(--muted)] hover:text-[var(--parchment)] border border-transparent"
                }`}
              >
                {fa ? t.labelFa : t.labelEn}
              </button>
            ))}
          </div>

          {tab === "path" && (
            <div className="space-y-4">
              {LEARNING_PATH.map((block, i) => {
                const ch = chapters.find((c) => c.id === block.chapterId);
                return (
                  <LocalizedDigits key={block.chapterId}>
                    {
                      <Card key={block.chapterId}>
                        <CardHeader>
                          <p className="text-[11px] text-[var(--teal)] text-start">
                            {t("مرحله", "Stage")} {i + 1} ·{" "}
                            {t("فصل", "Chapter")} {ch?.roman} · {t("ص.", "pp.")}{" "}
                            {ch?.pages}
                          </p>
                          <CardTitle className="text-xl">
                            {fa ? ch?.titleFa : ch?.titleEn}{" "}
                            <span className="text-sm font-normal text-[var(--muted)]">
                              ({toPersianDigits(block.lessonIds.length)}{" "}
                              {t("درس", "lessons")})
                            </span>
                          </CardTitle>
                          <CardDescription>
                            {fa ? block.goalFa : block.goalEn}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ol className="space-y-2">
                            {block.lessonIds.map((id, j) => {
                              const les = lessons.find((l) => l.id === id);
                              if (!les) return null;
                              return (
                                <LocalizedDigits key={id}>
                                  {
                                    <li
                                      key={id}
                                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--border)] px-3 py-2"
                                    >
                                      <div>
                                        <p className="text-sm text-[var(--parchment)]">
                                          {toPersianDigits(j + 1)}.{" "}
                                          {fa ? les.titleFa : les.titleEn}
                                        </p>
                                        <p className="text-[11px] text-[var(--muted)] text-start">
                                          {les.smart.sections}
                                        </p>
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        <Button asChild size="sm">
                                          <Link href={`/learn/${les.id}`}>
                                            {t("درس", "Lesson")}
                                          </Link>
                                        </Button>
                                        <Button
                                          asChild
                                          size="sm"
                                          variant="outline"
                                        >
                                          <Link
                                            href={`/lab?preset=${les.spherePreset}`}
                                          >
                                            {t("۳بعدی", "3D")}
                                          </Link>
                                        </Button>
                                        {les.proofId && (
                                          <Button
                                            asChild
                                            size="sm"
                                            variant="secondary"
                                          >
                                            <Link
                                              href={`/proofs?kind=${les.proofId}`}
                                            >
                                              {t("اثبات", "Proof")}
                                            </Link>
                                          </Button>
                                        )}
                                      </div>
                                    </li>
                                  }
                                </LocalizedDigits>
                              );
                            })}
                          </ol>
                        </CardContent>
                      </Card>
                    }
                  </LocalizedDigits>
                );
              })}
            </div>
          )}

          {tab === "lessons" && (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                {chapters.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/40 px-4 py-3"
                  >
                    <p className="text-[11px] text-[var(--teal)] text-start">
                      {t("فصل", "Ch.")} {c.roman} · {c.pages}
                    </p>
                    <p className="mt-1 text-[var(--gold-soft)]">
                      {fa ? c.titleFa : c.titleEn}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {toPersianDigits(lessonCountByCh.get(c.id) ?? 0)}{" "}
                      {t("درس", "lessons")}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {lessons.map((l) => (
                  <Link
                    key={l.id}
                    href={`/learn/${l.id}`}
                    className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/50 p-4 transition-colors hover:border-[var(--gold)]/45"
                  >
                    <p className="text-[11px] text-[var(--teal)] text-start">
                      {t("اسمارت", "Smart")} {l.smart.chapter} ·{" "}
                      {l.smart.sections} · {t("ص.", "pp.")} {l.smart.pages}
                    </p>
                    <p className="mt-1 font-[family-name:var(--font-display)] text-lg text-[var(--gold-soft)]">
                      {fa ? l.titleFa : l.titleEn}
                    </p>

                    <p className="mt-2 line-clamp-2 text-sm leading-7 text-[var(--parchment)]/85">
                      {fa ? l.summaryFa : l.summaryEn}
                    </p>
                    <p className="mt-2 text-[11px] text-[var(--gold-soft)]">
                      {fa
                        ? l.level
                        : ({
                            مقدماتی: "Introductory",
                            متوسط: "Intermediate",
                            المپیاد: "Olympiad",
                          }[l.level] ?? "Study")}{" "}
                      · ≈ {toPersianDigits(l.minutes)} {t("دقیقه", "min")}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {tab === "examples" && (
            <div className="space-y-3">
              {examples.map((ex) => (
                <Card key={ex.example.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {fa ? ex.example.titleFa : ex.example.titleEn}
                    </CardTitle>
                    <CardDescription className="text-start">
                      {selectSourceText(ex.example.source, language)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm leading-8">
                    <p>
                      <span className="text-[var(--gold-soft)]">
                        {t("درس: ", "Lesson: ")}
                      </span>
                      {fa ? ex.lessonTitleFa : ex.lessonTitleEn}
                    </p>
                    <p>
                      <span className="text-[var(--gold-soft)]">
                        {t("داده: ", "Given: ")}
                      </span>
                      {fa ? ex.example.givenFa : ex.example.givenEn}
                    </p>
                    <p>
                      <span className="text-[var(--gold-soft)]">
                        {t("خواسته: ", "Find: ")}
                      </span>
                      {fa ? ex.example.findFa : ex.example.findEn}
                    </p>
                    <ol className="list-decimal space-y-1 pr-5">
                      {ex.example.steps.map((s) => (
                        <li key={s.en}>
                          {fa ? s.fa : s.en}
                          {s.formula && <MathBlock>{s.formula}</MathBlock>}
                        </li>
                      ))}
                    </ol>
                    <p className="rounded-md border border-[var(--gold)]/30 px-3 py-2">
                      {fa ? ex.example.resultFa : ex.example.resultEn}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Button asChild size="sm">
                        <Link href={`/learn/${ex.lessonId}`}>
                          {t("متن کامل درس", "Full lesson")}
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/lab?preset=${ex.spherePreset}`}>
                          {t("تجسم سه‌بعدی", "Explore in 3D")}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {tab === "problems" && (
            <div className="space-y-3">
              <p className="text-sm text-[var(--muted)]">
                {toPersianDigits(problems.length)}{" "}
                {t(
                  "مسئله از فصل‌های ۱–۳ با شکل سه‌بعدی و راه‌حل تشریحی.",
                  "problems from Chapters I–III with 3D diagrams and worked solutions.",
                )}
              </p>
              <ProblemList problems={problems} />
            </div>
          )}

          {tab === "proofs" && (
            <div className="grid gap-3 md:grid-cols-2">
              {proofs.map((p) => (
                <Link
                  key={p.kind}
                  href={`/proofs?kind=${p.kind}`}
                  className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/50 p-4 hover:border-[var(--gold)]/45"
                >
                  <p className="text-[11px] text-[var(--teal)] text-start">
                    {p.source}
                  </p>
                  <p className="mt-1 text-lg text-[var(--gold-soft)]">
                    {fa ? p.titleFa : p.titleEn}
                  </p>

                  <p className="mt-2 text-[11px] text-[var(--muted)]">
                    {toPersianDigits(p.steps.length)}{" "}
                    {t("گام اثبات", "proof steps")}
                  </p>
                </Link>
              ))}
            </div>
          )}

          {tab === "lab" && (
            <div className="space-y-3">
              <p className="text-sm leading-8 text-[var(--muted)]">
                {t(
                  "لایه‌ها را روشن یا خاموش کنید، رأس A، B یا C را انتخاب و روی سطح جای‌گذاری کنید و اضلاع و زاویه‌ها را زنده بسنجید.",
                  "Toggle layers, select vertex A, B, or C, and place it on the sphere. Measure sides and angles as you explore the constructions from Chapters I–II.",
                )}
              </p>
              <AuthGate feature="3D sphere">
                <SphereLab />
              </AuthGate>
            </div>
          )}
        </div>
      }
    </LocalizedDigits>
  );
}
