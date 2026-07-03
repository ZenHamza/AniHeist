import { NextRequest, NextResponse } from "next/server";
import { cacheGet, cacheSet } from "@/lib/disk-cache";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const cacheKey = `search_${q.toLowerCase().replace(/\s+/g, "_")}`;

  const cached = cacheGet<{ data: Record<string, unknown>[]; meta: { count: number } }>(cacheKey, 90 * 24 * 60 * 60 * 1000);
  if (cached) {
    return NextResponse.json(
      { status: "success", data: cached.data, meta: cached.meta },
      { headers: { "Cache-Control": "public, s-maxage=7776000, stale-while-revalidate=86400" } }
    );
  }

  try {
    const apiUrl = process.env.API_INTERNAL_URL || "https://api.aniheist.com";
    const res = await fetch(`${apiUrl}/api/search?q=${encodeURIComponent(q)}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (!text) throw new Error("Empty response");
    const json = JSON.parse(text);
    if (json.status !== "success") throw new Error("API error");

    cacheSet(cacheKey, { data: json.data, meta: json.meta });

    return NextResponse.json(json, {
      headers: { "Cache-Control": "public, s-maxage=7776000, stale-while-revalidate=86400" },
    });
  } catch {
    return NextResponse.json({ status: "error", data: [] }, { status: 502 });
  }
}
