import test from "node:test";
import assert from "node:assert/strict";
import sitemap from "../src/app/sitemap";
import robots from "../src/app/robots";
import { LESSONS, SMART_CHAPTERS } from "../src/lib/content/lessons";
import { PUBLIC_PAGES } from "../src/lib/site-pages";
import {
  AUTHOR_ID,
  SITE_URL,
  aboutStructuredData,
  lessonStructuredData,
  safeJsonLd,
  websiteStructuredData,
} from "../src/lib/seo";

test("Sitemap covers every canonical public page and lesson exactly once", () => {
  const entries = sitemap();
  assert.equal(entries.length, PUBLIC_PAGES.length + LESSONS.length);
  assert.equal(new Set(entries.map((entry) => entry.url)).size, entries.length);
  const expected = new Set([
    ...PUBLIC_PAGES.map((page) => page.path),
    ...LESSONS.map((lesson) => `/learn/${lesson.id}`),
  ]);
  for (const entry of entries) {
    const url = new URL(entry.url);
    assert.equal(url.origin, SITE_URL);
    assert.ok(expected.has(url.pathname));
    assert.equal(url.search + url.hash, "");
    assert.equal(
      entry.lastModified,
      undefined,
      "Do not fabricate freshness on every build",
    );
  }
  for (const path of [
    "/admin",
    "/sign-in",
    "/lab",
    "/sensor",
    "/atlas",
    "/architecture",
    "/learn",
    "/problems",
  ]) {
    assert.ok(!entries.some((entry) => new URL(entry.url).pathname === path));
  }
  const chapters = new Set(SMART_CHAPTERS.map((chapter) => chapter.id));
  assert.ok(
    LESSONS.every((lesson) => chapters.has(lesson.chapterId)),
    "Every lesson must appear in the HTML directory",
  );
});

test("Robots advertises the canonical sitemap and lets crawlers see HTML noindex rules", () => {
  const result = robots();
  assert.equal(result.sitemap, SITE_URL + "/sitemap.xml");
  assert.equal(result.host, SITE_URL);
  assert.ok(!Array.isArray(result.rules));
  const rules = result.rules as { allow: string; disallow: string[] };
  assert.equal(rules.allow, "/");
  assert.deepEqual(rules.disallow, ["/api/"]);
});

test("Site, author and all lesson schemas share an actual author and valid breadcrumb trail", () => {
  const site = websiteStructuredData();
  assert.equal(site.creator["@id"], AUTHOR_ID);
  assert.equal(aboutStructuredData().mainEntity["@id"], AUTHOR_ID);
  assert.ok(site.alternateName.includes("Fanous-e Khial"));
  for (const lesson of LESSONS) {
    const document = JSON.parse(safeJsonLd(lessonStructuredData(lesson)));
    const resource = document["@graph"].find(
      (item: { "@type": string }) => item["@type"] === "LearningResource",
    );
    const trail = document["@graph"].find(
      (item: { "@type": string }) => item["@type"] === "BreadcrumbList",
    ).itemListElement;
    assert.equal(resource.author["@id"], AUTHOR_ID);
    assert.equal(resource.url, SITE_URL + "/learn/" + lesson.id);
    assert.equal(resource.timeRequired, `PT${lesson.minutes}M`);
    assert.deepEqual(
      trail.map((item: { position: number }) => item.position),
      [1, 2, 3],
    );
    assert.equal(trail[1].item, SITE_URL + "/course");
    assert.equal(trail[2].item, resource.url);
  }
  assert.ok(
    !safeJsonLd(
      lessonStructuredData({
        ...LESSONS[0],
        titleFa: "</script><script>bad</script>",
      }),
    ).includes("<"),
  );
});
