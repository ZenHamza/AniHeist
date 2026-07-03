import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-text px-4">
      <h1 className="text-7xl font-extrabold text-accent">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-text-secondary mt-2 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 px-6 py-3 bg-accent hover:bg-accent-hover rounded-lg text-white font-medium transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
