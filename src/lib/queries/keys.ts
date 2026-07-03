export const animeKeys = {
  all: ["anime"] as const,
  stream: (animeId: string, episode: number) => ["anime", "stream", animeId, episode] as const,
  search: (query: string) => ["anime", "search", query] as const,
  meta: (id: string) => ["anime", "meta", id] as const,
  episodes: (id: string) => ["anime", "episodes", id] as const,
  trending: (page: number) => ["anime", "trending", page] as const,
  popular: (page: number) => ["anime", "popular", page] as const,
};
