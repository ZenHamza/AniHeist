"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlay, FaTimes } from "react-icons/fa";

interface AutoNextModalProps {
  nextEpisodeId: string;
  episodeNumber: number;
  onClose: () => void;
}

export function AutoNextModal({
  nextEpisodeId,
  episodeNumber,
  onClose,
}: AutoNextModalProps) {
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    if (countdown <= 0) {
      router.push(`/watch/${nextEpisodeId}`);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, nextEpisodeId, router]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-text">Next Episode</h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <p className="text-text-secondary mb-2">
          Episode {episodeNumber} will play in:
        </p>

        <div className="text-5xl font-bold text-accent text-center py-6">
          {countdown}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg bg-surface-hover border border-border
                       text-text-secondary hover:text-text transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => router.push(`/watch/${nextEpisodeId}`)}
            className="flex-1 py-2.5 rounded-lg bg-accent hover:bg-accent-hover
                       text-white font-medium transition-colors text-sm flex items-center justify-center gap-2"
          >
            <FaPlay size={12} />
            Play Now
          </button>
        </div>
      </div>
    </div>
  );
}
