import katex from "katex";

/** Authored TeX is rendered locally: no remote math service or text-direction guessing. */
export function MathBlock({
  children,
  label,
}: {
  children: string;
  label?: string;
}) {
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
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <div className="math-plain">{children}</div>
      )}
    </div>
  );
}
