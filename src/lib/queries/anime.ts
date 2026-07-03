import { queryOptions } from "@tanstack/react-query";
import { animeApi } from "@/lib/api/endpoints";
import { animeKeys } from "./keys";

export const animeQueries = {
  stream: (animeId: string, episode: number) =>
    queryOptions({
      queryKey: animeKeys.stream(animeId, episode),
      queryFn: () => animeApi.getStream({ animeId, episode }),
      staleTime: 10 * 60 * 1000,
      enabled: !!animeId && episode > 0,
      retry: 1,
    }),

  search: (query: string) =>
    queryOptions({
      queryKey: animeKeys.search(query),
      queryFn: () => animeApi.search(query),
      staleTime: 5 * 60 * 1000,
      enabled: query.length > 1,
    }),

  meta: (id: string) =>
    queryOptions({
      queryKey: animeKeys.meta(id),
      queryFn: () => animeApi.getAnimeMeta(id),
      staleTime: 15 * 60 * 1000,
      enabled: !!id,
    }),

  episodes: (id: string) =>
    queryOptions({
      queryKey: animeKeys.episodes(id),
      queryFn: () => animeApi.getEpisodes(id),
      staleTime: 10 * 60 * 1000,
      enabled: !!id,
    }),

  trending: (page = 1) =>
    queryOptions({
      queryKey: animeKeys.trending(page),
      queryFn: () => animeApi.getTrending(page),
      staleTime: 5 * 60 * 1000,
    }),

  popular: (page = 1) =>
    queryOptions({
      queryKey: animeKeys.popular(page),
      queryFn: () => animeApi.getPopular(page),
      staleTime: 15 * 60 * 1000,
    }),
};
