import { NextRequest, NextResponse } from "next/server";
import { cacheGet, cacheSet } from "@/lib/disk-cache";

const GRAPHQL = "https://graphql.anilist.co";

const QUERY = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    relations { edges { relationType node { id title { romaji english } coverImage { large } format type } } }
    recommendations(page:1, perPage:7, sort:[RATING_DESC]) { nodes { mediaRecommendation { id title { romaji english } coverImage { large } format } } }
    characters(page:1, perPage:10, sort:[ROLE]) { edges { role node { id name { full } image { large } } voiceActors { id name { full } image { large } languageV2 } } }
  }
}
`;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const cacheKey = `anilist_extra_${id}`;
  const cached = cacheGet<Record<string, unknown>>(cacheKey, 30 * 24 * 60 * 60 * 1000);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { "Cache-Control": "public, s-maxage=2592000, stale-while-revalidate=86400" },
    });
  }

  try {
    const res = await fetch(GRAPHQL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY, variables: { id: parseInt(id) } }),
      signal: AbortSignal.timeout(10000),
    });
    const json = await res.json();

    cacheSet(cacheKey, json);

    return NextResponse.json(json, {
      headers: { "Cache-Control": "public, s-maxage=2592000, stale-while-revalidate=86400" },
    });
  } catch {
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }
}
