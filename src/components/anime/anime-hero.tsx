"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import type { AnimeInfo } from "@/types/api";

interface HeroCarouselProps {
  items: AnimeInfo[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    [Autoplay({ delay: 6000, stopOnInteraction: false })]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  if (!items?.length) return null;

  return (
    <section className="relative overflow-hidden" ref={emblaRef} data-testid="hero-carousel">
      <div className="flex">
        {items.map((anime) => (
          <div key={anime.id} className="flex-[0_0_100%] min-w-0 relative">
            <div className="relative h-[65vh] min-h-[500px] max-h-[750px] w-full">
              <img
                src={anime.cover_image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 via-40% to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />

              <div className="absolute inset-0 mx-auto max-w-[1400px] flex items-center px-8">
                <div className="max-w-xl lg:max-w-2xl space-y-6">
                  <span className="inline-flex px-3 py-1 rounded-full bg-accent-muted text-accent text-xs font-medium border border-accent/20">
                    #{currentIndex + 1} Trending
                  </span>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                    {anime.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
                    {anime.score > 0 && (
                      <span className="flex items-center gap-1 text-yellow-400">⭐ {anime.score}%</span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-surface border border-border text-xs uppercase">
                      {anime.status}
                    </span>
                    {anime.year > 0 && <span>{anime.year}</span>}
                    {anime.format && <span>{anime.format}</span>}
                    {anime.episodes > 0 && <span>{anime.episodes} eps</span>}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {anime.genres.slice(0, 4).map((g) => (
                      <Link key={g} href={`/genre/${encodeURIComponent(g)}`}>
                        <span className="px-3 py-1 rounded-full bg-surface-raised border border-border text-xs hover:border-accent/50 hover:text-accent transition-colors cursor-pointer">
                          {g}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <p className="text-text-secondary line-clamp-3 leading-relaxed max-w-lg text-sm lg:text-base">
                    {anime.description}
                  </p>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/watch/${anime.id}/1`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover rounded-lg text-white font-semibold transition-colors"
                    >
                      <FaPlay className="size-3.5" /> Watch Now
                    </Link>
                    <Link
                      href={`/anime/${anime.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-surface hover:bg-surface-hover rounded-lg text-text border border-border font-semibold transition-colors"
                    >
                      <FaInfoCircle className="size-4" /> Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? "w-8 bg-accent" : "w-4 bg-text-muted/50 hover:bg-text-secondary"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
