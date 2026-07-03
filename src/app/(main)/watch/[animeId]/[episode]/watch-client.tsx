"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaPlay, FaChevronLeft, FaChevronRight, FaStar, FaServer, FaLanguage } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { VideoPlayer } from "@/components/watch/video-player";
import { AutoNextModal } from "@/components/watch/auto-next-modal";
import { AdNative, AdSmartLink } from "@/components/ads/ad-slot";
import type { StreamResponse, AnimeMeta, EpisodeListData } from "@/types/api";

interface WatchPageClientProps { animeId: string; episode: number; anime: AnimeMeta | null; episodeData: EpisodeListData | null; }
interface Provider { name: string; episodes: { sub: number; dub: number }; }

interface ServerOption { value: string; label: string; }

const SERVER_META: Record<string, string> = {
  "provider:ally": "Wixmp (HLS)",
  "provider:moo": "Animegg (MP4)",
  "source:anikoto": "Anikoto (Embed)",
};

export function WatchPageClient({ animeId, episode, anime, episodeData }: WatchPageClientProps) {
  const [showAutoNext, setShowAutoNext] = useState(false);
  const [stream, setStream] = useState<StreamResponse | null>(null);
  const [servers, setServers] = useState<ServerOption[]>([]);
  const [selectedServer, setSelectedServer] = useState("");
  const [audio, setAudio] = useState<"sub" | "dub">("sub");
  const [subAvail, setSubAvail] = useState(true);
  const [dubAvail, setDubAvail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [fallbackTried, setFallbackTried] = useState(false);
  const router = useRouter();

  async function loadStream(server = "", dub = false) {
    setLoading(true); setError(""); setStream(null);
    try {
      let url = `/api/proxy/api/stream?anime_id=${animeId}&episode=${episode}`;
      if (dub) url += "&dub=true";
      if (server) {
        const [type, val] = server.split(":");
        url += type === "source" ? `&source=${val}` : `&provider=${val}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (!text) throw new Error("Empty response");
      const data = JSON.parse(text);
      if (data.status !== "success") throw new Error(data.error?.message || "Stream unavailable");
      setStream(data);
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    setLoading(false);
  }

  useEffect(() => {
    loadStream(selectedServer, audio === "dub");
    const opts: ServerOption[] = [];
    fetch(`/api/proxy/api/anime/${animeId}/providers`)
      .then(r => { if (!r.ok) return null; return r.text(); })
      .then(text => { if (!text) return; const d = JSON.parse(text); if (d.status === "success" && d.data?.providers) {
          d.data.providers.forEach((p: { name: string }) => {
            if (p.name === "ally" || p.name === "moo") opts.push({ value: `provider:${p.name}`, label: SERVER_META[`provider:${p.name}`] || p.name });
          });
        }
      }).catch(() => {}).finally(() => {
        opts.push({ value: "source:anikoto", label: "Anikoto (Embed)" });
        setServers(opts);
      });
    fetch(`/api/proxy/api/anime/${animeId}/sources`)
      .then(r => { if (!r.ok) return null; return r.text(); })
      .then(text => { if (!text) return; const d = JSON.parse(text); if (d.status === "success") { setSubAvail(d.data.sub_available); setDubAvail(d.data.dub_available); } }).catch(() => {});
  }, [animeId, episode, retryCount]);

  const { data: extra } = useQuery({
    queryKey: ["anilist-extra", animeId],
    queryFn: async () => {
      const r = await fetch(`/api/anilist/extra/${animeId}`);
      if (!r.ok) return { data: { Media: null } };
      const text = await r.text();
      if (!text) return { data: { Media: null } };
      return JSON.parse(text);
    },
    staleTime: 24 * 60 * 60 * 1000,
  });

  const media = extra?.data?.Media;
  const chars = media?.characters?.edges || [];
  const recs = media?.recommendations?.nodes || [];
  const relations = media?.relations?.edges || [];

  const totalEpisodes = episodeData?.total || anime?.episodes || 0;
  const hasPrev = episode > 1;
  const hasNext = totalEpisodes > 0 ? episode < totalEpisodes : true;

  if (!stream && loading) return <div className="mx-auto max-w-[1400px] px-4 py-20 flex flex-col items-center"><div className="size-12 rounded-full border-2 border-accent/30 border-t-accent animate-spin mb-4" /><p className="text-sm text-white/40">Loading stream...</p></div>;
  if (error && !stream) return <div className="mx-auto max-w-[1400px] px-4 py-20 text-center"><p className="text-red-400 text-sm font-medium mb-2">{error}</p><button onClick={() => setRetryCount(c => c + 1)} className="px-5 py-2 bg-accent rounded-lg text-white text-sm font-medium">Retry</button><div className="mt-4 flex items-center justify-center gap-2">{subAvail && <button onClick={() => { setAudio("sub"); loadStream(selectedServer, false); }} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${audio==="sub"?"bg-accent text-white":"bg-white/[0.05] text-white/50 hover:text-white"}`}>SUB</button>}{dubAvail && <button onClick={() => { setAudio("dub"); loadStream(selectedServer, true); }} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${audio==="dub"?"bg-accent text-white":"bg-white/[0.05] text-white/50 hover:text-white"}`}>DUB</button>}</div></div>;
  if (!stream || stream.status !== "success") return (
    <div className="mx-auto max-w-[1400px] px-4 py-20 flex flex-col items-center">
      {loading ? (
        <><div className="size-12 rounded-full border-2 border-accent/30 border-t-accent animate-spin mb-4" /><p className="text-sm text-white/40">Loading stream...</p></>
      ) : (
        <div className="text-center">
          <p className="text-red-400 text-sm font-medium mb-2">{error || "Stream unavailable"}</p>
          <button onClick={() => { setRetryCount(c => c + 1); }} className="px-5 py-2 bg-accent rounded-lg text-white text-sm font-medium">Retry</button>
          <div className="mt-4 flex items-center justify-center gap-2">
            {subAvail && <button onClick={() => { setAudio("sub"); loadStream(selectedServer, false); }} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${audio==="sub"?"bg-accent text-white":"bg-white/[0.05] text-white/50 hover:text-white"}`}>SUB</button>}
            {dubAvail && <button onClick={() => { setAudio("dub"); loadStream(selectedServer, true); }} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${audio==="dub"?"bg-accent text-white":"bg-white/[0.05] text-white/50 hover:text-white"}`}>DUB</button>}
          </div>
        </div>
      )}
    </div>
  );

  const { data: streamData, meta } = stream;
  const isHls = streamData.format === "hls";
  const sources = [{ url: streamData.video_url, quality: "auto", isM3U8: isHls }];
  const subtitles = (streamData.subtitles || []).map((sub) => ({ url: sub.url, lang: sub.lang, label: sub.label }));

  return (
    <div className="mx-auto max-w-[1400px] px-3 sm:px-4 py-4 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-white/30"><Link href="/" className="hover:text-white">Home</Link><span>/</span>{anime && <Link href={`/anime/${animeId}`} className="hover:text-white truncate max-w-[200px]">{anime.title.romaji || anime.title.english}</Link>}<span>/</span><span className="text-white/50">EP {episode}</span></nav>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main */}
        <div className="flex-1 min-w-0 space-y-3">
          {streamData.format === "embed" ? (
            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
              <iframe key={streamData.video_url} src={streamData.video_url} className="w-full h-full border-0" allowFullScreen allow="autoplay; encrypted-media" />
            </div>
          ) : (
            <VideoPlayer key={streamData.video_url} sources={sources} subtitles={subtitles} episodeId={`${animeId}-${episode}`} animeId={animeId} animeTitle={anime?.title.romaji || ""} animeImage={anime?.cover_image || ""} episodeNumber={episode} onEnded={() => setShowAutoNext(true)} onFatalError={() => { if (streamData.format !== "embed" && !fallbackTried) { setFallbackTried(true); loadStream("source:anikoto", audio === "dub"); } }} />
          )}

          {/* Server Selection - Below Player */}
          <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5">
              <div className="flex items-center gap-4 min-w-0">
                {anime && <img src={anime.cover_image} alt="" className="w-14 h-20 sm:w-16 sm:h-22 rounded-xl object-cover ring-1 ring-white/5 shadow-lg shrink-0" />}
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-white/90 truncate">{anime?.title.romaji || anime?.title.english || "Anime"}</h2>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm font-bold text-accent">EP {episode}</span>
                    {episodeData?.episodes.find(ep => ep.number === episode)?.title && (
                      <span className="text-sm text-white/40 truncate">— {episodeData.episodes.find(ep => ep.number === episode)?.title}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-white/20">
                    <span>{streamData.source}</span>
                    <span>·</span>
                    <span>{meta.cached ? "cached" : `${meta.response_time_ms}ms`}</span>
                    <span>·</span>
                    <span>{streamData.format?.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap shrink-0 w-full sm:w-auto">
                {subAvail && dubAvail && (
                  <div className="flex items-center gap-0.5 bg-white/[0.05] rounded-lg p-0.5 border border-white/[0.05]">
                    <button onClick={() => { setAudio("sub"); loadStream(selectedServer, false); }} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${audio==="sub"?"bg-accent text-white shadow-sm shadow-accent/20":"text-white/40 hover:text-white/70"}`}>SUB</button>
                    <button onClick={() => { setAudio("dub"); loadStream(selectedServer, true); }} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${audio==="dub"?"bg-accent text-white shadow-sm shadow-accent/20":"text-white/40 hover:text-white/70"}`}>DUB</button>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white/[0.05] rounded-lg px-3 py-2 border border-white/[0.05] w-full sm:w-auto">
                  <FaServer size={14} className="text-white/30 shrink-0" />
                  <select value={selectedServer} onChange={e => { setSelectedServer(e.target.value); loadStream(e.target.value, audio === "dub"); }} className="bg-transparent text-sm text-white/70 outline-none appearance-none cursor-pointer flex-1 sm:w-32 font-medium">
                    <option value="">Auto (Miruro)</option>{servers.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <span className="text-xs text-white/25 shrink-0">{servers.length + 1} servers</span>
                  {loading && <div className="size-4 rounded-full border-2 border-accent/30 border-t-accent animate-spin shrink-0" />}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 sm:px-5 pb-4 sm:pb-5 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs text-white/25">
                <button className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.05] text-white/40 hover:text-white/70 hover:border-white/10 transition-all">Share</button>
                <button className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.05] text-white/40 hover:text-white/70 hover:border-white/10 transition-all">Report</button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button onClick={() => router.push(`/watch/${animeId}/${episode - 1}`)} disabled={!hasPrev} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/40 hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed"><FaChevronLeft size={10} />Prev</button>
            <span className="text-xs font-semibold text-white/40">EP {episode}{totalEpisodes > 0 && <span className="text-white/15 ml-1">/ {totalEpisodes}</span>}</span>
            <button onClick={() => router.push(`/watch/${animeId}/${episode + 1}`)} disabled={!hasNext} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed">Next <FaChevronRight size={10} /></button>
          </div>

          {episodeData?.episodes && (
            <div className="bg-white/[0.02] rounded-xl border border-white/[0.04] overflow-hidden">
              <div className="p-3 border-b border-white/[0.04] flex items-center justify-between">
                <span className="text-[11px] font-bold text-white/30 uppercase tracking-[0.1em]">Episodes</span>
                <span className="text-[10px] text-white/15">{totalEpisodes} total</span>
              </div>
              {/* Episode grid */}
              <div className="p-3">
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-8 xl:grid-cols-10 gap-1 max-h-48 overflow-y-auto">
                  {episodeData.episodes.map(ep => (
                    <button key={ep.number} onClick={() => ep.aired && router.push(`/watch/${animeId}/${ep.number}`)} disabled={!ep.aired} className={`flex flex-col items-center justify-center aspect-square rounded-md text-xs font-medium transition-all ${ep.number === episode ? "bg-accent text-white scale-105 shadow-lg shadow-accent/20 z-10" : ep.aired ? "bg-white/[0.04] border border-white/[0.04] text-white/40 hover:text-white hover:bg-white/[0.07]" : "bg-white/[0.02] border border-white/[0.03] text-white/15 cursor-not-allowed"}`}>
                      <span className="text-[11px] font-bold">{ep.number}</span>
                      {!ep.aired && <span className="text-[7px] text-amber-400/30 mt-0.5">TBA</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Ad Banner - Below Episodes */}
          <AdNative className="py-2" />

          {/* Recommendations */}
          {recs.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-[0.1em] mb-4 flex items-center gap-2"><FaPlay size={10} className="text-accent rotate-0" /> Recommendations</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x scrollbar-none scroll-smooth" style={{ scrollbarWidth: 'none' }}>
                {recs.slice(0, 10).map((r: unknown) => {
                  const rec = (r as { mediaRecommendation: { id: number; title: { romaji?: string; english?: string }; coverImage?: { large?: string } } }).mediaRecommendation;
                  const cover = rec.coverImage?.large || `https://img.anili.st/media/${rec.id}`;
                  return (
                    <Link key={rec.id} href={`/anime/${rec.id}`} className="flex-shrink-0 w-40 group">
                      <div className="relative rounded-xl overflow-hidden bg-surface ring-1 ring-white/5 group-hover:ring-accent/30 transition-all shadow-lg shadow-black/20">
                        <div className="aspect-[3/4] overflow-hidden"><img src={cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" /></div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex items-center justify-center size-12 rounded-full bg-accent/90 shadow-lg shadow-accent/30"><FaPlay size={16} className="text-white ml-0.5" /></div>
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
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x scrollbar-none scroll-smooth" style={{ scrollbarWidth: 'none' }}>
                {relations.map((rel: unknown) => {
                  const r = (rel as { relationType: string; node: { id: number; title: { romaji?: string; english?: string }; coverImage?: { large?: string } } }).node;
                  const rt = (rel as { relationType: string }).relationType;
                  const cover = r.coverImage?.large || `https://img.anili.st/media/${r.id}`;
                  return (
                    <Link key={r.id} href={`/anime/${r.id}`} className="flex-shrink-0 w-40 group">
                      <div className="relative rounded-xl overflow-hidden bg-surface ring-1 ring-white/5 group-hover:ring-accent/30 transition-all shadow-lg shadow-black/20">
                        <div className="aspect-[3/4] overflow-hidden"><img src={cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" /></div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex items-center justify-center size-12 rounded-full bg-accent/90 shadow-lg shadow-accent/30"><FaPlay size={16} className="text-white ml-0.5" /></div>
                        </div>
                        <div className="absolute top-2 left-2"><span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-white/70 text-[10px] font-medium uppercase">{rt}</span></div>
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
        <aside className="lg:w-72 xl:w-80 shrink-0 space-y-4">
          {anime && (
            <div className="bg-white/[0.02] ring-1 ring-white/[0.04] rounded-xl overflow-hidden">
              <div className="relative">
                {anime.banner_image && <img src={anime.banner_image} alt="" className="w-full h-32 sm:h-36 object-cover opacity-30" />}
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                <div className="relative flex items-end gap-4 p-4 -mt-12">
                  <img src={anime.cover_image} alt="" className="w-20 h-28 rounded-lg object-cover ring-1 ring-white/5 shadow-lg shrink-0" />
                  <div className="min-w-0 pt-4"><Link href={`/anime/${animeId}`} className="text-base font-bold text-white/85 hover:text-accent transition-colors line-clamp-2">{anime.title.romaji || anime.title.english}</Link>{anime.score > 0 && <div className="flex items-center gap-1 text-amber-400 text-sm mt-1"><FaStar size={11} />{anime.score}%</div>}</div>
                </div>
              </div>
              <div className="px-4 pb-4 space-y-4">
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {anime.format && <><span className="text-white/25">Format</span><span className="text-white/55 text-right">{anime.format}</span></>}
                  <span className="text-white/25">Status</span><span className="text-white/55 text-right">{anime.status?.replace(/_/g, " ")}</span>
                  {anime.episodes > 0 && <><span className="text-white/25">Episodes</span><span className="text-white/55 text-right">{anime.episodes}</span></>}
                  {anime.duration > 0 && <><span className="text-white/25">Duration</span><span className="text-white/55 text-right">{anime.duration} min</span></>}
                  {anime.season && <><span className="text-white/25">Season</span><span className="text-white/55 text-right">{anime.season} {anime.season_year}</span></>}
                  {anime.score > 0 && <><span className="text-white/25">Score</span><span className="text-white/55 text-right">{anime.score}/100</span></>}
                  {anime.studio && <><span className="text-white/25">Studio</span><span className="text-white/55 text-right">{anime.studio}</span></>}
                </div>
                {anime.genres?.length > 0 && <div className="flex flex-wrap gap-1.5">{anime.genres.map(g => <Link key={g} href={`/genre/${encodeURIComponent(g)}`}><span className="px-2.5 py-1 rounded-md bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20">{g}</span></Link>)}</div>}
              </div>
            </div>
          )}

          {anime?.tags && anime.tags.length > 0 && (
            <div className="bg-white/[0.02] ring-1 ring-white/[0.04] rounded-xl p-4">
              <h3 className="text-xs font-bold text-white/25 uppercase tracking-[0.15em] mb-3">Tags</h3>
              <div className="flex flex-wrap gap-1.5">{anime.tags.slice(0, 15).map(t => <span key={t} className="px-2.5 py-1 rounded-md bg-white/[0.04] text-white/35 text-[11px]">{t}</span>)}</div>
            </div>
          )}

          {chars.length > 0 && (
            <div className="bg-white/[0.02] ring-1 ring-white/[0.04] rounded-xl p-4">
              <h3 className="text-xs font-bold text-white/25 uppercase tracking-[0.15em] mb-3">Characters</h3>
              <div className="space-y-3">{chars.slice(0, 5).map((c: unknown) => {
                const ch = (c as { role: string; node: { id: number; name: { full: string }; image: { large: string } }; voiceActors: { id: number; name: { full: string }; image: { large: string }; languageV2: string }[] });
                const va = ch.voiceActors?.[0];
                return <div key={ch.node.id} className="flex items-center gap-3"><img src={ch.node.image?.large || `https://img.anili.st/character/default`} alt="" className="w-11 h-11 rounded-full object-cover ring-1 ring-white/5 shrink-0" /><div className="min-w-0 flex-1"><p className="text-sm font-medium text-white/65 line-clamp-1">{ch.node.name.full}</p><p className="text-[11px] text-white/25">{ch.role?.replace("MAIN", "Main")?.replace("SUPPORTING", "Supporting")}</p></div>{va && <div className="text-right shrink-0"><p className="text-xs text-white/40">{va.name.full}</p><p className="text-[10px] text-white/15">{va.languageV2}</p></div>}</div>;
              })}</div>
            </div>
          )}

          {/* Sidebar Ad */}
          <AdSmartLink format="rectangle" />
        </aside>
      </div>

      {showAutoNext && hasNext && <AutoNextModal nextEpisodeId={`/watch/${animeId}/${episode + 1}`} episodeNumber={episode + 1} onClose={() => setShowAutoNext(false)} />}
    </div>
  );
}
