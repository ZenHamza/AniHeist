"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSearch, FaPlay, FaStar, FaChevronLeft, FaChevronRight, FaChevronDown, FaCalendar, FaListAlt } from "react-icons/fa";
import { PageSkeleton } from "@/components/shared/loading-spinner";
import { AdNative } from "@/components/ads/ad-slot";
import { HeroCarousel } from "@/components/anime/anime-hero";
import { useWatchHistory } from "@/lib/store/watch-history";
import type { AnimeInfo } from "@/types/api";

const GENRES = ["Action","Adventure","Comedy","Drama","Ecchi","Fantasy","Horror","Mahou Shoujo","Mecha","Music","Mystery","Psychological","Romance","Sci-Fi","Slice of Life","Sports","Supernatural","Thriller"];

interface AnimeItem {
  id: number; title: string; cover_image: string; banner_image: string;
  episodes: number; format: string; score: number; year: number;
  genres: string[]; status: string;
  nextAiring?: { episode: number; airingAt: number } | null;
}

function discover(p: string) { return fetch(`/api/cached/discover?${p}`).then(r => r.json()); }

/* ── Grid Card (unchanged) ── */
function GridCard({ anime }: { anime: AnimeItem }) {
  return (
    <Link href={`/anime/${anime.id}`} className="group block outline-none">
      <div className="relative rounded-xl overflow-hidden bg-[#0d0d12] ring-1 ring-white/[0.04] transition-all duration-300 hover:ring-accent/25 hover:shadow-2xl hover:shadow-accent/5 hover:-translate-y-1">
        <div className="aspect-[3/4] overflow-hidden"><img src={anime.cover_image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"><div className="flex items-center gap-2 bg-accent rounded-full px-5 py-2.5 shadow-lg shadow-accent/30"><FaPlay size={11}/><span className="text-white text-xs font-bold">WATCH</span></div></div>
        {anime.score>0&&<div className="absolute top-2.5 left-2.5"><span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-black/80 text-amber-400 text-[11px] font-bold"><FaStar size={9}/>{anime.score}%</span></div>}
        {anime.status==="RELEASING"&&<div className="absolute top-2.5 right-2.5"><span className="inline-flex items-center px-2 py-1 rounded-lg bg-accent text-white text-[10px] font-black uppercase">NEW</span></div>}
      </div>
      <div className="mt-3 space-y-1.5"><h3 className="text-[13px] font-bold leading-tight text-white/90 group-hover:text-accent transition-colors line-clamp-2">{anime.title}</h3><div className="flex items-center gap-2 text-[11px] text-white/35"><span className="uppercase tracking-widest text-[10px]">{anime.format}</span>{anime.year>0&&<><span className="opacity-30">·</span><span>{anime.year}</span></>}{anime.episodes>0&&<><span className="opacity-30">·</span><span>{anime.episodes} ep</span></>}</div></div>
    </Link>
  );
}

/* ── Compact horizontal card ── */
function CompactCard({ anime }: { anime: AnimeItem }) {
  return (
    <Link href={`/anime/${anime.id}`} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] group block outline-none">
      <div className="relative rounded-xl overflow-hidden ring-1 ring-white/[0.04] transition-all duration-300 hover:ring-accent/25 hover:shadow-xl hover:-translate-y-0.5"><div className="aspect-[3/4] overflow-hidden"><img src={anime.cover_image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" /></div><div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><FaPlay size={18} className="text-white" /></div>{anime.score>0&&<div className="absolute top-2 left-2"><span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/80 text-amber-400 text-[10px] font-bold"><FaStar size={7}/>{anime.score}%</span></div>}</div>
      <div className="mt-2"><h3 className="text-[11px] sm:text-xs font-semibold leading-tight text-white/85 group-hover:text-accent transition-colors line-clamp-2">{anime.title}</h3><div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-white/30"><span>{anime.year||anime.format}</span>{anime.episodes>0&&<span>{anime.episodes}ep</span>}</div></div>
    </Link>
  );
}

/* ── Wide Entry Card (493x96 Miruro proportions) ── */
function WideEntryCard({ anime, progress }: { anime: AnimeItem; progress?: boolean }) {
  const statusKey = anime.status === "RELEASING" ? "ongoing" : anime.status === "NOT_YET_RELEASED" ? "upcoming" : "default";
  const epLabel = anime.status === "RELEASING" && anime.nextAiring
    ? `${anime.nextAiring.episode} / ${anime.episodes || "?"}`
    : `${anime.episodes || 0}`;

  return (
    <Link href={`/anime/${anime.id}`} className="group block">
      <div className="flex items-stretch gap-3 sm:gap-4 h-24 rounded-xl overflow-hidden bg-[#0d0d12] ring-1 ring-white/[0.04] transition-all duration-300 hover:ring-accent/25 hover:shadow-lg hover:-translate-y-0.5">
        {/* Banner background */}
        <div className="relative w-full flex">
          {anime.banner_image && (
            <div className="absolute inset-0">
              <img src={anime.banner_image} alt="" className="w-full h-full object-cover opacity-20" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d12] via-[#0d0d12]/70 to-transparent" />
            </div>
          )}
          {/* Cover */}
          <div className="relative z-10 shrink-0 w-[68px] sm:w-[72px] h-full flex items-center justify-center pl-3 sm:pl-4">
            <img src={anime.cover_image} alt="" className="w-[50px] sm:w-[56px] h-[70px] sm:h-[78px] rounded-lg object-cover ring-1 ring-white/5 shadow-lg" loading="lazy" />
          </div>
          {/* Details */}
          <div className="relative z-10 flex-1 min-w-0 flex flex-col justify-center px-3 sm:px-4 py-2">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusKey==="ongoing"?"bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.4)]":statusKey==="upcoming"?"bg-slate-500":"bg-amber-400"}`} />
              <h4 className="text-[13px] sm:text-sm font-bold leading-snug text-white/90 group-hover:text-accent transition-colors line-clamp-2 truncate">{anime.title}</h4>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-white/35 font-medium">
              <span className="uppercase tracking-wider">{anime.format}</span>
              <span className="flex items-center gap-1"><FaCalendar size={9}/>{anime.year}</span>
              {(progress || anime.status === "RELEASING") && (
                <span className="flex items-center gap-1"><FaListAlt size={9}/>{epLabel}</span>
              )}
            </div>
          </div>
          {/* Score */}
          {anime.score > 0 && (
            <div className="relative z-10 shrink-0 flex items-center pr-4 sm:pr-5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/50 text-amber-400 text-xs font-bold"><FaStar size={10}/>{anime.score}%</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ── Schedule Row ── */
function ScheduleRow({ anime }: { anime: AnimeItem }) {
  return (
    <Link href={`/watch/${anime.id}/${anime.nextAiring!.episode||1}`} className="flex items-center gap-3 sm:gap-4 group p-2.5 -mx-2.5 rounded-xl hover:bg-white/[0.03] transition-colors">
      <span className="text-xs text-white/25 w-12 shrink-0 font-mono font-medium">{new Date(anime.nextAiring!.airingAt!*1000).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
      <img src={anime.cover_image} alt="" className="w-10 sm:w-12 h-14 sm:h-16 rounded-lg object-cover ring-1 ring-white/[0.04] shrink-0" loading="lazy" />
      <span className="flex-1 text-[13px] sm:text-sm font-bold text-white/85 group-hover:text-accent transition-colors truncate">{anime.title}</span>
      <span className="text-[11px] sm:text-xs text-accent/70 font-bold shrink-0">EP {anime.nextAiring!.episode}</span>
    </Link>
  );
}

/* ── Pagination ── */
function Pagination({ page, setPage, hasNext }: { page: number; setPage: (n: number) => void; hasNext: boolean }) {
  if (!hasNext && page <= 1) return null;
  const pages: number[] = [];
  const s = Math.max(1, page - 1);
  const e = hasNext ? page + 1 : page;
  for (let i = s; i <= e; i++) pages.push(i);
  return (
    <div className="flex items-center justify-center gap-1 pt-6">
      <button onClick={() => setPage(page-1)} disabled={page<=1} className="p-2 rounded-lg text-white/20 hover:text-white hover:bg-white/[0.04] disabled:opacity-10 disabled:cursor-not-allowed"><FaChevronLeft size={13}/></button>
      {pages.map(p=><button key={p} onClick={()=>setPage(p)} className={`min-w-[36px] h-9 rounded-lg text-xs font-bold transition-all ${p===page?"bg-accent text-white shadow-lg shadow-accent/20":"text-white/25 hover:text-white hover:bg-white/[0.04]"}`}>{p}</button>)}
      <button onClick={() => setPage(page+1)} disabled={!hasNext} className="p-2 rounded-lg text-white/20 hover:text-white hover:bg-white/[0.04] disabled:opacity-10 disabled:cursor-not-allowed"><FaChevronRight size={13}/></button>
    </div>
  );
}

/* ═══════════ PAGE ═══════════ */
export default function HomePage() {
  const [tab, setTab] = useState<"newest"|"popular"|"top">("newest");
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [showMoreAiring, setShowMoreAiring] = useState(false);
  const [showMoreUpcoming, setShowMoreUpcoming] = useState(false);
  const router = useRouter();
  const perPage = 30;
  const history = useWatchHistory((s) => s.history);
  const continueWatching = useMemo(() => {
    return history
      .filter((e) => e.duration === 0 || e.progress < e.duration * 0.9)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20);
  }, [history]);
  const { data: trendingData } = useQuery({
    queryKey:["home","trending-hero"],
    queryFn:()=>fetch("/api/cached/trending?per_page=8").then(r=>r.json()),
    staleTime:24*60*60*1000,
  });
  const { data: mainData, isLoading } = useQuery({
    queryKey: ["home", tab, page],
    queryFn: () => {
      switch (tab) {
        case "newest": return fetch(`/api/cached/newest?page=${page}&per_page=${perPage}`).then(r => r.json());
        case "popular": return fetch(`/api/cached/popular?page=${page}&per_page=${perPage}`).then(r => r.json());
        case "top": return fetch(`/api/cached/top-rated?page=${page}&per_page=${perPage}`).then(r => r.json());
      }
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
  const { data: airing } = useQuery({ queryKey:["home","airing"], queryFn:()=>fetch("/api/cached/recent?per_page=16").then(r=>r.json()), staleTime:24*60*60*1000 });
  const { data: finished } = useQuery({ queryKey:["home","finished"], queryFn:()=>discover("sort=SCORE_DESC&status=FINISHED&per_page=10"), staleTime:24*60*60*1000 });
  const { data: movies } = useQuery({ queryKey:["home","movies"], queryFn:()=>discover("sort=SCORE_DESC&format=MOVIE&per_page=8"), staleTime:24*60*60*1000 });
  const { data: upcoming } = useQuery({ queryKey:["home","upcoming"], queryFn:()=>discover("sort=POPULARITY_DESC&status=NOT_YET_RELEASED&per_page=8"), staleTime:24*60*60*1000 });

  if (isLoading) return <PageSkeleton />;
  const trending:AnimeInfo[] = (trendingData as any)?.status==="success"?(trendingData as any).data:[];
  const main:AnimeItem[] = mainData?.status==="success"?mainData.data:[];
  const air:AnimeItem[] = (airing as any)?.status==="success"?(airing as any).data:[];
  const fin:AnimeItem[] = (finished as any)?.status==="success"?(finished as any).data:[];
  const mov:AnimeItem[] = (movies as any)?.status==="success"?(movies as any).data:[];
  const up:AnimeItem[] = (upcoming as any)?.status==="success"?(upcoming as any).data:[];
  const hasNext = mainData?.meta?.hasNextPage ?? main.length >= perPage;

  const topAiring = air.filter(a=>a.status==="RELEASING");
  const scheduleItems = air.filter(a=>a.nextAiring).sort((a,b)=>(a.nextAiring!.airingAt||0)-(b.nextAiring!.airingAt||0));

  return (
    <div className="min-h-screen bg-[#070708]">
      {/* ═══ HERO CAROUSEL ═══ */}
      {trending.length > 0 && <HeroCarousel items={trending} />}

      {/* ═══ SEARCH + GENRES ═══ */}
      <section className="border-b border-white/[0.04]">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-8 sm:py-10 flex flex-col items-center text-center">
          <form onSubmit={e=>{e.preventDefault();if(q.trim())router.push(`/search?q=${encodeURIComponent(q.trim())}`)}} className="w-full max-w-xl mb-6">
            <div className="relative group"><div className="absolute -inset-0.5 bg-gradient-to-r from-accent/40 to-accent/10 rounded-full blur opacity-0 group-focus-within:opacity-100 transition duration-500" /><div className="relative"><input type="text" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search for any anime..." className="w-full bg-white/[0.04] border border-white/[0.06] rounded-full py-3.5 pl-12 pr-6 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent/30 transition-all" /><FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-white/20" /></div></div>
          </form>
          <div className="flex flex-wrap justify-center gap-1.5 max-w-3xl">{GENRES.map(g=>(<Link key={g} href={`/genre/${encodeURIComponent(g)}`}><span className="inline-block px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.04] text-[11px] text-white/40 hover:text-white hover:border-accent/40 hover:bg-accent/5 transition-all cursor-pointer">{g}</span></Link>))}</div>
        </div>
      </section>

      {/* ═══ CONTENT ═══ */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 space-y-14 sm:space-y-16 pt-10 sm:pt-14 pb-12">

        {/* ── Grid ── */}
        <section className="space-y-5">
          <div className="flex items-center gap-1 bg-white/[0.02] p-1 rounded-xl w-fit border border-white/[0.03]">
            {(["newest","popular","top"] as const).map(t=>(<button key={t} onClick={()=>{setTab(t);setPage(1)}} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${tab===t?"bg-accent text-white shadow-lg shadow-accent/20":"text-white/30 hover:text-white/70"}`}>{t==="newest"?"Newest":t==="popular"?"Popular":"Top Rated"}</button>))}
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">{main.map(a=><GridCard key={a.id} anime={a} />)}</div>
          <Pagination page={page} setPage={setPage} hasNext={hasNext} />
        </section>

        {/* ── Continue Watching ── */}
        {continueWatching.length > 0 && (
          <section>
            <h2 className="text-base font-black text-white/80 uppercase tracking-[0.1em] mb-5">Continue Watching</h2>
            <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 sm:-mx-6 px-4 sm:px-6 scrollbar-none snap-x">
              {continueWatching.map((entry) => {
                const pct = entry.duration > 0 ? Math.round((entry.progress / entry.duration) * 100) : 0;
                return (
                  <Link key={entry.episodeId} href={`/watch/${entry.animeId}/${entry.episodeNumber}`} className="flex-shrink-0 w-[150px] sm:w-[170px] group block outline-none">
                    <div className="relative rounded-xl overflow-hidden ring-1 ring-white/[0.04] transition-all duration-300 group-hover:ring-accent/25 group-hover:shadow-xl group-hover:-translate-y-0.5">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img src={entry.animeImage || `https://img.anili.st/media/${entry.animeId}`} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <FaPlay size={18} className="text-white" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
                        <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="px-1.5 py-0.5 rounded bg-black/80 text-white/80 text-[10px] font-bold">EP {entry.episodeNumber}</span>
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <span className="text-[10px] text-white/60 font-medium">{pct}%</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-[11px] sm:text-xs font-semibold leading-tight text-white/85 group-hover:text-accent transition-colors line-clamp-2">{entry.animeTitle}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Ad Banner ── */}
        <AdNative className="py-4" />

        {/* ── Just Finished ── */}
        {fin.length>0&&(
          <section>
            <h2 className="text-base font-black text-white/80 uppercase tracking-[0.1em] mb-5">Just Finished</h2>
            <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 sm:-mx-6 px-4 sm:px-6 scrollbar-none snap-x">{fin.map(a=><CompactCard key={a.id} anime={a} />)}</div>
          </section>
        )}

        {/* ── Top Movies ── */}
        {mov.length>0&&(
          <section>
            <h2 className="text-base font-black text-white/80 uppercase tracking-[0.1em] mb-5">Top Movies</h2>
            <div className="flex gap-3 overflow-x-auto pb-3 -mx-4 sm:-mx-6 px-4 sm:px-6 scrollbar-none snap-x">{mov.map(a=><CompactCard key={a.id} anime={a} />)}</div>
          </section>
        )}

        {/* ── Airing Schedule (1054x464 proportions) ── */}
        {scheduleItems.length>0&&(
          <section>
            <div className="flex items-center gap-2 mb-5">
              <h2 className="text-base font-black text-white/80 uppercase tracking-[0.1em]">Airing Schedule</h2>
              <span className="text-[10px] text-white/20 font-medium">Estimated</span>
            </div>
            <div className="bg-[#0d0d12] ring-1 ring-white/[0.04] rounded-xl p-4 sm:p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5">
                {scheduleItems.slice(0,15).map(a=><ScheduleRow key={a.id} anime={a} />)}
              </div>
              {scheduleItems.length>15&&(
                <div className="text-center pt-3 mt-3 border-t border-white/[0.04]">
                  <Link href="/schedule" className="text-xs text-accent/70 hover:text-accent transition-colors font-medium">View Full Schedule</Link>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Top Airing ║ Upcoming (519x631 widget, 493x96 per entry) ── */}
        {(topAiring.length>0||up.length>0) && (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-base font-black text-white/80 uppercase tracking-[0.1em] mb-4">Top Airing</h2>
                <div className="bg-[#0d0d12] ring-1 ring-white/[0.04] rounded-xl p-3 space-y-2">
                  {topAiring.slice(0, showMoreAiring ? topAiring.length : 5).map(a=><WideEntryCard key={a.id} anime={a} progress />)}
                  {topAiring.length>5&&(
                    <button onClick={()=>setShowMoreAiring(!showMoreAiring)} className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] text-white/25 hover:text-white/60 transition-colors font-medium">{showMoreAiring?"Show Less":`Show ${topAiring.length-5} More`}<FaChevronDown size={10} className={`transition-transform ${showMoreAiring?"rotate-180":""}`}/></button>
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-base font-black text-white/80 uppercase tracking-[0.1em] mb-4">Upcoming</h2>
                <div className="bg-[#0d0d12] ring-1 ring-white/[0.04] rounded-xl p-3 space-y-2">
                  {up.slice(0, showMoreUpcoming ? up.length : 4).map(a=><WideEntryCard key={a.id} anime={a} />)}
                  {up.length>4&&(
                    <button onClick={()=>setShowMoreUpcoming(!showMoreUpcoming)} className="w-full flex items-center justify-center gap-1 py-1.5 text-[10px] text-white/25 hover:text-white/60 transition-colors font-medium">{showMoreUpcoming?"Show Less":`Show ${up.length-4} More`}<FaChevronDown size={10} className={`transition-transform ${showMoreUpcoming?"rotate-180":""}`}/></button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
