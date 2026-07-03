import { notFound } from "next/navigation";
import { WatchPageClient } from "./watch-client";
import type { Metadata } from "next";
import type { AnimeMeta, EpisodeListData } from "@/types/api";

interface WatchPageProps {
  params: Promise<{ animeId: string; episode: string }>;
}

const API_BASE = process.env.API_INTERNAL_URL || "https://api.aniheist.com";

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const { animeId, episode } = await params;
  try {
    const res = await fetch(`${API_BASE}/api/anime/${animeId}`, { signal: AbortSignal.timeout(8000) });
    const json = await res.json();
    if (json.status === "success") {
      const a = json.data as AnimeMeta;
      return { title: `Watch ${a.title.romaji || a.title.english} Episode ${episode} | AniHeist`, description: a.description?.replace(/<[^>]*>/g, "").slice(0, 160), openGraph: { title: `${a.title.romaji} Episode ${episode} | AniHeist`, images: [{ url: a.cover_image }], type: "video.episode", siteName: "AniHeist" }, twitter: { card: "summary_large_image", title: `Watch ${a.title.romaji} Episode ${episode} | AniHeist`, images: [a.cover_image] } };
    }
  } catch {}
  return { title: `Watch Episode ${episode} | AniHeist` };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { animeId, episode } = await params;
  const episodeNum = parseInt(episode, 10);
  if (isNaN(episodeNum) || episodeNum < 1) notFound();

  const [metaRes, epRes] = await Promise.allSettled([
    fetch(`${API_BASE}/api/anime/${animeId}`, { signal: AbortSignal.timeout(10000) }).then(r => r.json()),
    fetch(`${API_BASE}/api/anime/${animeId}/episodes`, { signal: AbortSignal.timeout(10000) }).then(r => r.json()),
  ]);

  const anime = metaRes.status === "fulfilled" && metaRes.value?.status === "success" ? metaRes.value.data as AnimeMeta : null;
  const episodeData = epRes.status === "fulfilled" && epRes.value?.status === "success" ? epRes.value.data as EpisodeListData : null;

  return <WatchPageClient animeId={animeId} episode={episodeNum} anime={anime} episodeData={episodeData} />;
}
