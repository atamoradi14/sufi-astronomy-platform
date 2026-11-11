"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProofAnimator } from "@/components/sphere/ProofAnimator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

function ProofsInner() {
  const sp = useSearchParams();
  const kind = useMemo(() => {
    const k = sp.get("kind");
    return k === "sine" ? "sine" : "cosine";
  }, [sp]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header className="space-y-3">
        <p className="text-sm text-[var(--teal)]">اثبات‌ها · Smart I.3–4 + هندسه کروی المپیاد</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
          اثبات قانون سینوس و کسینوس کروی
        </h1>
        <p className="max-w-3xl text-sm leading-8 text-[var(--muted)]">
          گام‌به‌گام با انیمیشن و آزمایش عددی. کسینوس‌ها با مختصات دکارتی (رویکرد تحلیلی Smart)، سینوس‌ها با ارتفاع کروی (رویکرد رایج جزوه‌های المپیاد ایران).
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant={kind === "cosine" ? "default" : "secondary"}>
            <Link href="/proofs?kind=cosine">قانون کسینوس‌ها</Link>
          </Button>
          <Button asChild size="sm" variant={kind === "sine" ? "default" : "secondary"}>
            <Link href="/proofs?kind=sine">قانون سینوس‌ها</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/lab">آزمایش روی کرهٔ سه‌بعدی</Link>
          </Button>
        </div>
      </header>
      <ProofAnimator kind={kind} />
    </div>
  );
}

export default function ProofsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16 text-[var(--muted)]">
          بارگذاری اثبات…
        </div>
      }
    >
      <ProofsInner />
    </Suspense>
  );
}
