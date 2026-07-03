"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaPlay, FaClock, FaCalendarAlt } from "react-icons/fa";
import { PageSkeleton } from "@/components/shared/loading-spinner";

interface AiringAnime {
  id: number;
  title: string;
  cover_image: string;
  episodes: number;
  format: string;
  status: string;
  nextAiring: { episode: number; airingAt: number } | null;
}

function formatAiringTime(ts: number) {
  const d = new Date(ts * 1000);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);

  const dateStr = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const timeStr = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });

  let label: string;
  if (days < 0) label = "Aired";
  else if (days === 0) label = `In ${hours}h ${mins}m`;
  else if (days === 1) label = "Tomorrow";
  else if (days < 7) label = `${days}d ${hours}h`;
  else label = `${dateStr}`;

  return { dateStr, timeStr, label, raw: d };
}

function groupByDate(items: AiringAnime[]) {
  const groups: { date: string; items: AiringAnime[] }[] = [];
  const map = new Map<string, AiringAnime[]>();
  for (const item of items) {
    if (!item.nextAiring) continue;
    const d = new Date(item.nextAiring.airingAt * 1000);
    const key = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  for (const [date, list] of map) groups.push({ date, items: list.sort((a, b) => (a.nextAiring?.airingAt ?? 0) - (b.nextAiring?.airingAt ?? 0)) });
  return groups.sort((a, b) => {
    const da = new Date(a.items[0].nextAiring!.airingAt * 1000);
    const db = new Date(b.items[0].nextAiring!.airingAt * 1000);
    return da.getTime() - db.getTime();
  });
}

export default function SchedulePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["schedule"],
    queryFn: () =>
      fetch("/api/cached/discover?sort=POPULARITY_DESC&status=RELEASING&per_page=50")
        .then(r => r.json())
        .then(d => (d.status === "success" ? d.data : [])) as Promise<AiringAnime[]>,
    staleTime: 30 * 60 * 1000,
  });

  const scheduleItems = (data ?? []).filter(a => a.nextAiring);
  const groups = groupByDate(scheduleItems);

  return (
    <div className="min-h-screen bg-[#070708]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-12 space-y-8">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-4xl font-black">Airing Schedule</h1>
          <p className="text-white/40 text-sm mt-1">Estimated airing times for currently releasing anime</p>
        </div>

        {isLoading && <PageSkeleton />}

        {!isLoading && groups.length === 0 && (
          <div className="text-center py-20">
            <FaCalendarAlt size={40} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/30 text-lg">No upcoming episodes found</p>
            <p className="text-white/15 text-sm mt-1">Schedule data will appear once airing anime are available</p>
          </div>
        )}

        {groups.map(group => (
          <section key={group.date}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-base font-bold uppercase tracking-[0.1em] text-white/80">{group.date}</h2>
              <div className="h-px flex-1 bg-white/[0.04]" />
            </div>
            <div className="space-y-2">
              {group.items.map(anime => {
                const ft = formatAiringTime(anime.nextAiring!.airingAt);
                return (
                  <Link
                    key={anime.id}
                    href={`/watch/${anime.id}/${anime.nextAiring!.episode}`}
                    className="flex items-center gap-4 bg-[#0d0d12] hover:bg-white/[0.03] ring-1 ring-white/[0.04] hover:ring-accent/20 rounded-xl p-3 transition-all group"
                  >
                    <img
                      src={anime.cover_image}
                      alt=""
                      className="w-14 h-20 rounded-lg object-cover shrink-0 ring-1 ring-white/5"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white/85 group-hover:text-accent transition-colors truncate">
                        {anime.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-white/35">
                        <span className="uppercase text-[10px] tracking-wider">{anime.format}</span>
                        <span className="opacity-30">·</span>
                        <span>EP {anime.nextAiring!.episode}</span>
                        {anime.episodes > 0 && (
                          <>
                            <span className="opacity-30">·</span>
                            <span>of {anime.episodes}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5 text-accent font-bold text-sm">
                        <FaClock size={11} />
                        <span>{ft.timeStr}</span>
                      </div>
                      <div className="text-[11px] text-white/30 mt-0.5">{ft.label}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        {scheduleItems.length > 0 && (
          <div className="text-center pt-4 pb-8">
            <p className="text-xs text-white/20">
              {scheduleItems.length} upcoming episodes · Times are estimates and may change
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
