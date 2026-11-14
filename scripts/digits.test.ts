import { test } from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import { formatDigits, formatMathHtml } from "../src/lib/digits";
import {
  getDigitScript,
  setDigitScript,
  subscribeDigitScript,
  localizeDigits,
} from "../src/lib/utils";
import { toCsv } from "../src/lib/charts/csv";
import { LEARNING_PATH, lessonById } from "../src/lib/content/curriculum";

test("Both digit scripts round-trip with signs, precision and scientific notation intact", () => {
  const raw = "−12.0042 × 10^-7; 1,234.50°";
  const persian = formatDigits(raw, "fa");
  assert.equal(persian, "−۱۲.۰۰۴۲ × ۱۰^-۷; ۱,۲۳۴.۵۰°");
  assert.equal(formatDigits(persian, "en"), raw);
  assert.equal(formatDigits("٠١٢٣٤٥٦٧٨٩", "en"), "0123456789");
  assert.equal(formatDigits(persian, "fa"), persian);
});
test("Rendered equations localise without modifying CSS, attributes, entities, or original TeX", () => {
  const tex = String.raw`x=\frac{12.50}{2}\times10^{-3}`;
  const html = katex.renderToString(tex, {
    displayMode: true,
    output: "htmlAndMathml",
  });
  const fa = formatMathHtml(html, "fa");
  assert.deepEqual(fa.match(/<[^>]*>/g), html.match(/<[^>]*>/g));
  assert.equal(
    fa.match(/<annotation[^>]*>(.*?)<\/annotation>/)?.[1],
    html.match(/<annotation[^>]*>(.*?)<\/annotation>/)?.[1],
  );
  assert.match(fa, /۱۲/);
  assert.equal(formatMathHtml(fa, "en"), html);
  assert.equal(
    formatMathHtml('<span style="width:1.25em">&#x2212;12</span>', "fa"),
    '<span style="width:1.25em">&#x2212;۱۲</span>',
  );
});
test("Digit store notifies subscribers and unsubscribes without changing numeric payloads", () => {
  setDigitScript("en", false);
  let calls = 0;
  const stop = subscribeDigitScript(() => calls++);
  const rows = [{ utc: "2026-11-15T00:00:00Z", value: 1.23456789 }];
  const before = toCsv(rows);
  setDigitScript("fa", false);
  assert.equal(getDigitScript(), "fa");
  assert.equal(localizeDigits("12.50"), "۱۲.۵۰");
  assert.equal(toCsv(rows), before);
  setDigitScript("fa", false);
  assert.equal(calls, 1);
  stop();
  setDigitScript("en", false);
  assert.equal(calls, 1);
  assert.equal(localizeDigits("۱۲.۵۰"), "12.50");
});
test("Cursor course path resolves entirely to the reviewed curriculum", () => {
  for (const block of LEARNING_PATH)
    for (const id of block.lessonIds) {
      const lesson = lessonById(id);
      assert.ok(lesson, id);
      assert.equal(lesson.chapterId, block.chapterId);
    }
  assert.deepEqual(
    LEARNING_PATH.find((p) => p.chapterId === "ch3")?.lessonIds,
    [
      "refraction-parallax",
      "refraction-integral",
      "refraction-series",
      "refraction-horizon",
    ],
  );
});
