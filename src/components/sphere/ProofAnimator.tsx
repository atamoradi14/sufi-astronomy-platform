"use client";
import { LocalizedDigits } from "@/components/digits/DigitScript";
import { ProofWorkbench } from "./ProofWorkbench";
export function ProofAnimator({ kind }: { kind: "cosine" | "sine" }) {
  return <LocalizedDigits>{<ProofWorkbench kind={kind} />}</LocalizedDigits>;
}
