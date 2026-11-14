import { NextRequest, NextResponse } from "next/server";
import { liveSnapshot, sunDaySeries, sunYearSeries } from "@/lib/astronomy/ephemeris";
import { clientKey, rateLimit } from "@/lib/api/rateLimit";
import { inRange, parseIso } from "@/lib/api/validate";

export async function GET(req: NextRequest) {
  const limited = rateLimit(clientKey(req.headers, "astro-live"), 90);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "درخواست زیاد است" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  const sp = req.nextUrl.searchParams;
  const lon = Number(sp.get("lon") ?? "51.389");
  const lat = Number(sp.get("lat") ?? "35.6892");
  const altRaw = sp.get("alt");
  const altM = altRaw == null || altRaw === "" ? null : Number(altRaw);
  const date = parseIso(sp.get("iso"));
  const wantSeries = sp.get("series") === "1";

  if (
    !date ||
    !inRange(lat, -90, 90) ||
    !inRange(lon, -180, 180) ||
    (altM != null && (!Number.isFinite(altM) || altM < -500 || altM > 9000))
  ) {
    return NextResponse.json({ error: "پارامتر نامعتبر" }, { status: 400 });
  }

  const snap = liveSnapshot(date, lat, lon, altM);
  const payload: Record<string, unknown> = {
    service: "astro-live",
    ...snap,
  };

  if (wantSeries) {
    payload.sunDay = sunDaySeries(date, lat, lon);
    payload.sunYear = sunYearSeries(date.getUTCFullYear(), lat, lon);
  }

  return NextResponse.json(payload);
}
