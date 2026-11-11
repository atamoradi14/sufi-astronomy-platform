import { NextResponse } from "next/server";
import { CONSTELLATIONS } from "@/lib/astronomy/constellations";

/** Catalog service — later extract to services/catalog */
export async function GET() {
  return NextResponse.json({
    service: "catalog",
    source: "صور الکواکب — عبدالرحمن صوفی (مختصات مدرن آموزشی)",
    count: CONSTELLATIONS.length,
    items: CONSTELLATIONS,
  });
}
