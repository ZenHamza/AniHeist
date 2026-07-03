"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimeGrid } from "@/components/anime/anime-grid";
import { PageSkeleton } from "@/components/shared/loading-spinner";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { TrendingAnime } from "@/types/api";

function Pagination({ page, setPage, hasNext }: { page: number; setPage: (n: number) => void; hasNext: boolean }) {
  const pages = []; const s = Math.max(1, page - 2);
  for (let i = s; i <= page + 2; i++) pages.push(i);
  return (
    <div className="flex items-center justify-center gap-1 pt-6">
      <button onClick={() => setPage(page-1)} disabled={page<=1} className="p-2 rounded-lg text-white/20 hover:text-white hover:bg-white/[0.04] disabled:opacity-10 disabled:cursor-not-allowed"><FaChevronLeft size={13}/></button>
      {pages.map(p=><button key={p} onClick={()=>setPage(p)} className={`min-w-[36px] h-9 rounded-lg text-xs font-bold transition-all ${p===page?"bg-accent text-white shadow-lg shadow-accent/20":"text-white/25 hover:text-white hover:bg-white/[0.04]"}`}>{p}</button>)}
      <button onClick={() => setPage(page+1)} disabled={!hasNext} className="p-2 rounded-lg text-white/20 hover:text-white hover:bg-white/[0.04] disabled:opacity-10 disabled:cursor-not-allowed"><FaChevronRight size={13}/></button>
    </div>
  );
}

export default function RecentPage() {
  const [page, setPage] = useState(1);
  const perPage = 30;
  const { data, isLoading } = useQuery({
    queryKey: ["recent", page],
    queryFn: async () => {
      const res = await fetch(`/api/cached/recent?page=${page}&per_page=${perPage}`);
      const json = await res.json();
      return (json.status === "success" ? json.data : []) as TrendingAnime[];
    },
    staleTime: 2 * 60 * 1000,
  });

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Recent Releases</h1>
        <p className="text-text-secondary mt-1 text-sm">Currently airing anime <span className="text-white/20">· Page {page}</span></p>
      </div>
      <AnimeGrid items={data || []} variant="grid" />
      <Pagination page={page} setPage={setPage} hasNext={(data?.length ?? 0) >= perPage} />
    </div>
  );
}
