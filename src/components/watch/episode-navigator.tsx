"use client";

import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface EpisodeNavigatorProps {
  episodeNumber: number;
  prevEpisodeId?: string;
  nextEpisodeId?: string;
}

export function EpisodeNavigator({
  episodeNumber,
  prevEpisodeId,
  nextEpisodeId,
}: EpisodeNavigatorProps) {
  return (
    <div
      className="flex items-center justify-between gap-3 mt-4"
      data-testid="episode-navigator"
    >
      {prevEpisodeId ? (
        <Link
          href={`/watch/${prevEpisodeId}`}
          className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border
                     rounded-lg text-sm text-text-secondary hover:text-text
                     hover:bg-surface-hover transition-all flex-1 justify-center"
        >
          <FaChevronLeft size={12} />
          EP {episodeNumber - 1}
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      <span className="text-sm font-semibold text-text bg-surface px-4 py-2 rounded-lg border border-border">
        EP {episodeNumber}
      </span>

      {nextEpisodeId ? (
        <Link
          href={`/watch/${nextEpisodeId}`}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover
                     rounded-lg text-sm text-white font-medium transition-all
                     flex-1 justify-center"
        >
          EP {episodeNumber + 1}
          <FaChevronRight size={12} />
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  );
}
