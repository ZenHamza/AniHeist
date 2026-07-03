import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — AniHeist",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 text-3xl font-bold text-text">About AniHeist</h1>
      <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
        <h2 className="text-xl font-semibold text-accent">The Heist</h2>
        <p>
          AniHeist was born from a simple idea: anime discovery should feel like an adventure, not a chore.
          We built a platform that combines the thrill of a phantom thief heist with the joy of finding
          your next favorite series.
        </p>

        <h2 className="text-xl font-semibold text-accent">What We Offer</h2>
        <p>
          AniHeist provides a curated anime tracking and discovery experience. Our platform aggregates
          metadata from AniList and other sources to give you a comprehensive view of what to watch next.
          Build your watchlist, track your progress, rate episodes, and engage with a community of fellow thieves.
        </p>

        <h2 className="text-xl font-semibold text-accent">Our Philosophy</h2>
        <p>
          We believe in a clean, fast, and beautiful interface. No clutter, no obtrusive ads, no tracking
          you across the web. Just you, your watchlist, and an endless vault of anime waiting to be stolen.
        </p>
        <p>
          The heist theme is more than aesthetics — it reflects our approach: sleek, stealthy, and always
          one step ahead. Every interaction should feel like a carefully planned operation.
        </p>

        <h2 className="text-xl font-semibold text-accent">The Team</h2>
        <p>
          AniHeist is developed and maintained by <strong className="text-text">ZenxHamza</strong>, a solo developer passionate
          about anime and web development. The project is open-source and contributions are welcome.
        </p>

        <h2 className="text-xl font-semibold text-accent">Open Source</h2>
        <p>
          AniHeist is built with Next.js, TypeScript, Tailwind CSS, and Prisma. The entire codebase is
          available on GitHub. We believe in transparent development and welcome community contributions,
          bug reports, and feature suggestions.
        </p>
      </div>
    </div>
  );
}
