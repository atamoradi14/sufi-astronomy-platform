import { NextRequest, NextResponse } from "next/server";
import { equatorialToHorizontal } from "@/lib/astronomy/sphere";
import { lstHours } from "@/lib/astronomy/time";
import { clientKey, rateLimit } from "@/lib/api/rateLimit";
import { inRange, parseIso } from "@/lib/api/validate";

export async function GET(req: NextRequest) {
  const limited = rateLimit(clientKey(req.headers, "astro-horizontal"));
  if (!limited.ok) {
    return NextResponse.json(
      { error: "درخواست زیاد است" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }
  const sp = req.nextUrl.searchParams;
  const ra = Number(sp.get("ra"));
  const dec = Number(sp.get("dec"));
  const lat = Number(sp.get("lat"));
  const lon = Number(sp.get("lon") ?? "0");
  const date = parseIso(sp.get("iso"));

  if (
    !date ||
    !inRange(ra, 0, 24) ||
    !inRange(dec, -90, 90) ||
    !inRange(lat, -90, 90) ||
    !inRange(lon, -180, 180)
  ) {
    return NextResponse.json({ error: "ra, dec, lat الزامی است" }, { status: 400 });
  }

  const lst = lstHours(date, lon);
  const horiz = equatorialToHorizontal(ra, dec, lat, lst);
  return NextResponse.json({
    service: "sphere-math",
    ra,
    dec,
    lat,
    lon,
    lst,
    ...horiz,
  });
}
