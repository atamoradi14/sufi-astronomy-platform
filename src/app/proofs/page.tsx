"use client";
import { useLanguage } from "@/components/language/Language";
import { LocalizedDigits } from "@/components/digits/DigitScript";
import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PROOFS, type ProofKind } from "@/lib/content/proofs";
import { ProofWorkbench } from "@/components/sphere/ProofWorkbench";
import { Button } from "@/components/ui/button";
const KINDS = new Set(PROOFS.map((p) => p.kind));
function ProofsInner() {
  const { fa, t } = useLanguage();
  const sp = useSearchParams();
  const kind = useMemo(() => {
    const k = sp.get("kind") ?? "cosine";
    return (KINDS.has(k as ProofKind) ? k : "cosine") as ProofKind;
  }, [sp]);
  return (
    <LocalizedDigits>
      {
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
          <header className="space-y-3">
            <p className="text-sm text-[var(--teal)] dir-ltr text-left">
              {t(
                "اسمارت · اثبات‌های پیوسته با شکل‌های بازسازی‌شده",
                "Smart · connected proofs with reconstructed figures",
              )}
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--gold-soft)] md:text-4xl">
              {t("اثبات‌های گام‌به‌گام", "Step-by-step proofs")}
            </h1>
            <p className="max-w-3xl text-sm leading-8 text-[var(--muted)]">
              {t(
                "ساخت‌های مماس و فرمول‌های اسمارت: کسینوس اضلاع، قانون جیب، فرمول مشابه، چهار جزء، مثلث قطبی، نپر، هاورساین، مثلث نجومی و زمان نجومی.",
                "Tangent constructions and Smart’s identities: cosine and sine rules, analogues, four parts, polar triangles, Napier, haversine, the astronomical triangle, and sidereal time.",
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {PROOFS.map((p) => (
                <Button
                  key={p.kind}
                  asChild
                  size="sm"
                  variant={kind === p.kind ? "default" : "secondary"}
                >
                  <Link href={`/proofs?kind=${p.kind}`}>
                    {fa ? p.titleFa : p.titleEn}
                  </Link>
                </Button>
              ))}
              <Button asChild size="sm" variant="outline">
                <Link href="/lab">{t("کرهٔ سه‌بعدی", "3D sphere")}</Link>
              </Button>
            </div>
          </header>
          <ProofWorkbench key={kind} kind={kind} />
        </div>
      }
    </LocalizedDigits>
  );
}
export default function ProofsPage() {
  return (
    <LocalizedDigits>
      {
        <Suspense
          fallback={
            <div className="mx-auto max-w-6xl px-4 py-16 text-[var(--muted)]">
              بارگذاری اثبات…
            </div>
          }
        >
          <ProofsInner />
        </Suspense>
      }
    </LocalizedDigits>
  );
}
