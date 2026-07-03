"use client";

import { use, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { PageSkeleton, LoadingSpinner } from "@/components/shared/loading-spinner";

interface GenrePageProps {
  params: Promise<{ genre: string }>;
}

interface AnimeItem {
  id: number;
  title: string;
  cover_image: string;
  episodes: number;
  format: string;
  score: number;
  year: number;
  genres: string[];
  status: string;
}

export default function GenrePage({ params }: GenrePageProps) {
  const { genre } = use(params);
  const decoded = decodeURIComponent(genre);
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["genre-data", decoded],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `/api/cached/genre?genre=${encodeURIComponent(decoded)}&page=${pageParam}&per_page=30`
      );
      const json = await res.json();
      return json as {
        status: string;
        data: AnimeItem[];
        meta: { total: number; currentPage: number; lastPage: number; hasNextPage: boolean };
      };
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta.hasNextPage) return undefined;
      return lastPage.meta.currentPage + 1;
    },
    initialPageParam: 1,
    staleTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <PageSkeleton />;

  const allItems = data?.pages.flatMap((p) => (p.status === "success" ? p.data : [])) || [];
  const total = data?.pages[0]?.meta?.total || 0;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{decoded} Anime</h1>
        <p className="text-text-secondary mt-1 text-sm">
          {total.toLocaleString()} titles available
        </p>
      </div>

      {allItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted">
          <p className="text-lg">No anime found for &quot;{decoded}&quot;</p>
          <Link href="/genres" className="text-accent hover:underline mt-2 text-sm">Browse all genres</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {allItems.map((anime) => (
              <Link
                key={`${anime.id}-${anime.title}`}
                href={`/anime/${anime.id}`}
                className="anime-card relative rounded-lg overflow-hidden bg-surface group"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={anime.cover_image}
                    alt={anime.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-sm font-medium line-clamp-2">{anime.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {anime.score > 0 && <span className="text-xs text-yellow-400">⭐ {anime.score}%</span>}
                    <span className="text-xs text-text-secondary">{anime.format}</span>
                    {anime.year > 0 && <span className="text-xs text-text-secondary">{anime.year}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {anime.genres.slice(0, 3).map((g) => (
                      <span key={g} className="text-[10px] bg-surface-raised/80 px-1.5 py-0.5 rounded">{g}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div ref={ref} className="h-10 flex items-center justify-center">
            {isFetchingNextPage && <LoadingSpinner className="py-4" />}
            {!hasNextPage && allItems.length > 0 && (
              <p className="text-text-muted text-sm">All {total.toLocaleString()} titles loaded</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
