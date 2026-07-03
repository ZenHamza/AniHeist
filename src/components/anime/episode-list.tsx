import Link from "next/link";
import clsx from "clsx";
import type { EpisodeItem } from "@/types/api";

interface EpisodeListProps {
  episodes: EpisodeItem[];
  animeId: string;
  currentEpisode?: number;
}

export function EpisodeList({ episodes, animeId, currentEpisode }: EpisodeListProps) {
  if (!episodes.length) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5">
      {episodes.map((ep) => {
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
  );
}
