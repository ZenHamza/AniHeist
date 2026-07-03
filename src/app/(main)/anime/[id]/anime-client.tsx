"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaPlay, FaStar, FaHeart, FaExternalLinkAlt } from "react-icons/fa";
import { PageSkeleton } from "@/components/shared/loading-spinner";
import { EpisodeList } from "@/components/anime/episode-list";

interface AnimeDetail {
  anilist_id: number; title: { romaji: string; english: string; native: string };
  description: string; cover_image: string; banner_image: string;
  genres: string[]; episodes: number; duration: number; status: string;
  season: string; season_year: number; score: number; format: string;
  studio: string; tags: string[]; trailer: { site: string; id: string } | null;
}

interface ExtraData {
  data: {
    Media: {
      relations: { edges: { relationType: string; node: { id: number; title: { romaji: string; english: string; } } }[] };
      recommendations: { nodes: { mediaRecommendation: { id: number; title: { romaji: string; english: string } } }[] };
      characters: { edges: { role: string; node: { id: number; name: { full: string }; image: { large: string } }; voiceActors: { id: number; name: { full: string }; image: { large: string }; languageV2: string }[] }[] };
    }
  };
}

export function AnimePageClient({ animeId }: { animeId: string }) {
  const { data: meta, isLoading, error } = useQuery({
    queryKey: ["anime", animeId],
    queryFn: async () => {
      const r = await fetch(`/api/cached/anime/${animeId}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const text = await r.text();
      if (!text) throw new Error("Empty response");
      const d = JSON.parse(text);
      if (d.status !== "success") throw new Error(d.error?.message || "Not found");
      return d.data as AnimeDetail;
    },
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });

  const { data: extra } = useQuery({
    queryKey: ["anilist-extra", animeId],
    queryFn: async () => {
      const r = await fetch(`/api/anilist/extra/${animeId}`);
      if (!r.ok) return { data: { Media: null } };
      const text = await r.text();
      if (!text) return { data: { Media: null } };
      return JSON.parse(text) as ExtraData;
    },
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });

  const { data: epData } = useQuery({
    queryKey: ["episodes", animeId],
    queryFn: async () => {
      const r = await fetch(`/api/cached/anime/${animeId}/episodes`);
      if (!r.ok) return null;
      const text = await r.text();
      if (!text) return null;
      const d = JSON.parse(text);
      return d.status === "success" ? d.data : null;
    },
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });

  if (isLoading) return <PageSkeleton />;
  if (error || !meta) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-20 text-center">
        <p className="text-red-400 text-lg font-semibold">Anime not found</p>
        <p className="text-white/30 text-sm mt-1">This anime ID doesn&apos;t exist or isn&apos;t available on AniList. Try searching by name instead.</p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Link href="/" className="px-6 py-2.5 bg-accent rounded-lg text-white text-sm font-medium hover:bg-accent-hover transition-colors">Go Home</Link>
          <Link href="/search" className="px-6 py-2.5 bg-white/[0.05] border border-white/[0.06] rounded-lg text-white/60 text-sm font-medium hover:text-white transition-colors">Search Anime</Link>
        </div>
      </div>
    );
  }

  const media = extra?.data?.Media;
  const chars = media?.characters?.edges || [];
  const recs = media?.recommendations?.nodes || [];
  const relations = media?.relations?.edges || [];

  function cleanHtml(h: string) { return h.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim(); }

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden">
        {meta.banner_image && (
          <div className="absolute inset-0">
            <img src={meta.banner_image} alt="" className="w-full h-full object-cover blur-sm opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-[#070708]/80 to-transparent" />
          </div>
        )}
        <div className="relative z-10 flex flex-col sm:flex-row gap-6 p-6 sm:p-10">
          <img src={meta.cover_image} alt={meta.title.romaji} className="w-48 sm:w-60 rounded-xl shadow-2xl ring-1 ring-white/5 shrink-0 mx-auto sm:mx-0" />
          <div className="flex-1 space-y-3 text-center sm:text-left">
            <h1 className="text-2xl sm:text-4xl font-black leading-tight">{meta.title.romaji || meta.title.english}</h1>
            {meta.title.english && <p className="text-white/40 text-sm -mt-1">{meta.title.english}</p>}
            {meta.title.native && <p className="text-white/20 text-xs">{meta.title.native}</p>}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
              {meta.score > 0 && <span className="flex items-center gap-1 text-amber-400 font-bold"><FaStar size={11} />{meta.score}%</span>}
              <span className="px-2.5 py-0.5 rounded bg-white/5 text-white/50 uppercase font-medium">{meta.status?.replace(/_/g, " ")}</span>
              <span className="px-2.5 py-0.5 rounded bg-white/5 text-white/50">{meta.format}</span>
              {meta.season_year > 0 && <span className="text-white/30">{meta.season_year}</span>}
              {meta.episodes > 0 && <span className="text-white/30">{meta.episodes} episodes</span>}
              {meta.duration > 0 && <span className="text-white/30">{meta.duration} min</span>}
              {meta.studio && <span className="text-white/30">{meta.studio}</span>}
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 pt-1">
              {meta.genres.map(g => (
                <Link key={g} href={`/genre/${encodeURIComponent(g)}`}><span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-[11px] font-medium hover:bg-accent/20 transition-colors cursor-pointer">{g}</span></Link>
              ))}
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-2xl pt-2">{cleanHtml(meta.description).slice(0, 500)}</p>
            <Link href={`/watch/${animeId}/1`} className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover rounded-xl text-white font-bold transition-all"><FaPlay size={13} /> Watch Now</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Episodes */}
          {epData?.episodes && (
            <section>
              <h2 className="text-lg font-bold text-white/80 mb-4">Episodes <span className="text-white/20 text-sm font-normal ml-1">{epData.total}</span></h2>
              <EpisodeList episodes={epData.episodes} animeId={animeId} />
            </section>
          )}

          {/* Recommendations */}
          {recs.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-[0.1em] mb-4 flex items-center gap-2"><FaPlay size={10} className="text-accent rotate-0" /> Recommendations</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x scrollbar-none scroll-smooth" style={{ scrollbarWidth: 'none' }}>
                {recs.map((r: unknown) => {
                  const rec = (r as { mediaRecommendation: { id: number; title: { romaji?: string; english?: string }; coverImage?: { large?: string } } }).mediaRecommendation;
                  const cover = rec.coverImage?.large || `https://img.anili.st/media/${rec.id}`;
                  return (
                    <Link key={rec.id} href={`/anime/${rec.id}`} className="flex-shrink-0 w-40 group">
                      <div className="relative rounded-xl overflow-hidden bg-surface ring-1 ring-white/5 group-hover:ring-accent/30 transition-all shadow-lg shadow-black/20">
                        <div className="aspect-[3/4] overflow-hidden">
                          <img src={cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex items-center justify-center size-12 rounded-full bg-accent/90 shadow-lg shadow-accent/30">
                            <FaPlay size={16} className="text-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <p className="text-xs font-medium text-white/60 group-hover:text-accent transition-colors mt-2 line-clamp-2 leading-snug">{rec.title?.romaji || rec.title?.english || ""}</p>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Relations */}
          {relations.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-[0.1em] mb-4 flex items-center gap-2"><FaPlay size={10} className="text-accent" /> Related</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                {relations.map((rel: unknown) => {
                  const r = (rel as { relationType: string; node: { id: number; title: { romaji?: string; english?: string }; coverImage?: { large?: string } } }).node;
                  const rt = (rel as { relationType: string }).relationType;
                  const cover = r.coverImage?.large || `https://img.anili.st/media/${r.id}`;
                  return (
                    <Link key={r.id} href={`/anime/${r.id}`} className="flex-shrink-0 w-40 group">
                      <div className="relative rounded-xl overflow-hidden bg-surface ring-1 ring-white/5 group-hover:ring-accent/30 transition-all shadow-lg shadow-black/20">
                        <div className="aspect-[3/4] overflow-hidden">
                          <img src={cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex items-center justify-center size-12 rounded-full bg-accent/90 shadow-lg shadow-accent/30">
                            <FaPlay size={16} className="text-white ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-white/70 text-[10px] font-medium uppercase">{rt}</span>
                        </div>
                      </div>
                      <p className="text-xs font-medium text-white/60 group-hover:text-accent transition-colors mt-2 line-clamp-2 leading-snug">{r.title?.romaji || r.title?.english || ""}</p>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tags */}
          {meta.tags?.length > 0 && (
            <div className="bg-white/[0.02] ring-1 ring-white/[0.04] rounded-xl p-5">
              <h3 className="text-sm font-bold text-white/30 uppercase tracking-[0.15em] mb-3">Tags</h3>
              <div className="flex flex-wrap gap-1.5">{meta.tags.slice(0, 20).map(t => <span key={t} className="px-3 py-1 rounded-md bg-white/[0.04] text-white/40 text-xs">{t}</span>)}</div>
            </div>
          )}

          {chars.length > 0 && (
            <div className="bg-white/[0.02] ring-1 ring-white/[0.04] rounded-xl p-5">
              <h3 className="text-sm font-bold text-white/30 uppercase tracking-[0.15em] mb-3">Characters</h3>
              <div className="space-y-3">{chars.slice(0, 6).map((c: unknown) => {
                const ch = (c as { role: string; node: { id: number; name: { full: string }; image: { large: string } }; voiceActors: { id: number; name: { full: string }; image: { large: string }; languageV2: string }[] });
                const va = ch.voiceActors?.[0];
                return (
                  <div key={ch.node.id} className="flex items-center gap-3">
                    <img src={ch.node.image?.large || ""} alt="" className="w-12 h-12 rounded-full object-cover ring-1 ring-white/5 shrink-0" loading="lazy" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white/70">{ch.node.name.full}</p>
                      <p className="text-xs text-white/30">{ch.role?.replace("MAIN", "Main")?.replace("SUPPORTING", "Supporting")}</p>
                    </div>
                    {va && <div className="text-right shrink-0"><p className="text-xs text-white/50">{va.name.full}</p><p className="text-[10px] text-white/20">{va.languageV2}</p></div>}
                  </div>
                );
              })}</div>
            </div>
          )}

          {/* Trailer */}
          {meta.trailer?.id && (
            <a href={`https://www.youtube.com/watch?v=${meta.trailer.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.04] text-xs text-white/50 hover:text-accent hover:ring-accent/20 transition-all">
              <FaExternalLinkAlt size={10} /> Watch Trailer on YouTube
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
