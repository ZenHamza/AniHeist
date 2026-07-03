"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FaSearch, FaPlay, FaStar } from "react-icons/fa";
import { useUIStore } from "@/lib/store/ui-store";

export function CommandPalette() {
  const isOpen = useUIStore((s) => s.isCommandPaletteOpen);
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const [q, setQ] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["cmd-search", q],
    queryFn: async () => {
      if (q.length < 2) return [];
      const r = await fetch(`/api/cached/search?q=${encodeURIComponent(q)}`);
      if (!r.ok) return [];
      const text = await r.text();
      if (!text) return [];
      const d = JSON.parse(text);
      return d.status === "success" ? d.data : [];
    },
    staleTime: 30 * 1000,
  });

  const results = (data || []) as { id: number; title: string; cover_image: string; score: number; year: number; format: string }[];

  useEffect(() => {
    if (isOpen) {
      setQ("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const select = useCallback((id: number) => {
    setOpen(false);
    router.push(`/anime/${id}`);
  }, [setOpen, router]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, results.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && results[selectedIndex]) { select(results[selectedIndex].id); }
      if (e.key === "Escape") { setOpen(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, results, selectedIndex, select, setOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(!isOpen);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, setOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-xl bg-[#121214] border border-white/[0.06] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <FaSearch className="size-4 text-white/30 shrink-0" />
          <input ref={inputRef} type="text" value={q} onChange={(e) => { setQ(e.target.value); setSelectedIndex(0); }} placeholder="Search anime by title..." className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none" />
          <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] text-white/30 font-mono">ESC</kbd>
        </div>
        {q.length > 0 && q.length < 2 && (
          <div className="px-5 py-8 text-center text-xs text-white/20">Type at least 2 characters to search</div>
        )}
        {q.length >= 2 && results.length === 0 && (
          <div className="px-5 py-8 text-center text-xs text-white/20">No results found</div>
        )}
        {results.length > 0 && (
          <div className="max-h-[50vh] overflow-y-auto py-2">
            {results.slice(0, 10).map((anime, i) => (
              <button key={anime.id} onClick={() => select(anime.id)} onMouseEnter={() => setSelectedIndex(i)} className={`flex items-center gap-4 w-full px-5 py-2.5 text-left transition-colors ${i === selectedIndex ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"}`}>
                <img src={anime.cover_image || `https://img.anili.st/media/${anime.id}`} alt="" className="w-9 h-13 rounded-lg object-cover ring-1 ring-white/5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/85 truncate">{anime.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {anime.score > 0 && <span className="flex items-center gap-0.5 text-[10px] text-amber-400"><FaStar size={8} />{anime.score}%</span>}
                    <span className="text-[10px] text-white/25">{anime.format}</span>
                    {anime.year > 0 && <span className="text-[10px] text-white/25">{anime.year}</span>}
                  </div>
                </div>
                <FaPlay size={12} className="text-white/20 shrink-0" />
              </button>
            ))}
            {results.length > 10 && (
              <div className="px-5 py-2 text-center text-[10px] text-white/15 border-t border-white/[0.04]">
                Type <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-white/30 font-mono">Enter</kbd> for full search results
              </div>
            )}
          </div>
        )}
        <div className="flex items-center gap-4 px-5 py-2.5 border-t border-white/[0.04] text-[10px] text-white/20">
          <span><kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-white/30 font-mono mr-1">↑↓</kbd> Navigate</span>
          <span><kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-white/30 font-mono mr-1">⏎</kbd> Select</span>
          <span><kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-white/30 font-mono mr-1">ESC</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}
