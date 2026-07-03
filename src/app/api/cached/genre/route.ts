import { NextRequest, NextResponse } from "next/server";
import { cacheGet, cacheSet } from "@/lib/disk-cache";

const ANILIST_API = "https://graphql.anilist.co";

const SEARCH_QUERY = `
query ($search: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo { total currentPage lastPage hasNextPage }
    media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
      id
      title { romaji english }
      coverImage { large }
      episodes
      format
      averageScore
      seasonYear
      genres
      status
    }
  }
}
`;

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("genre") || "";
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const perPage = Math.min(parseInt(req.nextUrl.searchParams.get("per_page") || "30", 10), 50);

  if (!search) {
    return NextResponse.json({ status: "error", data: [], meta: { total: 0 } }, { status: 400 });
  }

  const cacheKey = `genre_${search.toLowerCase()}_p${page}_pp${perPage}`;
  const cached = cacheGet<{ media: Record<string, unknown>[]; pageInfo: Record<string, unknown> }>(cacheKey, 30 * 24 * 60 * 60 * 1000);
  if (cached) {
    const mapped = mapMedia(cached.media);
    return NextResponse.json(
      { status: "success", data: mapped, meta: { total: cached.pageInfo.total || 0, currentPage: cached.pageInfo.currentPage || page, lastPage: cached.pageInfo.lastPage || 1, hasNextPage: cached.pageInfo.hasNextPage || false } },
      { headers: { "Cache-Control": "public, s-maxage=2592000, stale-while-revalidate=86400" } }
    );
  }

  try {
    const res = await fetch(ANILIST_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query: SEARCH_QUERY, variables: { search, page, perPage } }),
      signal: AbortSignal.timeout(10000),
    });
    const json = await res.json();
    const media = json.data?.Page?.media || [];
    const pageInfo = json.data?.Page?.pageInfo || {};

    cacheSet(cacheKey, { media, pageInfo });

    const mapped = mapMedia(media);
    return NextResponse.json(
      { status: "success", data: mapped, meta: { total: pageInfo.total || 0, currentPage: pageInfo.currentPage || page, lastPage: pageInfo.lastPage || 1, hasNextPage: pageInfo.hasNextPage || false } },
      { headers: { "Cache-Control": "public, s-maxage=2592000, stale-while-revalidate=86400" } }
    );
  } catch {
    return NextResponse.json({ status: "error", data: [], meta: { total: 0 } }, { status: 502 });
  }
}

function mapMedia(media: Record<string, unknown>[]) {
  return media.map((m) => {
    const title = (m.title as Record<string, string>) || {};
    const cover = (m.coverImage as Record<string, string>) || {};
    return {
      id: m.id,
      title: title.romaji || title.english || "",
      cover_image: cover.large || "",
      episodes: (m.episodes as number) || 0,
      format: m.format || "",
      score: (m.averageScore as number) || 0,
      year: (m.seasonYear as number) || 0,
      genres: (m.genres as string[]) || [],
      status: m.status || "",
    };
  });
}
