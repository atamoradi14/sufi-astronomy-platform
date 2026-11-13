import { NextResponse } from "next/server";
import { CONSTELLATIONS } from "@/lib/astronomy/constellations";
import { SUWAR_CONSTELLATIONS, SUWAR_META } from "@/lib/content/suwarCatalog";

/** Catalog service — later extract to services/catalog */
export async function GET() {
  return NextResponse.json({
    service: "catalog",
    source: SUWAR_META.titleFa,
    author: SUWAR_META.authorFa,
    count: SUWAR_CONSTELLATIONS.length,
    items: SUWAR_CONSTELLATIONS.map((c) => ({
      id: c.id,
      nameFa: c.nameFa,
      nameAr: c.nameAr,
      ptolemy: c.ptolemy,
      hemisphere: c.hemisphere,
      rank: c.rank,
      titleFa: c.titleFa,
      excerptFa: c.excerptFa,
      globeImage: c.globeImage,
      skyImage: c.skyImage,
      tableImage: c.tableImage ?? null,
    })),
    interactiveSubset: CONSTELLATIONS.map((c) => ({
      id: c.id,
      nameFa: c.nameFa,
      starCount: c.stars.length,
    })),
  });
}
