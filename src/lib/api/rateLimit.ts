/** Bounded in-memory rate limit for public GET APIs (best-effort per isolate). */

type Bucket = { count: number; resetAt: number; seenAt: number };

const MAX_BUCKETS = 512;
const buckets = new Map<string, Bucket>();

function sweep(now: number) {
  for (const [k, b] of buckets) {
    if (now >= b.resetAt) buckets.delete(k);
  }
  if (buckets.size <= MAX_BUCKETS) return;
  const overflow = buckets.size - MAX_BUCKETS;
  const oldest = [...buckets.entries()]
    .sort((a, b) => a[1].seenAt - b[1].seenAt)
    .slice(0, overflow + 32);
  for (const [k] of oldest) buckets.delete(k);
}

export function rateLimit(
  key: string,
  limit = 60,
  windowMs = 60_000,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  if (buckets.size > MAX_BUCKETS) sweep(now);
  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    if (buckets.size >= MAX_BUCKETS) sweep(now);
    if (buckets.size >= MAX_BUCKETS) {
      return { ok: false, retryAfterSec: 30 };
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs, seenAt: now });
    return { ok: true };
  }
  b.seenAt = now;
  if (b.count >= limit) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((b.resetAt - now) / 1000)) };
  }
  b.count += 1;
  return { ok: true };
}

/** IP is truncated and sanitised; the bucket map itself is size-capped. */
export function clientKey(headers: Headers, route: string): string {
  const fwd = headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const raw = (fwd || headers.get("x-real-ip") || "local").slice(0, 64);
  const ip = raw.replace(/[^0-9a-fA-F:.]/g, "") || "local";
  return `${route}:${ip}`;
}
