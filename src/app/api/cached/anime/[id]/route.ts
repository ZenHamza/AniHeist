import { NextRequest, NextResponse } from "next/server";
import { cacheGet, cacheSet } from "@/lib/disk-cache";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cacheKey = `anime_${id}`;

  const cached = cacheGet<unknown>(cacheKey, 30 * 24 * 60 * 60 * 1000);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "Cache-Control": "public, s-maxage=2592000, stale-while-revalidate=86400" },
    });
  }

  try {
    const apiUrl = process.env.API_INTERNAL_URL || "https://api.yourdomain.com";
    const res = await fetch(`${apiUrl}/api/anime/${id}`, {
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (!text) throw new Error("Empty response");
    const data = JSON.parse(text);
    cacheSet(cacheKey, data);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=2592000, stale-while-revalidate=86400" },
    });
  } catch {
    return NextResponse.json({ status: "error" }, { status: 502 });
  }
}
