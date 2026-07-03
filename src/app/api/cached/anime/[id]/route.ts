import { NextRequest, NextResponse } from "next/server";
import { cacheGet, cacheSet } from "@/lib/disk-cache";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cacheKey = `anime_${id}`;

  const cached = cacheGet<unknown>(cacheKey, 90 * 24 * 60 * 60 * 1000);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "Cache-Control": "public, s-maxage=7776000, stale-while-revalidate=86400" },
    });
  }

  try {
    const apiUrl = process.env.API_INTERNAL_URL || "https://api.aniheist.com";
    const res = await fetch(`${apiUrl}/api/anime/${id}`, {
      signal: AbortSignal.timeout(15000),
    });
    const text = await res.text();
    if (!text) throw new Error("Empty response");
    const data = JSON.parse(text);
    if (data.status === "error") {
      return NextResponse.json(data, { status: res.status });
    }
    cacheSet(cacheKey, data);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=7776000, stale-while-revalidate=86400" },
    });
  } catch (e) {
    console.error(`[anime/${id}]`, e instanceof Error ? e.message : e);
    return NextResponse.json({ status: "error", error: { code: "UPSTREAM_ERROR", message: "Failed to fetch anime data" } }, { status: 502 });
  }
}
