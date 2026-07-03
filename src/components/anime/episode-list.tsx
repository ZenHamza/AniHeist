"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import clsx from "clsx";
import type { EpisodeItem } from "@/types/api";

type LayoutMode = "grid" | "list" | "thumbnail";

interface EpisodeListProps {
  episodes: EpisodeItem[];
  animeId: string;
  currentEpisode?: number;
}

function LayoutIcon({ mode, active }: { mode: LayoutMode; active: boolean }) {
  const cls = clsx("size-3.5 transition-colors", active ? "text-white" : "text-white/30");
  if (mode === "grid") return <svg className={cls} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="5" height="5" rx="1" /><rect x="8" y="1" width="5" height="5" rx="1" /><rect x="1" y="8" width="5" height="5" rx="1" /><rect x="8" y="8" width="5" height="5" rx="1" /></svg>;
  if (mode === "list") return <svg className={cls} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="4" y1="3" x2="13" y2="3" /><line x1="4" y1="7" x2="13" y2="7" /><line x1="4" y1="11" x2="13" y2="11" /><circle cx="2" cy="3" r="1" /><circle cx="2" cy="7" r="1" /><circle cx="2" cy="11" r="1" /></svg>;
  return <svg className={cls} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="1" y="1" width="12" height="8" rx="1.5" /><rect x="4" y="10" width="6" height="2.5" rx="0.8" /></svg>;
}

export function EpisodeList({ episodes, animeId, currentEpisode }: EpisodeListProps) {
  const [layout, setLayout] = useState<LayoutMode>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(`episode-layout-${animeId}`);
        if (saved === "grid" || saved === "list" || saved === "thumbnail") return saved;
      } catch {}
    }
    return "grid";
  });
  const [interval, setInterval] = useState(0);

  const storageKey = `episode-layout-${animeId}`;

  useEffect(() => {
    localStorage.setItem(storageKey, layout);
  }, [layout, storageKey]);

  const INTERVAL_SIZE = 100;
  const totalEpisodes = episodes.length;
  const totalIntervals = Math.ceil(totalEpisodes / INTERVAL_SIZE);
  const showIntervalNav = totalEpisodes >= 100;

  const visibleEpisodes = useMemo(() => {
    if (!showIntervalNav) return episodes;
    const start = interval * INTERVAL_SIZE;
    return episodes.slice(start, start + INTERVAL_SIZE);
  }, [episodes, interval, showIntervalNav]);

  const intervalOptions = useMemo(() => {
    if (!showIntervalNav) return [];
    return Array.from({ length: totalIntervals }, (_, i) => ({
      value: i,
      label: `${i * INTERVAL_SIZE + 1}–${Math.min((i + 1) * INTERVAL_SIZE, totalEpisodes)}`,
    }));
  }, [totalIntervals, totalEpisodes, showIntervalNav]);

  if (!episodes.length) return null;

  const layoutButtons: { mode: LayoutMode; label: string }[] = [
    { mode: "grid", label: "Grid" },
    { mode: "list", label: "List" },
    { mode: "thumbnail", label: "Thumbnails" },
  ];

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-0.5 border border-white/[0.05]">
          {layoutButtons.map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => setLayout(mode)}
              className={clsx(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all",
                layout === mode
                  ? "bg-accent text-white shadow-sm shadow-accent/20"
                  : "text-white/40 hover:text-white/70"
              )}
            >
              <LayoutIcon mode={mode} active={layout === mode} />
              {label}
            </button>
          ))}
        </div>

        {showIntervalNav && (
          <div className="flex items-center gap-2 bg-white/[0.04] rounded-lg px-3 py-1.5 border border-white/[0.05]">
            <span className="text-[10px] text-white/30 font-medium uppercase tracking-wide">Range</span>
            <select
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              className="bg-transparent text-xs text-white/70 outline-none appearance-none cursor-pointer font-medium"
            >
              {intervalOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#121212]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Grid layout */}
      {layout === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5">
          {visibleEpisodes.map((ep) => {
            const isActive = ep.number === currentEpisode;
            return (
              <Link
                key={ep.number}
                href={`/watch/${animeId}/${ep.number}`}
                className={clsx(
                  "relative flex flex-col items-center justify-center p-2.5 rounded-lg text-xs font-medium transition-all duration-200 border min-h-[56px]",
                  isActive
                    ? "bg-accent text-white border-accent shadow-lg shadow-accent/20 scale-105 z-10"
                    : ep.aired
                      ? "bg-white/[0.04] border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.07] hover:border-accent/30"
                      : "bg-white/[0.02] border-white/[0.03] text-white/20 cursor-not-allowed"
                )}
              >
                <span className="text-[11px] leading-tight font-semibold">EP {ep.number}</span>
                {ep.title && (
                  <span className="text-[9px] text-white/30 mt-0.5 line-clamp-1 text-center leading-tight">{ep.title}</span>
                )}
                {!ep.aired && (
                  <span className="text-[8px] text-amber-400/50 mt-0.5">TBA</span>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* List layout */}
      {layout === "list" && (
        <div className="space-y-1">
          {visibleEpisodes.map((ep) => {
            const isActive = ep.number === currentEpisode;
            return (
              <Link
                key={ep.number}
                href={`/watch/${animeId}/${ep.number}`}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border",
                  isActive
                    ? "bg-accent text-white border-accent shadow-lg shadow-accent/20 z-10"
                    : ep.aired
                      ? "bg-white/[0.03] border-white/[0.05] text-white/50 hover:text-white hover:bg-white/[0.06] hover:border-accent/30"
                      : "bg-white/[0.01] border-white/[0.03] text-white/20 cursor-not-allowed"
                )}
              >
                <span
                  className={clsx(
                    "flex items-center justify-center size-7 rounded-md text-[11px] font-bold shrink-0",
                    isActive
                      ? "bg-white/20 text-white"
                      : ep.aired
                        ? "bg-white/[0.06] text-white/40"
                        : "bg-white/[0.03] text-white/15"
                  )}
                >
                  {ep.number}
                </span>
                <span className="flex-1 truncate font-medium">
                  {ep.title ? (
                    <>
                      <span className="text-white/40 font-normal">EP {ep.number}</span>
                      <span className="ml-2">{ep.title}</span>
                    </>
                  ) : (
                    <span>Episode {ep.number}</span>
                  )}
                </span>
                {!ep.aired && (
                  <span className="text-[10px] text-amber-400/50 font-medium shrink-0">TBA</span>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* Thumbnail layout */}
      {layout === "thumbnail" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
          {visibleEpisodes.map((ep) => {
            const isActive = ep.number === currentEpisode;
            return (
              <Link
                key={ep.number}
                href={`/watch/${animeId}/${ep.number}`}
                className={clsx(
                  "group relative flex flex-col rounded-lg overflow-hidden transition-all duration-200 border",
                  isActive
                    ? "border-accent shadow-lg shadow-accent/20 ring-1 ring-accent/50 scale-[1.02] z-10"
                    : ep.aired
                      ? "border-white/[0.06] hover:border-accent/30 hover:shadow-md"
                      : "border-white/[0.03] opacity-60 cursor-not-allowed"
                )}
              >
                {/* Thumbnail placeholder */}
                <div
                  className={clsx(
                    "relative aspect-video w-full flex items-center justify-center overflow-hidden",
                    isActive
                      ? "bg-accent/20"
                      : ep.aired
                        ? "bg-white/[0.04] group-hover:bg-white/[0.06]"
                        : "bg-white/[0.02]"
                  )}
                >
                  {/* Play icon on hover */}
                  <div
                    className={clsx(
                      "flex items-center justify-center size-8 rounded-full transition-all duration-200",
                      isActive
                        ? "bg-accent shadow-md shadow-accent/30"
                        : ep.aired
                          ? "bg-white/[0.08] group-hover:bg-accent group-hover:shadow-md group-hover:shadow-accent/30"
                          : "bg-white/[0.04]"
                    )}
                  >
                    <svg
                      viewBox="0 0 12 12"
                      className={clsx(
                        "size-3 ml-0.5 transition-colors",
                        isActive ? "text-white" : "text-white/30 group-hover:text-white"
                      )}
                      fill="currentColor"
                    >
                      <polygon points="3,1.5 10.5,6 3,10.5" />
                    </svg>
                  </div>
                  {/* Episode number overlay */}
                  <span
                    className={clsx(
                      "absolute top-1 left-1 px-1.5 py-0.5 text-[9px] font-bold rounded leading-tight backdrop-blur-sm",
                      isActive
                        ? "bg-accent text-white"
                        : ep.aired
                          ? "bg-black/60 text-white/70"
                          : "bg-black/40 text-white/30"
                    )}
                  >
                    EP {ep.number}
                  </span>
                  {/* TBA badge */}
                  {!ep.aired && (
                    <span className="absolute top-1 right-1 px-1.5 py-0.5 text-[8px] font-medium rounded bg-amber-400/15 text-amber-400/60 backdrop-blur-sm">
                      TBA
                    </span>
                  )}
                </div>
                {/* Title bar */}
                <div
                  className={clsx(
                    "px-2 py-1.5 min-h-0",
                    isActive
                      ? "bg-accent/10"
                      : "bg-white/[0.02]"
                  )}
                >
                  <p
                    className={clsx(
                      "text-[10px] leading-snug line-clamp-1 font-medium",
                      isActive ? "text-white" : ep.aired ? "text-white/60 group-hover:text-white/80" : "text-white/25"
                    )}
                  >
                    {ep.title || `Episode ${ep.number}`}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
