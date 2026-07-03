import Link from "next/link";
import type { AnimeInfo } from "@/types/api";

interface AnimeCardProps {
  anime: AnimeInfo;
  variant?: "grid" | "horizontal";
}

export function AnimeCard({ anime, variant = "grid" }: AnimeCardProps) {
  if (variant === "horizontal") {
    return (
      <Link
        href={`/anime/${anime.id}`}
        className="flex gap-4 bg-surface rounded-lg overflow-hidden hover:bg-surface-hover transition-colors group"
      >
        <img
          src={anime.cover_image}
          alt={anime.title}
          className="w-28 h-40 object-cover shrink-0"
          loading="lazy"
        />
        <div className="p-3 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-accent transition-colors">
              {anime.title}
            </h3>
            <p className="text-text-secondary text-xs line-clamp-2 mt-1">
              {anime.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {anime.genres.slice(0, 3).map((g) => (
              <span key={g} className="text-[10px] bg-surface-raised px-2 py-0.5 rounded-full border border-border">
                {g}
              </span>
            ))}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/anime/${anime.id}`}
      className="anime-card relative rounded-lg overflow-hidden bg-surface group"
      data-testid="anime-card"
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={anime.cover_image}
          alt={anime.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-sm font-medium line-clamp-2">{anime.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          {anime.score > 0 && (
            <span className="text-xs text-yellow-400">⭐ {anime.score}%</span>
          )}
          <span className="text-xs text-text-secondary capitalize">{anime.status}</span>
          {anime.format && <span className="text-xs text-text-secondary">{anime.format}</span>}
        </div>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {anime.genres.slice(0, 2).map((g) => (
            <span key={g} className="text-[10px] bg-surface-raised/80 px-2 py-0.5 rounded-full">
              {g}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
