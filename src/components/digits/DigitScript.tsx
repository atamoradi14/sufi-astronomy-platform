"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  getDigitScript,
  initDigitScriptFromStorage,
  subscribeDigitScript,
  type DigitScript as DigitScriptMode,
} from "@/lib/utils";

export function useDigitScript(): DigitScriptMode {
  return useSyncExternalStore(subscribeDigitScript, getDigitScript, () => "en");
}

/** Remount the tree when the digit script changes so every formatted number updates. */
export function DigitRemount({ children }: { children: React.ReactNode }) {
  const mode = useDigitScript();
  useEffect(() => {
    initDigitScriptFromStorage();
  }, []);
  return (
    <div key={mode} className="contents">
      {children}
    </div>
  );
}
