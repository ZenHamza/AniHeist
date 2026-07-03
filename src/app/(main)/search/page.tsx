"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaPlay, FaStar } from "react-icons/fa";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import type { SearchResult } from "@/types/api";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const res = await fetch(`/api/cached/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (!text) throw new Error("Empty response");
      return JSON.parse(text) as { status: string; data: SearchResult[]; meta: { query: string; count: number; response_time_ms: number } };
    },
    enabled: query.length > 1,
    staleTime: 5 * 60 * 1000,
  });

  const results = data?.status === "success" ? data.data : [];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{query ? `Search: "${query}"` : "Search Anime"}</h1>
        {results.length > 0 && (
          <p className="text-text-secondary mt-1 text-sm">
            {results.length} results found
            {data?.meta?.response_time_ms && <span className="text-text-muted ml-2">in {data.meta.response_time_ms}ms</span>}
          </p>
        )}
      </div>
      {!query && <div className="flex items-center justify-center py-20 text-text-muted"><p>Enter a search term to find anime.</p></div>}
      {isLoading && <LoadingSpinner />}
      {error && <div className="flex items-center justify-center py-20 text-text-muted"><p>Search failed. Please try again.</p></div>}
      {!isLoading && !error && query && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted">
          <p className="text-lg">No results found for &quot;{query}&quot;</p>
          <p className="text-sm mt-1">Try a different search term.</p>
        </div>
      )}
      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {results.map((anime) => {
            const cover = anime.cover_image || `https://img.anili.st/media/${anime.id}`;
            return (
              <Link key={anime.id} href={`/anime/${anime.id}`} className="group">
                <div className="relative rounded-xl overflow-hidden bg-surface ring-1 ring-white/5 group-hover:ring-accent/30 transition-all shadow-lg shadow-black/20">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={cover} alt={anime.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center justify-center size-12 rounded-full bg-accent/90 shadow-lg shadow-accent/30">
                      <FaPlay size={16} className="text-white ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="mt-2 space-y-0.5">
                  <h3 className="text-xs font-medium text-white/80 group-hover:text-accent transition-colors line-clamp-2 leading-snug">{anime.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-white/30">
                    {anime.score > 0 && <span className="flex items-center gap-0.5 text-amber-400"><FaStar size={9} />{anime.score}%</span>}
                    <span>{anime.format}</span>
                    {anime.year > 0 && <span>{anime.year}</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
