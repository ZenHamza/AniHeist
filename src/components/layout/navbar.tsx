"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { FaSearch, FaBars, FaTimes, FaSun, FaMoon, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useUIStore } from "@/lib/store/ui-store";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/trending", label: "Trending" },
  { href: "/popular", label: "Popular" },
  { href: "/recent", label: "Recent" },
  { href: "/genres", label: "Genres" },
];

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const { isMobileMenuOpen, toggleMobileMenu, theme, toggleTheme } = useUIStore();
  const { data: session } = useSession();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-1.5 shrink-0">
          <span className="text-xl font-bold text-accent">Ani</span>
          <span className="text-xl font-bold text-text">Heist</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 rounded-md text-sm font-medium text-text-secondary
                         hover:text-text hover:bg-surface transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => useUIStore.getState().setCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md
                       bg-surface border border-border text-sm text-text-muted
                       hover:text-text hover:border-border-focus transition-colors"
          >
            <FaSearch className="size-3.5" />
            <span className="hidden lg:inline">Search anime...</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5
                           rounded bg-surface-raised text-[10px] text-text-muted font-mono">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-text-secondary hover:text-text hover:bg-surface transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FaSun size={16} /> : <FaMoon size={16} />}
          </button>

          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface transition-colors"
              >
                {session.user.image ? (
                  <img src={session.user.image} alt="" className="size-8 rounded-full" />
                ) : (
                  <div className="size-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <FaUser className="size-4 text-accent" />
                  </div>
                )}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-2xl py-1 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-text truncate">{session.user.name || "User"}</p>
                    <p className="text-xs text-text-muted truncate">{session.user.email}</p>
                  </div>
                  <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text hover:bg-surface-hover transition-colors">
                    <FaUser size={14} /> Profile
                  </Link>
                  <button onClick={() => { setUserMenuOpen(false); signOut(); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-surface-hover transition-colors">
                    <FaSignOutAlt size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="hidden md:inline-flex items-center px-4 py-1.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
            >
              Sign In
            </Link>
          )}

          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-text-secondary hover:text-text transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-3 space-y-1">
            <form onSubmit={handleSearch} className="sm:hidden mb-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anime..."
                  className="w-full bg-surface border border-border rounded-full
                             py-2 pl-9 pr-4 text-sm text-text placeholder:text-text-muted
                             focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-text-muted" />
              </div>
            </form>
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => useUIStore.getState().setIsMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-md text-sm font-medium text-text-secondary
                           hover:text-text hover:bg-surface transition-colors"
              >
                {label}
              </Link>
            ))}
            {session?.user ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary border-b border-border">
                  {session.user.image && <img src={session.user.image} alt="" className="size-6 rounded-full" />}
                  <span>{session.user.name || "User"}</span>
                </div>
                <Link href="/profile" onClick={() => useUIStore.getState().setIsMobileMenuOpen(false)} className="block px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-text hover:bg-surface transition-colors">Profile</Link>
                <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-surface transition-colors">Sign Out</button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="block px-4 py-2 rounded-md text-sm font-medium
                           bg-accent text-white hover:bg-accent-hover transition-colors text-center mt-3"
              >
                Sign In
              </Link>
            )}
            <div className="mt-2 pt-2 border-t border-border space-y-1">
              <Link href="/legal/faq" onClick={() => useUIStore.getState().setIsMobileMenuOpen(false)} className="block px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-text hover:bg-surface transition-colors">FAQ</Link>
              <Link href="/legal/privacy" onClick={() => useUIStore.getState().setIsMobileMenuOpen(false)} className="block px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-text hover:bg-surface transition-colors">Privacy</Link>
              <Link href="/legal/terms" onClick={() => useUIStore.getState().setIsMobileMenuOpen(false)} className="block px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-text hover:bg-surface transition-colors">Terms</Link>
              <Link href="/legal/dmca" onClick={() => useUIStore.getState().setIsMobileMenuOpen(false)} className="block px-4 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-text hover:bg-surface transition-colors">DMCA</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
