import { NextRequest, NextResponse } from "next/server";
import { cacheGet, cacheSet } from "@/lib/disk-cache";

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page") || "1";
  const perPage = req.nextUrl.searchParams.get("per_page") || "24";
  const cacheKey = `trending_p${page}_pp${perPage}`;

  const cached = cacheGet<{ data: Record<string, unknown>[]; meta: { count: number } }>(cacheKey, 90 * 24 * 60 * 60 * 1000);
  if (cached) {
    return NextResponse.json(
      { status: "success", data: cached.data, meta: { total: cached.meta.count, page: Number(page), hasNextPage: false } },
      { headers: { "Cache-Control": "public, s-maxage=7776000, stale-while-revalidate=86400" } }
    );
  }

  try {
    const apiUrl = process.env.API_INTERNAL_URL || "https://api.aniheist.com";
    const res = await fetch(`${apiUrl}/api/trending?page=${page}&per_page=${perPage}`, {
      signal: AbortSignal.timeout(15000),
    });
    const json = await res.json();
    if (json.status !== "success") throw new Error("API error");

    cacheSet(cacheKey, { data: json.data, meta: json.meta });

    return NextResponse.json(
      { status: "success", data: json.data, meta: { total: json.meta.count, page: Number(page), hasNextPage: json.meta.hasNextPage ?? false } },
      { headers: { "Cache-Control": "public, s-maxage=7776000, stale-while-revalidate=86400" } }
    );
  } catch {
    return NextResponse.json({ status: "error", data: [], meta: { total: 0 } }, { status: 502 });
  }
}
