"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  sources: { url: string; quality: string; isM3U8: boolean }[];
  subtitles?: { url: string; lang: string; label?: string }[];
  poster?: string;
  episodeId: string;
  animeId: string;
  animeTitle: string;
  animeImage: string;
  episodeNumber: number;
  duration?: number;
  onEnded?: () => void;
  onFatalError?: () => void;
}

export function VideoPlayer({
  sources,
  subtitles,
  poster,
  episodeId,
  animeId,
  animeTitle,
  animeImage,
  episodeNumber,
  duration,
  onEnded,
  onFatalError,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string | null>(null);

  const src = sources.find((s) => s.isM3U8) || sources[0];

  useEffect(() => {
    const video = videoRef.current!;
    if (!video || !src) return;
    setError(null);

    async function init() {
      try {
        if (!src.isM3U8) {
          video.src = src.url;
          video.addEventListener("loadedmetadata", () => {});
        } else if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(src.url);
          hls.attachMedia(video as HTMLMediaElement);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {});
          hls.on(Hls.Events.ERROR, (_e, data) => {
            if (data.fatal) {
              console.error("[hls.js fatals]", data.type, data.details);
              onFatalError?.();
            }
          });
          hlsRef.current = hls;
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = src.url;
          video.addEventListener("loadedmetadata", () => {});
        } else {
          setError("HLS not supported in this browser.");
        }

        if (subtitles?.length) {
          subtitles.forEach((sub) => {
            const t = document.createElement("track");
            t.kind = "subtitles";
            t.label = sub.label || sub.lang;
            t.srclang = sub.lang;
            t.src = sub.url;
            t.default = sub.lang === "en";
            video.appendChild(t);
          });
        }

        video.addEventListener("timeupdate", () => {
          const v = videoRef.current;
          if (v && v.currentTime > 0) {
            try {
              localStorage.setItem(
                `progress_${episodeId}`,
                JSON.stringify({
                  time: v.currentTime,
                  duration: v.duration,
                  timestamp: Date.now(),
                  animeId,
                  episodeNumber,
                  animeTitle,
                  animeImage,
                })
              );
            } catch {}
          }
        });

        if (onEnded) video.addEventListener("ended", onEnded);
      } catch (e: unknown) {
        setError(`Player error: ${e instanceof Error ? e.message : "unknown"}`);
      }
    }

    init();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.removeEventListener("timeupdate", () => {});
      if (onEnded) video.removeEventListener("ended", onEnded);
    };
  }, [src?.url]);

  if (error) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-red-400 text-sm font-medium mb-1">Playback Error</p>
          <p className="text-white/40 text-xs">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
      <video ref={videoRef} className="w-full h-full" poster={poster || ""} controls playsInline />
    </div>
  );
}
