import { NextResponse } from "next/server";
import { userDatabase } from "@/lib/auth/store";
import { googleConfigured } from "@/lib/auth/options";
export const dynamic = "force-dynamic";
export function GET() {
  try {
    userDatabase().prepare("SELECT 1").get();
    if (!googleConfigured()) throw new Error("Auth unavailable");
    return NextResponse.json(
      { status: "ok", application: "Manderia", authentication: "google" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { status: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
