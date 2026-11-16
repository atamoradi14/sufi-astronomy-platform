"use client";
import "katex/dist/katex.min.css";

import katex from "katex";
import { useDigitScript } from "@/components/digits/DigitScript";
import { formatDigits, formatMathHtml } from "@/lib/digits";

/** Authored TeX is rendered locally: no remote math service or text-direction guessing. */
export function MathBlock({
  children,
  label,
}: {
  children: string;
  label?: string;
}) {
  const script = useDigitScript();
  const isTex = /\\[a-zA-Z]+|\^|_\{|\{/.test(children);
  const html = isTex
    ? katex.renderToString(children, {
        displayMode: true,
        throwOnError: false,
        strict: "ignore",
        trust: false,
        output: "htmlAndMathml",
      })
    : null;
  return (
    <div
      className="math-block"
      dir="ltr"
      role="group"
      aria-label={label ?? "Mathematical expression"}
    >
      {html ? (
        <div
          dangerouslySetInnerHTML={{ __html: formatMathHtml(html, script) }}
        />
      ) : (
        <div className="math-plain">{formatDigits(children, script)}</div>
      )}
    </div>
  );
}

// Preserve TeX until KaTeX has parsed the original source.
MathBlock.preserveDigitSource = true;
