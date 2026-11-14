"use client";
import { ProofWorkbench } from "./ProofWorkbench";
export function ProofAnimator({ kind }: { kind: "cosine" | "sine" }) {
  return <ProofWorkbench kind={kind} />;
}
