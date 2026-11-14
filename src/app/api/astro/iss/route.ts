import { NextRequest, NextResponse } from "next/server";
import { clientKey, rateLimit } from "@/lib/api/rateLimit";

type IssPayload = {
  service: "iss-live";
  source: string;
  timestamp: number;
  lat: number;
  lon: number;
  altKm: number | null;
  /** Speed from upstream (wheretheiss reports km/h). */
  velocityKmh: number | null;
  velocityKms: number | null;
  visibility: string | null;
};

async function fetchWheretheiss(): Promise<IssPayload | null> {
  const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544", {
    next: { revalidate: 5 },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  const j = (await res.json()) as {
    latitude: number;
    longitude: number;
    altitude: number;
    velocity: number;
    visibility?: string;
    timestamp: number;
  };
  return {
    service: "iss-live",
    source: "wheretheiss.at",
    timestamp: j.timestamp * 1000,
    lat: j.latitude,
    lon: j.longitude,
    altKm: j.altitude,
    velocityKmh: j.velocity,
    velocityKms: j.velocity / 3600,
    visibility: j.visibility ?? null,
  };
}

async function fetchOpenNotify(): Promise<IssPayload | null> {
  const res = await fetch("https://api.open-notify.org/iss-now.json", {
    next: { revalidate: 5 },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  const j = (await res.json()) as {
    timestamp: number;
    iss_position: { latitude: string; longitude: string };
  };
  return {
    service: "iss-live",
    source: "open-notify.org",
    timestamp: j.timestamp * 1000,
    lat: Number(j.iss_position.latitude),
    lon: Number(j.iss_position.longitude),
    altKm: null,
    velocityKmh: null,
    velocityKms: null,
    visibility: null,
  };
}

/** Sample track if upstream APIs fail — still usable offline. */
function sampleIss(now = Date.now()): IssPayload {
  const t = now / 1000;
  const period = 5580; // ~93 min
  const phase = (t % period) / period;
  const lon = ((phase * 360 * 16) % 360) - 180; // drifts
  const lat = 51.6 * Math.sin(phase * Math.PI * 2);
  return {
    service: "iss-live",
    source: "sample-fallback",
    timestamp: now,
    lat,
    lon,
    altKm: 420,
    velocityKmh: 27576,
    velocityKms: 7.66,
    visibility: null,
  };
}

export async function GET(req: NextRequest) {
  const limited = rateLimit(clientKey(req.headers, "astro-iss"), 45);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "درخواست زیاد است" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  try {
    const primary = await fetchWheretheiss();
    if (primary) return NextResponse.json(primary);
    const secondary = await fetchOpenNotify();
    if (secondary) return NextResponse.json(secondary);
  } catch {
    // fall through to sample
  }

  return NextResponse.json({
    ...sampleIss(),
    note: "upstream unavailable — sample ISS track",
  });
}
