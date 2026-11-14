"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Click any value to copy the raw (Latin) string to clipboard. */
export function CopyValue({
  label,
  value,
  display,
  className,
}: {
  label: string;
  /** Raw copy payload (ASCII / high precision). */
  value: string;
  /** Optional Persian/display rendering. */
  display?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      title="کپی"
      className={cn(
        "rounded-xl border border-[var(--border)] bg-[var(--panel)]/85 px-4 py-3 text-right transition-colors hover:border-[var(--gold)]/50",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] text-[var(--muted)]">{label}</div>
        <span className="text-[10px] text-[var(--teal)]">
          {copied ? "کپی شد" : "کلیک = کپی"}
        </span>
      </div>
      <div
        lang="en"
        className="mt-1 text-left break-all font-[family-name:var(--font-body)] text-[var(--gold-soft)] tabular-nums tracking-tight dir-ltr"
        style={{ fontFeatureSettings: '"locl" 0' }}
      >
        {display ?? value}
      </div>
    </button>
  );
}
