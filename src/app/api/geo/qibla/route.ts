import { NextRequest, NextResponse } from "next/server";
import { qiblaBearing, qiblaDistanceKm } from "@/lib/geo/qibla";
import { clientKey, rateLimit } from "@/lib/api/rateLimit";

/** Gateway-friendly qibla service — later extract to services/qibla */
export async function GET(req: NextRequest) {
  const rl = rateLimit(clientKey(req.headers, "geo-qibla"));
  if (!rl.ok) {
    return NextResponse.json(
      { error: "rate limit exceeded" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const sp = req.nextUrl.searchParams;
  const lat = Number(sp.get("lat"));
  const lon = Number(sp.get("lon"));
  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json(
      { error: "lat و lon الزامی است" },
      { status: 400 },
    );
  }
  return NextResponse.json({
    service: "qibla",
    lat,
    lon,
    bearing: qiblaBearing(lat, lon),
    distanceKm: qiblaDistanceKm(lat, lon),
  });
}
