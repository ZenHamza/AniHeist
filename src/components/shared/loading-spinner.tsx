export function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-20 ${className}`}>
      <div className="relative">
        <div className="size-12 rounded-full border-2 border-border animate-pulse" />
        <div className="absolute inset-0 size-12 rounded-full border-2 border-t-accent animate-spin" />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 space-y-12 animate-pulse">
      <div className="h-96 bg-surface rounded-xl" />
      <div className="space-y-4">
        <div className="h-8 w-48 bg-surface rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-surface rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-2 animate-pulse">
          <div className="aspect-[3/4] bg-surface rounded-xl" />
          <div className="h-3 w-3/4 bg-surface rounded" />
          <div className="h-2 w-1/2 bg-surface rounded" />
        </div>
      ))}
    </div>
  );
}

export function SlideSkeleton() {
  return (
    <div className="h-[65vh] min-h-[500px] max-h-[750px] w-full animate-pulse bg-surface rounded-none" />
  );
}

export function PlayerSkeleton() {
  return (
    <div className="w-full aspect-video bg-surface rounded-xl animate-pulse flex items-center justify-center">
      <div className="size-16 rounded-full border-2 border-border animate-pulse" />
    </div>
  );
}

export function EpisodeListSkeleton({ count = 24 }: { count?: number }) {
  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-8 xl:grid-cols-10 gap-1 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-square bg-surface rounded-md" />
      ))}
    </div>
  );
}
