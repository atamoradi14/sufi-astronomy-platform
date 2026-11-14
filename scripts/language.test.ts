import { test } from "node:test";
import assert from "node:assert/strict";
import { PROBLEMS } from "../src/lib/content/problems";
import { PROBLEMS_EN } from "../src/lib/content/problemsEn";
import {
  getLanguage,
  setLanguage,
  subscribeLanguage,
  selectSourceText,
} from "../src/lib/language";

test("Every exercise has a complete English problem, solution, and diagram caption", () => {
  assert.deepEqual(
    Object.keys(PROBLEMS_EN).sort(),
    PROBLEMS.map((p) => p.id).sort(),
  );
  for (const p of PROBLEMS) {
    for (const value of Object.values(PROBLEMS_EN[p.id])) {
      assert.ok(value.trim().length > 0, p.id);
      assert.ok(
        !/[آ-ی]/.test(value),
        `${p.id} contains Persian in its English translation`,
      );
    }
  }
});
test("Language changes notify subscribers without changing content identity", () => {
  setLanguage("fa", false);
  let calls = 0;
  const unsubscribe = subscribeLanguage(() => calls++);
  setLanguage("en", false);
  assert.equal(getLanguage(), "en");
  assert.equal(calls, 1);
  setLanguage("en", false);
  assert.equal(calls, 1);
  unsubscribe();
  setLanguage("fa", false);
  assert.equal(calls, 1);
});
test("Bilingual source notices select one language while ordinary citations stay intact", () => {
  assert.equal(
    selectSourceText("Original exercise / تمرین تألیفی", "en"),
    "Original exercise",
  );
  assert.equal(
    selectSourceText("Original exercise / تمرین تألیفی", "fa"),
    "تمرین تألیفی",
  );
  assert.equal(
    selectSourceText("Smart I §5 / Fig. 4", "en"),
    "Smart I §5 / Fig. 4",
  );
});
