import { NextRequest, NextResponse } from "next/server";
import { computeAstroClock } from "@/lib/astronomy/time";
import { clientKey, rateLimit } from "@/lib/api/rateLimit";

/** Gateway-friendly clock service — later extract to services/astro-time */
export async function GET(req: NextRequest) {
  const rl = rateLimit(clientKey(req.headers, "astro-clock"));
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate limit exceeded" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const sp = req.nextUrl.searchParams;
  const lon = Number(sp.get("lon") ?? "51.389");
  const lat = Number(sp.get("lat") ?? "35.6892");
  const iso = sp.get("iso");
  const date = iso ? new Date(iso) : new Date();
  if (Number.isNaN(date.getTime()) || Number.isNaN(lon) || Number.isNaN(lat)) {
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
