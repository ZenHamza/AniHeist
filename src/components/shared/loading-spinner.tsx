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
