export interface StreamResponse {
  status: "success";
  data: {
    video_url: string;
    format: "hls" | "mp4" | "dash" | "embed";
    source: string;
    subtitles: { lang: string; label: string; url: string }[];
    thumbnails: null;
    headers: { Referer: string; Origin: string };
    fallback_used: boolean;
    fallback_attempts: string[];
  };
  meta: { response_time_ms: number; cached: boolean };
}

export interface SearchResult {
  id: number;
  title: string;
  native_title: string | null;
  cover_image: string;
  episodes: number;
  format: string;
  score: number;
  year: number;
  status: string;
}

export interface SearchResponse {
  status: "success";
  data: SearchResult[];
  meta: { query: string; count: number; response_time_ms: number };
}

export interface AnimeTitle {
  romaji: string;
  english: string;
  native: string;
}

export interface AnimeMeta {
  anilist_id: number;
  title: AnimeTitle;
  description: string;
  cover_image: string;
  cover_color: string;
  banner_image: string;
  genres: string[];
  episodes: number;
  duration: number;
  status: string;
  season: string;
  season_year: number;
  score: number;
  format: string;
  studio: string;
  start_date: { year: number; month: number; day: number };
  end_date: { year: number; month: number; day: number };
  next_airing: null;
  trailer: { site: string; id: string } | null;
  tags: string[];
}

export interface AnimeMetaResponse {
  status: "success";
  data: AnimeMeta;
  meta: { response_time_ms: number };
}

export interface EpisodeItem {
  number: number;
  title: string | null;
  aired: boolean;
}

export interface EpisodeListData {
  id: number;
  total: number;
  episodes: EpisodeItem[];
  next_airing: null;
  status: string;
}

export interface EpisodeListResponse {
  status: "success";
  data: EpisodeListData;
  meta: { response_time_ms: number };
}

export interface TrendingAnime {
  id: number;
  title: string;
  cover_image: string;
  episodes: number;
  format: string;
  score: number;
  year: number;
  genres: string[];
  status: string;
  description: string;
}

export interface TrendingResponse {
  status: "success";
  data: TrendingAnime[];
  meta: { page: number; count: number; response_time_ms: number };
}

export interface PopularResponse {
  status: "success";
  data: TrendingAnime[];
  meta: { page: number; count: number; response_time_ms: number };
}

export type AnimeInfo = TrendingAnime;

export interface HealthResponse {
  status: "ok";
  version: string;
  sources: Record<string, { healthy: boolean }>;
  cache_enabled: boolean;
}
