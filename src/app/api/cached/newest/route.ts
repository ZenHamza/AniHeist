import { NextRequest, NextResponse } from "next/server";
import { cacheGet, cacheSet } from "@/lib/disk-cache";

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const perPage = Math.min(parseInt(req.nextUrl.searchParams.get("per_page") || "24", 10), 50);

  const cacheKey = `newest_p${page}_pp${perPage}`;

  const cached = cacheGet<{ data: Record<string, unknown>[]; meta: { count: number; hasNextPage?: boolean } }>(cacheKey, 30 * 24 * 60 * 60 * 1000);
  if (cached) {
    return NextResponse.json(
      { status: "success", data: cached.data, meta: { total: cached.meta.count, page, hasNextPage: cached.meta.hasNextPage ?? false } },
      { headers: { "Cache-Control": "public, s-maxage=2592000, stale-while-revalidate=86400" } }
    );
  }

  try {
    const apiUrl = process.env.API_INTERNAL_URL || "https://api.yourdomain.com";
    const res = await fetch(`${apiUrl}/api/newest?page=${page}&per_page=${perPage}`, {
      signal: AbortSignal.timeout(15000),
    });
    const json = await res.json();

    if (json.status !== "success") throw new Error("API error");

    cacheSet(cacheKey, { data: json.data, meta: json.meta });

    return NextResponse.json(
      { status: "success", data: json.data, meta: { total: json.meta.count, page, hasNextPage: json.meta.hasNextPage ?? false } },
      { headers: { "Cache-Control": "public, s-maxage=2592000, stale-while-revalidate=86400" } }
    );
  } catch {
    return NextResponse.json({ status: "error", data: [], meta: { total: 0 } }, { status: 502 });
  }
}
