"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  SUWAR_CONSTELLATIONS,
  SUWAR_META,
  type SuwarConstellation,
} from "@/lib/content/suwarCatalog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toPersianDigits } from "@/lib/utils";

const HEMISPHERE_LABEL: Record<SuwarConstellation["hemisphere"], string> = {
  north: "شمال",
  zodiac: "منطقة‌البروج",
  south: "جنوب",
};

type ViewKind = "globe" | "sky";

export function SuwarAtlas() {
  const [hemi, setHemi] = useState<"all" | SuwarConstellation["hemisphere"]>("all");
  const [id, setId] = useState(SUWAR_CONSTELLATIONS[0]?.id ?? "ursa-minor");
  const [view, setView] = useState<ViewKind>("globe");

  const list = useMemo(() => {
    if (hemi === "all") return SUWAR_CONSTELLATIONS;
    return SUWAR_CONSTELLATIONS.filter((c) => c.hemisphere === hemi);
  }, [hemi]);

  const selected = SUWAR_CONSTELLATIONS.find((c) => c.id === id) ?? SUWAR_CONSTELLATIONS[0];

  const plate = view === "globe" ? selected.globeImage : selected.skyImage;

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-[var(--gold-soft)]">
              {SUWAR_META.titleFa}
            </CardTitle>
            <CardDescription>
              {SUWAR_META.authorFa} · {SUWAR_META.titleEn}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-8 text-[var(--parchment)]/90">
              کتاب صور الکواکب ثابتة اثر عبدالرحمن صوفی (سدهٔ چهارم هجری) هر یک از چهل‌وهشت صورت بطلمیوسی
              را با دو نگاره نشان می‌دهد: چنان‌که بر کرهٔ سماوی دیده می‌شود، و چنان‌که در آسمان ظاهر می‌گردد؛
              همراه جدول نام‌ها، طول و عرض و اقدار. این اطلس برگ‌های واقعی نسخهٔ بارگذاری‌شده را با شرح فارسی آموزشی همراه کرده است.
            </p>
            <p className="text-xs leading-6 text-[var(--muted)]">{SUWAR_META.sourceNoteFa}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SUWAR_META.covers.map((c) => (
                <figure key={c.id} className="overflow-hidden rounded-lg border border-[var(--border)]">
                  <Image
                    src={c.src}
                    alt={c.id === "cover" ? "جلد نسخه" : "فهرست صورت‌ها"}
                    width={400}
                    height={560}
                    className="h-40 w-full object-cover object-top"
                  />
                  <figcaption className="px-2 py-1.5 text-center text-[11px] text-[var(--muted)]">
                    {c.id === "cover" ? "جلد" : "فهرست صورت‌ها"}
                  </figcaption>
                </figure>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>۴۸ صورت بطلمیوسی</CardTitle>
            <CardDescription>
              فیلتر بر اساس نیم‌کره · انتخاب صورت برای دیدن نگارهٔ کره / آسمان / جدول
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["all", "همه"],
                  ["north", "شمال"],
                  ["zodiac", "بروج"],
                  ["south", "جنوب"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setHemi(key)}
                  className={`rounded-md border px-3 py-1.5 text-sm ${
                    hemi === key
                      ? "border-[var(--gold)] bg-[var(--gold)]/15 text-[var(--gold-soft)]"
                      : "border-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="max-h-[28rem] space-y-1 overflow-y-auto rounded-lg border border-[var(--border)] p-2">
              {list.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setId(c.id);
                    setView("globe");
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-right text-sm transition-colors ${
                    selected.id === c.id
                      ? "bg-[var(--gold)]/15 text-[var(--gold-soft)]"
                      : "text-[var(--parchment)]/90 hover:bg-[var(--panel)]"
                  }`}
                >
                  <span>
                    <span className="ml-2 text-[var(--muted)]">
                      {toPersianDigits(c.rank)}.
                    </span>
                    {c.nameFa}
                    <span className="mr-2 text-[11px] text-[var(--muted)]">({c.nameAr})</span>
                  </span>
                  <span className="shrink-0 text-[10px] text-[var(--teal)]">
                    {HEMISPHERE_LABEL[c.hemisphere]}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="font-[family-name:var(--font-display)] text-xl text-[var(--gold-soft)]">
                {selected.nameFa}
              </CardTitle>
              <CardDescription>
                {selected.ptolemy} · {selected.nameAr} · {selected.titleFa}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["globe", "بر کره"],
                  ["sky", "در آسمان"],
                ] as const
              ).map(([key, label]) => (
                <Button
                  key={key}
                  size="sm"
                  variant={view === key ? "default" : "outline"}
                  onClick={() => setView(key)}
                  disabled={key === "sky" && !selected.skyImage}
                >
                  {label}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {plate ? (
              <div className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--ink-deep)]">
                <Image
                  src={plate}
                  alt={`${selected.nameFa} — ${view}`}
                  width={900}
                  height={1300}
                  className="mx-auto h-auto max-h-[70vh] w-full object-contain"
                  priority
                />
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)]">نگاره‌ای برای این نما موجود نیست.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>شرح فارسی</CardTitle>
            <CardDescription>بر اساس سنت صور الکواکب و کاربرد آموزشی</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-8">
            <p className="text-[var(--parchment)]/95">{selected.excerptFa}</p>
            <ul className="space-y-2 text-[var(--muted)]">
              <li>
                نیم‌کره:{" "}
                <span className="text-[var(--gold-soft)]">
                  {HEMISPHERE_LABEL[selected.hemisphere]}
                </span>
              </li>
              <li>
                ترتیب صوفی:{" "}
                <span className="text-[var(--gold-soft)]">
                  {toPersianDigits(selected.rank)} از ۴۸
                </span>
              </li>
              <li>
                نگاره‌ها: کره
                {selected.globeImage ? " ✓" : " —"} · آسمان
                {selected.skyImage ? " ✓" : " —"}
              </li>
            </ul>
            <p className="rounded-lg border border-[var(--teal)]/30 bg-[var(--teal)]/10 px-3 py-2 text-xs leading-6">
              دو منظر کره و آسمان آینه‌وارند؛ صوفی هر دو را رسم کرد تا رصدگر بین نقش کره و آنچه با چشم
              در آسمان می‌بیند سرگردان نشود.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
