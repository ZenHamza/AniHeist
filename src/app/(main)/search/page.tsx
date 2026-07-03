"use client";

import { useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaPlay, FaStar, FaSearch } from "react-icons/fa";

const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy",
  "Horror", "Mahou Shoujo", "Mecha", "Music", "Mystery",
  "Psychological", "Romance", "Sci-Fi", "Slice of Life",
  "Sports", "Supernatural", "Thriller",
] as const;

const SEASONS = ["", "Winter", "Spring", "Summer", "Fall"] as const;
const FORMATS = ["", "TV", "TV_SHORT", "OVA", "ONA", "MOVIE", "SPECIAL", "MUSIC"] as const;
const STATUSES = ["", "RELEASING", "NOT_YET_RELEASED", "FINISHED", "CANCELLED", "HIATUS"] as const;
const SORT_OPTIONS = [
  { value: "POPULARITY_DESC", label: "Popularity" },
  { value: "SCORE_DESC", label: "Score" },
  { value: "TRENDING_DESC", label: "Trending" },
  { value: "START_DATE_DESC", label: "Latest" },
  { value: "START_DATE_ASC", label: "Oldest" },
] as const;

const CURRENT_YEAR = new Date().getFullYear();

interface CardData {
  id: number;
  title: string;
  cover_image: string;
  format: string;
  score: number;
  year: number;
  status?: string;
  genres?: string[];
  episodes?: number;
}

function SearchSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-48 bg-surface rounded-lg" />
      <div className="h-11 w-full bg-surface rounded-lg" />
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-surface rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-surface rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const query = searchParams.get("q") || "";
  const selectedGenres = searchParams.getAll("genres");
  const year = searchParams.get("year") || "";
  const season = searchParams.get("season") || "";
  const format = searchParams.get("format") || "";
  const status = searchParams.get("status") || "";
  const sort = searchParams.get("sort") || "POPULARITY_DESC";

  const hasAdvancedFilters = selectedGenres.length > 0 || !!year || !!season || !!format || !!status;
  const useDiscover = hasAdvancedFilters || !query;

  const buildParams = useCallback((updates: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      params.delete(key);
      if (value === null) continue;
      if (Array.isArray(value)) {
        for (const v of value) params.append(key, v);
      } else {
        params.set(key, value);
      }
    }
    for (const [key, value] of [...params.entries()]) {
      if (value === "") params.delete(key);
    }
    return params.toString();
  }, [searchParams]);

  const updateURL = useCallback((updates: Record<string, string | string[] | null>) => {
    router.push(`/search?${buildParams(updates)}`);
  }, [router, buildParams]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const val = inputRef.current?.value || "";
    updateURL({ q: val || null });
  }, [updateURL]);

  const toggleGenre = useCallback((genre: string) => {
    const current = [...selectedGenres];
    const idx = current.indexOf(genre);
    if (idx >= 0) current.splice(idx, 1);
    else current.push(genre);
    updateURL({ genres: current.length > 0 ? current : null });
  }, [selectedGenres, updateURL]);

  const setFilter = useCallback((key: string, value: string) => {
    updateURL({ [key]: value || null });
  }, [updateURL]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", query, selectedGenres, year, season, format, status, sort],
    queryFn: async () => {
      if (useDiscover) {
        const params = new URLSearchParams();
        if (sort) params.set("sort", sort);
        if (status) params.set("status", status);
        if (format) params.set("format", format);
        if (season) params.set("season", season);
        if (year) params.set("season_year", year);
        for (const g of selectedGenres) params.append("genres", g);
        params.set("per_page", "30");
        const res = await fetch(`/api/cached/discover?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        return (json.status === "success" ? json.data : []) as CardData[];
      }
      const res = await fetch(`/api/cached/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (!text) throw new Error("Empty response");
      const json = JSON.parse(text);
      return (json.status === "success" ? json.data : []) as CardData[];
    },
    enabled: useDiscover || query.length > 1,
    staleTime: 5 * 60 * 1000,
  });

  const results = data || [];
  const showEmpty = !query && !hasAdvancedFilters;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {query && !useDiscover ? `Search: "${query}"` : "Search Anime"}
        </h1>
        {results.length > 0 && (
          <p className="text-text-secondary mt-1 text-sm">{results.length} results found</p>
        )}
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          defaultValue={query}
          placeholder="Search anime..."
          className="flex-1 bg-surface border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 transition-colors"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-accent hover:bg-accent/90 rounded-lg text-white text-sm font-medium transition-colors flex items-center gap-2 shrink-0"
        >
          <FaSearch size={14} />
          Search
        </button>
      </form>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {GENRES.map((genre) => {
            const active = selectedGenres.includes(genre);
            return (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  active
                    ? "bg-accent text-white shadow-lg shadow-accent/20"
                    : "bg-surface text-white/50 hover:text-white hover:bg-surface-hover border border-white/5"
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={year}
            onChange={(e) => setFilter("year", e.target.value)}
            className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 focus:outline-none focus:border-accent/50 appearance-none cursor-pointer"
          >
            <option value="">Year</option>
            {Array.from({ length: CURRENT_YEAR - 1940 + 2 }, (_, i) => CURRENT_YEAR + 1 - i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select
            value={season}
            onChange={(e) => setFilter("season", e.target.value)}
            className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 focus:outline-none focus:border-accent/50 appearance-none cursor-pointer"
          >
            <option value="">Season</option>
            {SEASONS.filter(Boolean).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={format}
            onChange={(e) => setFilter("format", e.target.value)}
            className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 focus:outline-none focus:border-accent/50 appearance-none cursor-pointer"
          >
            <option value="">Format</option>
            {FORMATS.filter(Boolean).map((f) => (
              <option key={f} value={f}>
                {f === "TV_SHORT" ? "TV Short" : f.charAt(0) + f.slice(1).toLowerCase()}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setFilter("status", e.target.value)}
            className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 focus:outline-none focus:border-accent/50 appearance-none cursor-pointer"
          >
            <option value="">Status</option>
            {STATUSES.filter(Boolean).map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setFilter("sort", e.target.value)}
            className="bg-surface border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 focus:outline-none focus:border-accent/50 appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <SearchSkeleton />}

      {!isLoading && error && (
        <div className="flex items-center justify-center py-20 text-text-muted">
          <p>Search failed. Please try again.</p>
        </div>
      )}

      {!isLoading && !error && showEmpty && (
        <div className="flex items-center justify-center py-20 text-text-muted">
          <p>Enter a search term or apply filters to discover anime.</p>
        </div>
      )}

      {!isLoading && !error && !showEmpty && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted">
          <p className="text-lg">No results found{query ? ` for "${query}"` : ""}</p>
          <p className="text-sm mt-1">Try different search terms or filters.</p>
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
                    {anime.score > 0 && (
                      <span className="flex items-center gap-0.5 text-amber-400">
                        <FaStar size={9} />{anime.score}%
                      </span>
                    )}
                    {anime.format && <span>{anime.format}</span>}
                    {anime.year > 0 && <span>{anime.year}</span>}
                    {anime.status && (
                      <span className="capitalize">
                        {anime.status.replace(/_/g, " ").toLowerCase()}
                      </span>
                    )}
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
