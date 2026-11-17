import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth/session";
import { signClaims } from "@/lib/satellite/auth";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const allowed = new Map([
  ["GET/billing", "/v1/billing"],
  ["POST/billing/checkout", "/v1/billing/checkout"],
  ["POST/billing/reconcile", "/v1/billing/reconcile"],
  ["POST/billing/plans", "/v1/billing/plans"],
  ["GET/requests", "/v1/requests"],
  ["GET/devices", "/v1/devices"],
  ["POST/approve", "/v1/approve"],
  ["POST/revoke", "/v1/revoke"],
  ["POST/ticket", "/v1/ticket"],
]);
async function handle(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const session = await getUserSession();
  if (!session?.user?.id || !session.user.email)
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const path = (await params).path.join("/"),
    target = allowed.get(request.method + "/" + path);
  if (!target)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (
    request.method === "POST" &&
    request.headers.get("origin") !==
      new URL(process.env.NEXTAUTH_URL || "https://fanous.online").origin
  )
    return NextResponse.json({ error: "Origin rejected" }, { status: 403 });
  const secret = process.env.SATELLITE_SHARED_SECRET;
  if (!secret)
    return NextResponse.json(
      { error: "Satellite service not configured" },
      { status: 503 },
    );
  try {
    const token = signClaims(
      {
        aud: "control",
        sub: session.user.id,
        email: session.user.email,
        exp: Math.floor(Date.now() / 1000) + 30,
      },
      secret,
    );
    const payload =
      request.method === "POST" ? await request.text() : undefined;
    if (payload && payload.length > 4096)
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    const response = await fetch(
      (process.env.SATELLITE_SERVICE_URL ||
        "http://fanous-satellite.astronomy.svc.cluster.local:3860") + target,
      {
        method: request.method,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "X-Fanous-Country": request.headers.get("cf-ipcountry") || "",
        },
        body: payload,
        cache: "no-store",
        signal: AbortSignal.timeout(55000),
      },
    );
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Satellite service temporarily unavailable" },
      { status: 503 },
    );
  }
}
export { handle as GET, handle as POST };
