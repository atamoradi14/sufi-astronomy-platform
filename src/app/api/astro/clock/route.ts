import { NextRequest, NextResponse } from "next/server";
import { computeAstroClock } from "@/lib/astronomy/time";
import { clientKey, rateLimit } from "@/lib/api/rateLimit";
import { inRange, parseIso } from "@/lib/api/validate";

export async function GET(req: NextRequest) {
  const limited = rateLimit(clientKey(req.headers, "astro-clock"));
  if (!limited.ok) {
    return NextResponse.json(
      { error: "درخواست زیاد است" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }
  const sp = req.nextUrl.searchParams;
  const lon = Number(sp.get("lon") ?? "51.389");
  const lat = Number(sp.get("lat") ?? "35.6892");
  const date = parseIso(sp.get("iso"));
  if (!date || !inRange(lat, -90, 90) || !inRange(lon, -180, 180)) {
    return NextResponse.json({ error: "پارامتر نامعتبر" }, { status: 400 });
  }
  const clock = computeAstroClock(date, lon);
  return NextResponse.json({
    service: "astro-time",
    lat,
    lon,
    jd: clock.jd,
    gmst: clock.gmst,
    lst: clock.lst,
    solarRa: clock.solarRa,
    solarDec: clock.solarDec,
    eotMin: clock.eotMin,
    utc: clock.utc.toISOString(),
  });
}
