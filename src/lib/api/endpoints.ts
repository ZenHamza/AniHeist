import { clientApi } from "./client";
import type {
  StreamResponse,
  SearchResponse,
  AnimeMetaResponse,
  EpisodeListResponse,
  TrendingResponse,
  PopularResponse,
} from "@/types/api";

interface StreamParams {
  animeId: string;
  episode: number;
  dub?: boolean;
  quality?: string;
}

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") sp.set(k, String(v));
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const animeApi = {
  getStream: (p: StreamParams): Promise<StreamResponse> =>
    clientApi
      .get(`/api/stream${buildQuery({ anime_id: p.animeId, episode: p.episode, dub: p.dub, quality: p.quality })}`)
      .then((r) => r.data),

  search: (q: string): Promise<SearchResponse> =>
    clientApi.get(`/api/search?q=${encodeURIComponent(q)}`).then((r) => r.data),

  getAnimeMeta: (id: string): Promise<AnimeMetaResponse> =>
    clientApi.get(`/api/anime/${id}`).then((r) => r.data),

  getEpisodes: (id: string): Promise<EpisodeListResponse> =>
    clientApi.get(`/api/anime/${id}/episodes`).then((r) => r.data),

  getTrending: (page = 1, perPage = 20): Promise<TrendingResponse> =>
    clientApi.get(`/api/trending?page=${page}&per_page=${perPage}`).then((r) => r.data),

  getPopular: (page = 1, perPage = 20): Promise<PopularResponse> =>
    clientApi.get(`/api/popular?page=${page}&per_page=${perPage}`).then((r) => r.data),
};
