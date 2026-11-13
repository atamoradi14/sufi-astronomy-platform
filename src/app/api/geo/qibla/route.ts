import { NextRequest, NextResponse } from "next/server";
import { qiblaBearing, qiblaDistanceKm } from "@/lib/geo/qibla";
import { clientKey, rateLimit } from "@/lib/api/rateLimit";
import { inRange } from "@/lib/api/validate";

export async function GET(req: NextRequest) {
  const limited = rateLimit(clientKey(req.headers, "geo-qibla"));
  if (!limited.ok) {
    return NextResponse.json(
      { error: "درخواست زیاد است" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }
  const sp = req.nextUrl.searchParams;
  const lat = Number(sp.get("lat"));
  const lon = Number(sp.get("lon"));
  if (!inRange(lat, -90, 90) || !inRange(lon, -180, 180)) {
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
