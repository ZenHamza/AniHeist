"use client";

import Link from "next/link";

const PREMIUM_GENRES = [
  { name: "Action", slug: "Action", color: "from-red-500/20 to-orange-500/10" },
  { name: "Adventure", slug: "Adventure", color: "from-green-500/20 to-emerald-500/10" },
  { name: "Comedy", slug: "Comedy", color: "from-yellow-500/20 to-amber-500/10" },
  { name: "Drama", slug: "Drama", color: "from-purple-500/20 to-pink-500/10" },
  { name: "Fantasy", slug: "Fantasy", color: "from-blue-500/20 to-cyan-500/10" },
  { name: "Horror", slug: "Horror", color: "from-red-700/20 to-gray-700/10" },
  { name: "Isekai", slug: "Isekai", color: "from-teal-500/20 to-green-500/10" },
  { name: "Mecha", slug: "Mecha", color: "from-slate-500/20 to-zinc-500/10" },
  { name: "Mystery", slug: "Mystery", color: "from-indigo-500/20 to-violet-500/10" },
  { name: "Psychological", slug: "Psychological", color: "from-fuchsia-500/20 to-rose-500/10" },
  { name: "Romance", slug: "Romance", color: "from-pink-500/20 to-rose-500/10" },
  { name: "Sci-Fi", slug: "Sci-Fi", color: "from-cyan-500/20 to-blue-500/10" },
  { name: "Slice of Life", slug: "Slice of Life", color: "from-lime-500/20 to-green-500/10" },
  { name: "Sports", slug: "Sports", color: "from-orange-500/20 to-yellow-500/10" },
  { name: "Supernatural", slug: "Supernatural", color: "from-violet-500/20 to-purple-500/10" },
  { name: "Thriller", slug: "Thriller", color: "from-red-600/20 to-orange-600/10" },
  { name: "Shounen", slug: "Shounen", color: "from-blue-600/20 to-sky-500/10" },
  { name: "Seinen", slug: "Seinen", color: "from-gray-500/20 to-slate-500/10" },
  { name: "Shoujo", slug: "Shoujo", color: "from-rose-500/20 to-pink-400/10" },
  { name: "Mahou Shoujo", slug: "Mahou Shoujo", color: "from-pink-400/20 to-purple-400/10" },
];

export default function GenresPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Browse by Genre</h1>
        <p className="text-text-secondary mt-1 text-sm">Discover anime across {PREMIUM_GENRES.length} genres</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {PREMIUM_GENRES.map((genre) => (
          <Link
            key={genre.slug}
            href={`/genre/${encodeURIComponent(genre.slug)}`}
            className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${genre.color} border border-border p-5 hover:scale-105 hover:border-accent/30 transition-all group`}
          >
            <h3 className="font-semibold text-base text-text group-hover:text-accent transition-colors">{genre.name}</h3>
            <p className="text-xs text-text-muted mt-1">Browse anime</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
