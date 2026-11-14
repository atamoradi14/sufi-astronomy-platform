"use client";
import { ProofWorkbench } from "./ProofWorkbench";
/** Keep legacy entry points on the reviewed proof source. */
export function AreaProof() {
  return <ProofWorkbench kind="girard" />;
}
