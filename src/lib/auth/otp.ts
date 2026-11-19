import { createHmac, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import { userDatabase } from "./store";

export type OtpChannel = "email" | "phone";
export const OTP_TTL_MS = 10 * 60 * 1000;
export const OTP_RESEND_MS = 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;
const PER_TARGET_PER_HOUR = 5;
const PER_IP_PER_HOUR = 20;

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
export function latinDigits(value: string) {
  return value.replace(/[۰-۹٠-٩]/g, (d) => {
    const p = PERSIAN_DIGITS.indexOf(d);
    return String(p >= 0 ? p : ARABIC_DIGITS.indexOf(d));
  });
}

const EMAIL = /^[^\s@<>()[\]\\,;:"]{1,64}@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;
export function normalizeEmail(input: unknown) {
  if (typeof input !== "string") return null;
  const value = input.trim().toLowerCase();
  return value.length <= 254 && EMAIL.test(value) ? value : null;
}

/**
 * Accepts Iranian mobile numbers in the usual local forms (0912…, 912…, 0098…, +98…)
 * and any other international number in E.164 form. Returns E.164 (+989121234567).
 */
export function normalizePhone(input: unknown) {
  if (typeof input !== "string") return null;
  let value = latinDigits(input).replace(/[\s\-().]/g, "");
  if (value.startsWith("00")) value = "+" + value.slice(2);
  if (/^09\d{9}$/.test(value)) value = "+98" + value.slice(1);
  else if (/^9\d{9}$/.test(value)) value = "+98" + value;
  else if (/^98\d{10}$/.test(value)) value = "+" + value;
  if (value.startsWith("+98")) return /^\+989\d{9}$/.test(value) ? value : null;
  return /^\+[1-9]\d{7,14}$/.test(value) ? value : null;
}

export function normalizeTarget(channel: OtpChannel, input: unknown) {
  return channel === "email" ? normalizeEmail(input) : normalizePhone(input);
}

function secret() {
  const value = process.env.NEXTAUTH_SECRET;
  if (!value) throw new Error("NEXTAUTH_SECRET is required for one-time codes");
  return value;
}
function hashCode(id: string, code: string) {
  return createHmac("sha256", secret()).update(`otp:${id}:${code}`).digest();
}

let ready = false;
function db() {
  const database = userDatabase();
  if (!ready) {
    database.exec(
      "CREATE TABLE IF NOT EXISTS otp_challenges (id TEXT PRIMARY KEY, channel TEXT NOT NULL, target TEXT NOT NULL, code_hash BLOB NOT NULL, ip TEXT, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, consumed_at INTEGER); CREATE INDEX IF NOT EXISTS otp_target ON otp_challenges(channel, target, created_at DESC); CREATE INDEX IF NOT EXISTS otp_ip ON otp_challenges(ip, created_at DESC);",
    );
    ready = true;
  }
  return database;
}

export type OtpRequestResult =
  | { ok: true; retryAfter: number }
  | { ok: false; error: "invalid_target" | "rate_limited" | "send_failed"; retryAfter?: number };

/**
 * Creates a challenge and delivers the code through `send`. The challenge is removed
 * when delivery fails so it does not count against the person.
 */
export async function requestOtp(
  channel: OtpChannel,
  rawTarget: unknown,
  ip: string | null,
  send: (target: string, code: string) => Promise<boolean>,
  now = Date.now(),
): Promise<OtpRequestResult> {
  const target = normalizeTarget(channel, rawTarget);
  if (!target) return { ok: false, error: "invalid_target" };
  const hourAgo = now - 60 * 60 * 1000;
  const recent = db()
    .prepare(
      "SELECT COUNT(*) AS n, MAX(created_at) AS last FROM otp_challenges WHERE channel=? AND target=? AND created_at>?",
    )
    .get(channel, target, hourAgo) as { n: number; last: number | null };
  if (recent.last && now - Number(recent.last) < OTP_RESEND_MS)
    return {
      ok: false,
      error: "rate_limited",
      retryAfter: Math.ceil((OTP_RESEND_MS - (now - Number(recent.last))) / 1000),
    };
  if (Number(recent.n) >= PER_TARGET_PER_HOUR)
    return { ok: false, error: "rate_limited", retryAfter: 3600 };
  if (ip) {
    const fromIp = db()
      .prepare("SELECT COUNT(*) AS n FROM otp_challenges WHERE ip=? AND created_at>?")
      .get(ip, hourAgo) as { n: number };
    if (Number(fromIp.n) >= PER_IP_PER_HOUR)
      return { ok: false, error: "rate_limited", retryAfter: 3600 };
  }
  const id = randomUUID();
  const code = String(randomInt(100000, 1000000));
  db()
    .prepare(
      "INSERT INTO otp_challenges (id,channel,target,code_hash,ip,created_at,expires_at) VALUES (?,?,?,?,?,?,?)",
    )
    .run(id, channel, target, hashCode(id, code), ip, now, now + OTP_TTL_MS);
  let delivered = false;
  try {
    delivered = await send(target, code);
  } catch {
    delivered = false;
  }
  if (!delivered) {
    db().prepare("DELETE FROM otp_challenges WHERE id=?").run(id);
    return { ok: false, error: "send_failed" };
  }
  db().prepare("DELETE FROM otp_challenges WHERE created_at<?").run(now - 24 * 60 * 60 * 1000);
  return { ok: true, retryAfter: OTP_RESEND_MS / 1000 };
}

/** Checks a code against the newest open challenge; single use, limited attempts. */
export function verifyOtp(channel: OtpChannel, rawTarget: unknown, rawCode: unknown, now = Date.now()) {
  const target = normalizeTarget(channel, rawTarget);
  const code = typeof rawCode === "string" ? latinDigits(rawCode).replace(/\s/g, "") : "";
  if (!target || !/^\d{6}$/.test(code)) return null;
  const challenge = db()
    .prepare(
      "SELECT id, code_hash, attempts FROM otp_challenges WHERE channel=? AND target=? AND consumed_at IS NULL AND expires_at>? ORDER BY created_at DESC LIMIT 1",
    )
    .get(channel, target, now) as
    | { id: string; code_hash: Uint8Array; attempts: number }
    | undefined;
  if (!challenge || Number(challenge.attempts) >= OTP_MAX_ATTEMPTS) return null;
  db().prepare("UPDATE otp_challenges SET attempts=attempts+1 WHERE id=?").run(challenge.id);
  const expected = Buffer.from(challenge.code_hash);
  const actual = hashCode(challenge.id, code);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  const consumed = db()
    .prepare("UPDATE otp_challenges SET consumed_at=? WHERE id=? AND consumed_at IS NULL")
    .run(now, challenge.id);
  return Number(consumed.changes) === 1 ? target : null;
}
