export const SITE_NAME = "AniHeist";
export const SITE_DOMAIN = "aniheist.com";
export const SITE_URL = "https://aniheist.com";
export const API_BASE_URL = "https://api.aniheist.com";
export const BLOG_URL = "https://blog.aniheist.com";
export const DEV_URL = "https://zenxhamza.xyz";

export const DEFAULT_QUALITY = "auto";
export const DEFAULT_SUBTITLE_LANG = "en";

export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

export const STALE_TIMES = {
  recent: 2 * 60 * 1000,
  detail: 10 * 60 * 1000,
  search: 5 * 60 * 1000,
  stream: 30 * 60 * 1000,
  popular: 15 * 60 * 1000,
  schedule: 30 * 60 * 1000,
} as const;

export const ANIME_GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy",
  "Horror", "Isekai", "Mecha", "Mystery", "Psychological",
  "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural",
  "Thriller", "Mahou Shoujo", "Seinen", "Shoujo", "Shounen",
] as const;

export const ANIME_STATUSES = ["ongoing", "completed", "upcoming", "hiatus"] as const;
export const ANIME_TYPES = ["TV", "Movie", "OVA", "ONA", "Special"] as const;
