import { NextRequest, NextResponse } from "next/server";
import { cacheGet, cacheSet } from "@/lib/disk-cache";

const ANILIST_API = "https://graphql.anilist.co";

const DISCOVER_QUERY = `
query ($page: Int, $perPage: Int, $sort: [MediaSort], $status: MediaStatus, $format: MediaFormat, $season: MediaSeason, $seasonYear: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo { total currentPage lastPage hasNextPage }
    media(type: ANIME, sort: $sort, status: $status, format: $format, season: $season, seasonYear: $seasonYear) {
      id
      title { romaji english }
      coverImage { large extraLarge }
      bannerImage
      episodes
      duration
      format
      averageScore
      seasonYear
      season
      genres
      status
      studios { nodes { name } }
      description
      nextAiringEpisode { episode airingAt }
      startDate { year month day }
    }
  }
}
`;

interface Params {
  sort: string;
  status: string;
  format: string;
  season: string;
  seasonYear: string;
  page: number;
  perPage: number;
}

function parseParams(req: NextRequest): Params {
  return {
    sort: req.nextUrl.searchParams.get("sort") || "TRENDING_DESC",
    status: req.nextUrl.searchParams.get("status") || "",
    format: req.nextUrl.searchParams.get("format") || "",
    season: req.nextUrl.searchParams.get("season") || "",
    seasonYear: req.nextUrl.searchParams.get("season_year") || "",
    page: parseInt(req.nextUrl.searchParams.get("page") || "1", 10),
    perPage: Math.min(parseInt(req.nextUrl.searchParams.get("per_page") || "20", 10), 50),
  };
}

function makeCacheKey(p: Params): string {
  return `discover_${p.sort}_${p.status}_${p.format}_${p.season}_${p.seasonYear}_p${p.page}_pp${p.perPage}`;
}

function mapMedia(media: Record<string, unknown>[]) {
  return media.map((m) => {
    const title = (m.title as Record<string, string>) || {};
    const cover = (m.coverImage as Record<string, string>) || {};
    return {
      id: m.id,
      title: title.romaji || title.english || "",
      cover_image: cover.extraLarge || cover.large || "",
      banner_image: (m.bannerImage as string) || "",
      episodes: (m.episodes as number) || 0,
      duration: (m.duration as number) || 0,
      format: m.format || "",
      score: (m.averageScore as number) || 0,
      year: (m.seasonYear as number) || 0,
      season: m.season || "",
      genres: (m.genres as string[]) || [],
      status: m.status || "",
      studios: ((m.studios as { nodes?: { name: string }[] })?.nodes || []).map((n: { name: string }) => n.name),
      description: ((m.description as string) || "").replace(/<[^>]*>/g, "").slice(0, 200),
      nextAiring: (m.nextAiringEpisode as { episode?: number; airingAt?: number }) || null,
      startDate: m.startDate || null,
    };
  });
}

const TTL = {
  lists: 30 * 24 * 60 * 60 * 1000,   // 30 days for browse lists
  static: 30 * 24 * 60 * 60 * 1000,  // 30 days for filtered/static data
};

export async function GET(req: NextRequest) {
  const p = parseParams(req);
  const cacheKey = makeCacheKey(p);
  const isStatic = !p.status && !p.format && !p.season;
  const ttl = isStatic ? TTL.static : TTL.lists;

  // 1. Try disk cache
  const cached = cacheGet<{ media: Record<string, unknown>[]; pageInfo: { total: number; hasNextPage: boolean } }>(cacheKey, ttl);
  if (cached) {
    const mapped = mapMedia(cached.media);
    return NextResponse.json(
      { status: "success", data: mapped, meta: { total: cached.pageInfo.total, page: p.page, hasNextPage: cached.pageInfo.hasNextPage } },
      { headers: { "Cache-Control": "public, s-maxage=2592000, stale-while-revalidate=86400" } }
    );
  }

  // 2. Miss — fetch from AniList
  const variables: Record<string, unknown> = { page: p.page, perPage: p.perPage, sort: [p.sort] };
  if (p.status) variables.status = p.status;
  if (p.format) variables.format = p.format;
  if (p.season) variables.season = p.season;
  if (p.seasonYear) variables.seasonYear = parseInt(p.seasonYear, 10);

  try {
    const res = await fetch(ANILIST_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query: DISCOVER_QUERY, variables }),
      signal: AbortSignal.timeout(15000),
    });
    const json = await res.json();
    const media = json.data?.Page?.media || [];
    const pageInfo = json.data?.Page?.pageInfo || { total: 0, hasNextPage: false };

    // Save to disk cache
    cacheSet(cacheKey, { media, pageInfo });

    const mapped = mapMedia(media);
    return NextResponse.json(
      { status: "success", data: mapped, meta: { total: pageInfo.total || 0, page: p.page, hasNextPage: pageInfo.hasNextPage || false } },
      { headers: { "Cache-Control": "public, s-maxage=2592000, stale-while-revalidate=86400" } }
    );
  } catch {
    return NextResponse.json({ status: "error", data: [], meta: { total: 0 } }, { status: 502 });
  }
}
