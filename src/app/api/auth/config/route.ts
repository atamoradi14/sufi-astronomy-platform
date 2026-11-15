import { NextResponse } from "next/server";
import { googleConfigured } from "@/lib/auth/options";
export const dynamic = "force-dynamic";
export function GET() {
  return NextResponse.json(
    { available: googleConfigured() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
