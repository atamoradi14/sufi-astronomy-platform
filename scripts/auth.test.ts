import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const directory = mkdtempSync(join(tmpdir(), "manderia-auth-"));
process.env.AUTH_DB_PATH = join(directory, "users.sqlite");
process.env.ADMIN_EMAILS = "owner@example.com";
process.env.GOOGLE_CLIENT_ID = "test.apps.googleusercontent.com";
process.env.GOOGLE_CLIENT_SECRET = "test-client-secret";
process.env.NEXTAUTH_SECRET = "isolated-test-session-secret-with-32-characters";
import {
  recordGoogleLogin,
  listUsers,
  userDatabase,
} from "../src/lib/auth/store";
import { authOptions, isAdminEmail } from "../src/lib/auth/options";
import { safeJsonLd } from "../src/lib/seo";
import sitemap from "../src/app/sitemap";

test("Google subject is the account key; returning sign-ins update rather than duplicate users", () => {
  const first = recordGoogleLogin({
    sub: "google-123",
    email: "Reader@Example.com",
    name: "Reader",
  });
  const second = recordGoogleLogin({
    sub: "google-123",
    email: "new@example.com",
    name: "Changed",
  });
  assert.equal(second.id, first.id);
  assert.equal(second.email, "new@example.com");
  assert.equal(second.login_count, 2);
  assert.equal(second.created_at, first.created_at);
  const third = recordGoogleLogin({
    sub: "other-google-subject",
    email: "new@example.com",
  });
  assert.notEqual(third.id, first.id);
  assert.equal(listUsers().total, 2);
  assert.equal(listUsers(1, "Changed").total, 1);
  assert.equal(listUsers(1, "'; DROP TABLE users;--").total, 0);
  assert.equal(listUsers().total, 2);
});
test("Unverified Google identities and other providers cannot sign in", async () => {
  const signIn = authOptions.callbacks!.signIn!;
  type Args = Parameters<typeof signIn>[0];
  const attempt = (provider: string, verified: boolean) =>
    ({
      account: { provider },
      profile: {
        sub: "a",
        email: "owner@example.com",
        email_verified: verified,
      },
    }) as unknown as Args;
  assert.equal(await signIn(attempt("google", false)), false);
  assert.equal(await signIn(attempt("other", true)), false);
  assert.equal(await signIn(attempt("google", true)), true);
  assert.equal(isAdminEmail("OWNER@example.com"), true);
  assert.equal(isAdminEmail("owner@example.com.evil"), false);
  assert.equal(isAdminEmail("reader@example.com"), false);
});
test("Authentication redirects are restricted to this site", async () => {
  const redirect = authOptions.callbacks!.redirect!;
  const baseUrl = "https://fanous.online";
  assert.equal(await redirect({ url: "/lab", baseUrl }), baseUrl + "/lab");
  assert.equal(
    await redirect({ url: "//evil.example/steal", baseUrl }),
    baseUrl,
  );
  assert.equal(
    await redirect({ url: "https://evil.example", baseUrl }),
    baseUrl,
  );
});
test("SEO includes lessons but excludes protected tools, and JSON-LD cannot close its script tag", () => {
  const entries = sitemap();
  assert.equal(entries.filter((x) => x.url.includes("/learn/")).length, 33);
  assert.equal(new Set(entries.map((x) => x.url)).size, entries.length);
  for (const privatePath of [
    "/admin",
    "/lab",
    "/sensor",
    "/atlas",
    "/api/auth",
  ]) {
    assert.ok(!entries.some((x) => x.url.endsWith(privatePath)));
  }
  const raw = safeJsonLd({ name: "</script><script>alert(1)</script>" });
  assert.ok(!raw.includes("<"));
  assert.deepEqual(JSON.parse(raw), {
    name: "</script><script>alert(1)</script>",
  });
});
test.after(() => {
  userDatabase().close();
  assert.ok(directory.startsWith(join(tmpdir(), "manderia-auth-")));
  rmSync(directory, { recursive: true, force: true });
});
