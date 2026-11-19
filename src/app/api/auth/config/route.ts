import { NextResponse } from "next/server";
import { googleConfigured, otpChannels } from "@/lib/auth/options";
export const dynamic = "force-dynamic";
export function GET() {
  const otp = otpChannels();
  const google = googleConfigured();
  return NextResponse.json(
    { available: google || otp.email || otp.phone, google, ...otp },
    { headers: { "Cache-Control": "no-store" } },
  );
}
