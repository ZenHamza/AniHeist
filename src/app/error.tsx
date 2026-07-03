"use client";

import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-text px-4">
      <h1 className="text-5xl font-extrabold text-accent">Oops!</h1>
      <h2 className="text-xl font-semibold mt-4">Something went wrong</h2>
      <p className="text-text-secondary mt-2 text-center max-w-md text-sm">
        {error.message || "An unexpected error occurred."}
      </p>
      <div className="flex gap-3 mt-6">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-accent hover:bg-accent-hover rounded-lg text-white font-medium transition-colors text-sm"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 bg-surface border border-border hover:bg-surface-hover rounded-lg text-text font-medium transition-colors text-sm"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
