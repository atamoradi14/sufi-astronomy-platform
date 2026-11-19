import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth/session";
import { listUsers } from "@/lib/auth/store";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  const session = await getUserSession();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.isAdmin)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const page = Math.min(
    100000,
    Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1),
  );
  return NextResponse.json(
    listUsers(page, request.nextUrl.searchParams.get("q") || ""),
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
