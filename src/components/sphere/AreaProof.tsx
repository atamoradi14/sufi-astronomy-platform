"use client";
import { LocalizedDigits } from "@/components/digits/DigitScript";
import { ProofWorkbench } from "./ProofWorkbench";
/** Keep legacy entry points on the reviewed proof source. */
export function AreaProof() {
  return <LocalizedDigits>{<ProofWorkbench kind="girard" />}</LocalizedDigits>;
}
