export type DigitScript = "en" | "fa";
const ENGLISH = "0123456789";
const PERSIAN = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC = "٠١٢٣٤٥٦٧٨٩";

/** Presentation only. Never rewrite numeric data, URLs, or exports with this. */
export function formatDigits(
  value: string | number,
  script: DigitScript,
): string {
  return String(value).replace(/[0-9۰-۹٠-٩]/g, (digit) => {
    const index =
      ENGLISH.indexOf(digit) >= 0
        ? ENGLISH.indexOf(digit)
        : PERSIAN.indexOf(digit) >= 0
          ? PERSIAN.indexOf(digit)
          : ARABIC.indexOf(digit);
    return (script === "fa" ? PERSIAN : ENGLISH)[index];
  });
}

/** Keep TeX annotations and HTML attributes unchanged; localise rendered text only. */
export function formatMathHtml(html: string, script: DigitScript): string {
  let annotation = false;
  return html
    .split(/(<(?:[^>"']|"[^"]*"|'[^']*')*>)/g)
    .map((part) => {
      if (part.startsWith("<")) {
        if (/^<annotation\b/.test(part)) annotation = true;
        if (/^<\/annotation\b/.test(part)) annotation = false;
        return part;
      }
      if (annotation) return part;
      return part
        .split(/(&[^;\s]+;)/g)
        .map((text) =>
          text.startsWith("&") ? text : formatDigits(text, script),
        )
        .join("");
    })
    .join("");
}
