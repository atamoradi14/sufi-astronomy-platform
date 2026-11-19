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
import {
  normalizeEmail,
  normalizePhone,
  requestOtp,
  verifyOtp,
} from "../src/lib/auth/otp";
import {
  otpEmail,
  parseConnectionString,
  signAcsRequest,
} from "../src/lib/auth/otp-senders";
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
test("Phone and email inputs normalize; Persian digits and Iranian local forms are accepted", () => {
  for (const input of ["09121234567", "۰۹۱۲۱۲۳۴۵۶۷", "9121234567", "+98 912 123 4567", "00989121234567", "989121234567"])
    assert.equal(normalizePhone(input), "+989121234567", input);
  assert.equal(normalizePhone("+64211234567"), "+64211234567");
  for (const bad of ["0812345678", "+9802112345678", "12345", "+0123456789", "", 42])
    assert.equal(normalizePhone(bad), null, String(bad));
  assert.equal(normalizeEmail(" Reader@Example.COM "), "reader@example.com");
  for (const bad of ["no-at.example.com", "a@b", "a@-x.com", "x<y>@e.com"])
    assert.equal(normalizeEmail(bad), null, bad);
});
test("One-time codes: delivered once, single use, limited attempts, resend cooldown and failed sends", async () => {
  let sent = "";
  const send = async (_t: string, code: string) => ((sent = code), true);
  const t0 = 1_800_000_000_000;
  const first = await requestOtp("phone", "09121112222", "203.0.113.1", send, t0);
  assert.deepEqual(first, { ok: true, retryAfter: 60 });
  assert.match(sent, /^\d{6}$/);
  const tooSoon = await requestOtp("phone", "+989121112222", "203.0.113.1", send, t0 + 5000);
  assert.equal(tooSoon.ok, false);
  assert.equal(!tooSoon.ok && tooSoon.error, "rate_limited");
  const wrong = sent === "000000" ? "111111" : "000000";
  assert.equal(verifyOtp("phone", "09121112222", wrong, t0 + 1000), null);
  assert.equal(verifyOtp("phone", "09121112222", sent.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]), t0 + 2000), "+989121112222");
  assert.equal(verifyOtp("phone", "09121112222", sent, t0 + 3000), null, "codes are single use");
  // expiry
  await requestOtp("email", "late@example.com", null, send, t0);
  assert.equal(verifyOtp("email", "late@example.com", sent, t0 + 11 * 60 * 1000), null);
  // attempts are capped even if the right code arrives later
  await requestOtp("email", "guess@example.com", null, send, t0);
  for (let i = 0; i < 5; i++) verifyOtp("email", "guess@example.com", i === 0 && sent === "123456" ? "654321" : "123456", t0 + 1000);
  assert.equal(verifyOtp("email", "guess@example.com", sent, t0 + 2000), null);
  // a failed delivery does not leave a usable challenge or a cooldown
  const failed = await requestOtp("email", "down@example.com", null, async () => false, t0);
  assert.deepEqual(failed, { ok: false, error: "send_failed" });
  const retry = await requestOtp("email", "down@example.com", null, send, t0 + 1000);
  assert.equal(retry.ok, true);
  assert.equal((await requestOtp("email", "nope", null, send, t0)).ok, false);
});
test("OTP sign-in reuses an existing Google account by email, creates phone accounts, and never grants admin", async () => {
  const otpProvider = authOptions.providers.find((p) => p.id === "otp" || (p as unknown as { options?: { id?: string } }).options?.id === "otp") as unknown as {
    options: { authorize: (c: Record<string, string>) => Promise<{ id: string } | null> };
  };
  process.env.OTP_SMS_URL = "http://sms.test";
  process.env.OTP_SMS_API_KEY = "test-key";
  process.env.ACS_CONNECTION_STRING = "endpoint=https://acs.test/;accesskey=" + Buffer.from("k").toString("base64");
  process.env.ACS_SENDER_ADDRESS = "DoNotReply@example.com";
  const google = recordGoogleLogin({ sub: "google-owner", email: "owner@example.com", name: "Owner" });
  let code = "";
  const send = async (_t: string, c: string) => ((code = c), true);
  await requestOtp("email", "OWNER@example.com", null, send);
  const viaEmail = await otpProvider.options.authorize({ channel: "email", target: "owner@example.com", code });
  assert.equal(viaEmail?.id, google.id);
  await requestOtp("phone", "09350001111", null, send);
  const phoneUser = await otpProvider.options.authorize({ channel: "phone", target: "+989350001111", code });
  assert.ok(phoneUser?.id);
  await requestOtp("phone", "09350001111", null, send, Date.now() + 61_000);
  const again = await otpProvider.options.authorize({ channel: "phone", target: "09350001111", code });
  assert.equal(again?.id, phoneUser!.id);
  assert.equal(await otpProvider.options.authorize({ channel: "phone", target: "09350001111", code }), null);
  const session = authOptions.callbacks!.session!;
  type SessionArgs = Parameters<typeof session>[0];
  const build = (userId: string, authMethod: "google" | "otp") =>
    session({ session: { user: { name: "", email: "" }, expires: "" }, token: { userId, authMethod } } as unknown as SessionArgs) as unknown as Promise<{ user?: { isAdmin: boolean; phone?: string | null } }>;
  assert.equal((await build(google.id, "otp")).user?.isAdmin, false);
  assert.equal((await build(google.id, "google")).user?.isAdmin, true);
  assert.equal((await build(phoneUser!.id, "otp")).user?.phone, "+989350001111");
});
test("ACS request signing and the code email are well formed", () => {
  const connection = parseConnectionString("endpoint=https://example.communication.azure.com/;accesskey=" + Buffer.from("secret").toString("base64"));
  assert.ok(connection);
  const url = new URL("/emails:send?api-version=2023-03-31", connection!.endpoint);
  const headers = signAcsRequest("POST", url, "{}", connection!.accessKey, new Date("2026-11-19T00:00:00Z"));
  assert.equal(headers["x-ms-date"], "Thu, 19 Nov 2026 00:00:00 GMT");
  assert.equal(headers["x-ms-content-sha256"], "RBNvo1WzZ4oRRq0W9+hknpT7T8If536DEMBg9hyq/4o=");
  assert.match(headers.Authorization, /^HMAC-SHA256 SignedHeaders=x-ms-date;host;x-ms-content-sha256&Signature=[A-Za-z0-9+/=]+$/);
  assert.equal(parseConnectionString("nonsense"), null);
  const mail = otpEmail("123456");
  assert.ok(mail.subject.includes("123456") && mail.plainText.includes("123456") && mail.html.includes("123456"));
});
test.after(() => {
  userDatabase().close();
  assert.ok(directory.startsWith(join(tmpdir(), "manderia-auth-")));
  rmSync(directory, { recursive: true, force: true });
});
