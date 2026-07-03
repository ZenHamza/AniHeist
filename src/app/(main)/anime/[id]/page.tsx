import { notFound } from "next/navigation";
import { AnimePageClient } from "./anime-client";
import type { Metadata } from "next";

interface AnimePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AnimePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const apiUrl = process.env.API_INTERNAL_URL || "https://api.aniheist.com";
    const res = await fetch(`${apiUrl}/api/anime/${id}`, { signal: AbortSignal.timeout(8000) });
    const json = await res.json();
    if (json.status === "success") {
      const a = json.data;
      return { title: `${a.title.romaji || a.title.english} | AniHeist`, description: a.description?.replace(/<[^>]*>/g, "").slice(0, 160), openGraph: { title: `${a.title.romaji || a.title.english} | AniHeist`, images: [{ url: a.cover_image }] } };
    }
  } catch {}
  return { title: "Anime | AniHeist" };
}

export default async function AnimePage({ params }: AnimePageProps) {
  const { id } = await params;
  const animeId = parseInt(id, 10);
  if (isNaN(animeId)) notFound();
  return <AnimePageClient animeId={id} />;
}
