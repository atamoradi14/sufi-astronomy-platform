import { NextRequest, NextResponse } from "next/server";
import { otpChannels } from "@/lib/auth/options";
import { requestOtp, type OtpChannel } from "@/lib/auth/otp";
import { sendEmailCode, sendSmsCode } from "@/lib/auth/otp-senders";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const reply = (body: object, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const allowed = new Set([request.nextUrl.origin]);
  if (process.env.NEXTAUTH_URL) allowed.add(new URL(process.env.NEXTAUTH_URL).origin);
  return allowed.has(origin);
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return reply({ error: "forbidden" }, 403);
  let body: { channel?: unknown; target?: unknown };
  try {
    body = await request.json();
  } catch {
    return reply({ error: "invalid_request" }, 400);
  }
  const channel = body.channel;
  if (channel !== "email" && channel !== "phone") return reply({ error: "invalid_request" }, 400);
  if (!otpChannels()[channel as OtpChannel]) return reply({ error: "unavailable" }, 503);
  // Caddy replaces any client-supplied X-Forwarded-For with the connecting address.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const result = await requestOtp(channel, body.target, ip, channel === "email" ? sendEmailCode : sendSmsCode);
  if (result.ok) return reply({ ok: true, retryAfter: result.retryAfter });
  const status = result.error === "invalid_target" ? 400 : result.error === "rate_limited" ? 429 : 502;
  return reply({ error: result.error, retryAfter: result.retryAfter }, status);
}
