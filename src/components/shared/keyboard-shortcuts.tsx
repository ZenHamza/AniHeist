"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FaSearch,
  FaPlay,
  FaPause,
  FaExpand,
  FaForward,
  FaBackward,
  FaVolumeMute,
  FaVolumeUp,
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
} from "react-icons/fa";

const shortcuts = [
  { keys: ["Ctrl", "K"], action: "Open search", icon: FaSearch },
  { keys: ["/"], action: "Focus search", icon: FaSearch },
  { keys: ["Enter"], action: "Select / Navigate" },
  { keys: ["ESC"], action: "Close modals", icon: FaTimes },
  { keys: ["Shift", "P"], action: "Previous episode", icon: FaBackward },
  { keys: ["Shift", "N"], action: "Next episode", icon: FaForward },
  { keys: ["K"], keysAlt: ["Space"], action: "Play / Pause", icon: FaPlay },
  { keys: ["F"], action: "Fullscreen", icon: FaExpand },
  { keys: ["J"], action: "Rewind 10s", icon: FaBackward },
  { keys: ["L"], action: "Forward 10s", icon: FaForward },
  { keys: ["Left", "Arrow"], action: "Rewind 5s", icon: FaArrowLeft },
  { keys: ["Right", "Arrow"], action: "Forward 5s", icon: FaArrowRight },
  { keys: ["M"], action: "Mute / Unmute", icon: FaVolumeUp },
];

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === "?") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={close}>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg mx-4 bg-[#121214] border border-white/[0.06] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white/85">Keyboard Shortcuts</h2>
          <button
            onClick={close}
            className="size-6 flex items-center justify-center rounded-md text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
          >
            <FaTimes size={12} />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-4">
          <div className="grid gap-2">
            {shortcuts.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors"
                >
                  {Icon && <Icon className="size-3.5 text-white/30 shrink-0" />}
                  <span className="flex-1 text-sm text-white/70">{s.action}</span>
                  <div className="flex items-center gap-1">
                    {(s.keysAlt || s.keys).map((key, j) => (
                      <span key={j}>
                        {j > 0 && <span className="text-[10px] text-white/20 mx-0.5">or</span>}
                        <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[11px] text-white/40 font-mono leading-none">
                          {key}
                        </kbd>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-center px-5 py-2.5 border-t border-white/[0.04] text-[10px] text-white/20">
          Press <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-white/30 font-mono mx-1">Shift</kbd> +{" "}
          <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-white/30 font-mono mx-1">/</kbd> to toggle this menu
        </div>
      </div>
    </div>
  );
}
