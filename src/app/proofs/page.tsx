"use client";

import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PROOFS, type ProofKind } from "@/lib/content/proofs";
import { ProofWorkbench } from "@/components/sphere/ProofWorkbench";
import { Button } from "@/components/ui/button";

const KINDS = new Set(PROOFS.map((p) => p.kind));

function ProofsInner() {
  const sp = useSearchParams();
  const kind = useMemo(() => {
    const k = sp.get("kind") ?? "cosine";
    return (KINDS.has(k as ProofKind) ? k : "cosine") as ProofKind;
  }, [sp]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header className="space-y-3">
        <p className="text-sm text-[var(--teal)] dir-ltr text-left">
          Smart Part 1 · step proofs with reconstructed figures
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
          اثبات‌های گام‌به‌گام
        </h1>
        <p className="max-w-3xl text-sm leading-8 text-[var(--muted)]">
          استخراج‌ها مطابق بندها و شکل‌های اسمارت: مماس‌های شکل ۳ برای (A)، جبر بند ۶ برای (B)، امتداد شکل ۴ برای (C)، چهار جزء (D)، مثلث قطبی، نپر، هاورساین، PZX، و مکمل ژیرار.
        </p>
        <div className="flex flex-wrap gap-2">
          {PROOFS.map((p) => (
            <Button
              key={p.kind}
              asChild
              size="sm"
              variant={kind === p.kind ? "default" : "secondary"}
            >
              <Link href={`/proofs?kind=${p.kind}`}>{p.titleFa}</Link>
            </Button>
          ))}
          <Button asChild size="sm" variant="outline">
            <Link href="/lab">کرهٔ سه‌بعدی</Link>
          </Button>
        </div>
      </header>
      <ProofWorkbench kind={kind} />
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
