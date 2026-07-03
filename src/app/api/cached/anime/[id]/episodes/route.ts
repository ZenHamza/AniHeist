import { NextRequest, NextResponse } from "next/server";
import { cacheGet, cacheSet } from "@/lib/disk-cache";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cacheKey = `episodes_${id}`;

  const cached = cacheGet<Record<string, unknown>>(cacheKey, 30 * 24 * 60 * 60 * 1000);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "Cache-Control": "public, s-maxage=2592000, stale-while-revalidate=86400" },
    });
  }

  try {
    const apiUrl = process.env.API_INTERNAL_URL || "https://api.aniheist.com";
    const res = await fetch(`${apiUrl}/api/anime/${id}/episodes`, {
      signal: AbortSignal.timeout(10000),
    });
    const data = await res.json();
    cacheSet(cacheKey, data);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=2592000, stale-while-revalidate=86400" },
    });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 502 });
  }
}
