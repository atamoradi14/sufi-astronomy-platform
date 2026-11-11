import { NextRequest, NextResponse } from "next/server";
import { equatorialToHorizontal } from "@/lib/astronomy/sphere";
import { lstHours } from "@/lib/astronomy/time";

/** Coordinate transform service — later extract to services/sphere-math */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const ra = Number(sp.get("ra"));
  const dec = Number(sp.get("dec"));
  const lat = Number(sp.get("lat"));
  const lon = Number(sp.get("lon") ?? "0");
  const iso = sp.get("iso");
  const date = iso ? new Date(iso) : new Date();

  if ([ra, dec, lat].some((n) => Number.isNaN(n))) {
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
