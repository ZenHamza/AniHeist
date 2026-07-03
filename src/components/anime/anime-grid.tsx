import { AnimeCard } from "./anime-card";
import type { AnimeInfo } from "@/types/api";

interface AnimeGridProps {
  items: AnimeInfo[];
  variant?: "grid" | "horizontal";
}

export function AnimeGrid({ items, variant = "grid" }: AnimeGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-text-muted">
        <p>No anime found.</p>
      </div>
    );
  }

  const gridClass =
    variant === "horizontal"
      ? "grid grid-cols-1 md:grid-cols-2 gap-4"
      : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4";

  return (
    <div className={gridClass} data-testid="anime-grid">
      {items.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} variant={variant} />
      ))}
    </div>
  );
}
