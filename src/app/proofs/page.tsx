"use client";

import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProofAnimator } from "@/components/sphere/ProofAnimator";
import { AreaProof } from "@/components/sphere/AreaProof";
import { Button } from "@/components/ui/button";

function ProofsInner() {
  const sp = useSearchParams();
  const kind = useMemo(() => {
    const k = sp.get("kind");
    if (k === "sine" || k === "girard" || k === "cosine-polar") return k;
    return "cosine";
  }, [sp]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header className="space-y-3">
        <p className="text-sm text-[var(--teal)]">
          Proofs · Smart I — English formulations + Persian guide
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
          اثبات‌های گام‌به‌گام
        </h1>
        <p className="max-w-3xl text-sm leading-8 text-[var(--muted)]">
          صورت‌های انگلیسی مطابق کتاب‌های مرجع (Smart و هندسهٔ کروی کلاسیک)، همراه توضیح فارسی و آزمایش عددی زنده.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant={kind === "cosine" ? "default" : "secondary"}>
            <Link href="/proofs?kind=cosine">Cosine (sides)</Link>
          </Button>
          <Button asChild size="sm" variant={kind === "sine" ? "default" : "secondary"}>
            <Link href="/proofs?kind=sine">Sine law</Link>
          </Button>
          <Button asChild size="sm" variant={kind === "girard" ? "default" : "secondary"}>
            <Link href="/proofs?kind=girard">Area / Girard</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/lab">کرهٔ سه‌بعدی</Link>
          </Button>
        </div>
      </header>
      {kind === "girard" ? (
        <AreaProof />
      ) : (
        <ProofAnimator kind={kind === "sine" ? "sine" : "cosine"} />
      )}
    </div>
  );
}

export default function ProofsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16 text-[var(--muted)]">بارگذاری اثبات…</div>
      }
    >
      <ProofsInner />
    </Suspense>
  );
}
