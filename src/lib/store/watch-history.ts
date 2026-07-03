import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface WatchEntry {
  episodeId: string;
  animeId: string;
  animeTitle: string;
  animeImage: string;
  episodeNumber: number;
  progress: number;
  duration: number;
  timestamp: number;
}

interface WatchHistoryState {
  history: WatchEntry[];
  addToHistory: (entry: Omit<WatchEntry, "timestamp">) => void;
  removeFromHistory: (episodeId: string) => void;
  getContinueWatching: () => WatchEntry[];
  getProgress: (episodeId: string) => number;
  clearHistory: () => void;
}

export const useWatchHistory = create<WatchHistoryState>()(
  persist(
    immer((set, get) => ({
      history: [],

      addToHistory: (entry) =>
        set((state) => {
          const existingIdx = state.history.findIndex(
            (e) => e.episodeId === entry.episodeId
          );
          const fullEntry = { ...entry, timestamp: Date.now() };
          if (existingIdx !== -1) {
            state.history[existingIdx] = fullEntry;
          } else {
            state.history.unshift(fullEntry);
            if (state.history.length > 200) {
              state.history = state.history.slice(0, 200);
            }
          }
        }),

      removeFromHistory: (episodeId) =>
        set((state) => {
          state.history = state.history.filter(
            (e) => e.episodeId !== episodeId
          );
        }),

      getContinueWatching: () => {
        const { history } = get();
        return history
          .filter((e) => e.duration === 0 || e.progress < e.duration * 0.9)
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 20);
      },

      getProgress: (episodeId) => {
        const entry = get().history.find((e) => e.episodeId === episodeId);
        return entry?.progress ?? 0;
      },

      clearHistory: () => set({ history: [] }),
    })),
    {
      name: "aniheist-watch-history",
      version: 1,
      partialize: (state) => ({ history: state.history }),
    }
  )
);
