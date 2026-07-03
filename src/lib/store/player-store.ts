import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlayerState {
  volume: number;
  muted: boolean;
  playbackRate: number;
  preferredQuality: string;
  autoPlay: boolean;
  autoSkipIntro: boolean;
  autoNext: boolean;
  subtitleLanguage: string;

  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  setQuality: (quality: string) => void;
  setSubtitleLanguage: (lang: string) => void;
  setAutoPlay: (on: boolean) => void;
  setAutoSkipIntro: (on: boolean) => void;
  setAutoNext: (on: boolean) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      volume: 1,
      muted: false,
      playbackRate: 1,
      preferredQuality: "auto",
      autoPlay: true,
      autoSkipIntro: true,
      autoNext: true,
      subtitleLanguage: "en",

      setVolume: (volume) => set({ volume, muted: volume === 0 }),
      toggleMute: () => set((s) => ({ muted: !s.muted })),
      setPlaybackRate: (rate) => set({ playbackRate: rate }),
      setQuality: (quality) => set({ preferredQuality: quality }),
      setSubtitleLanguage: (lang) => set({ subtitleLanguage: lang }),
      setAutoPlay: (autoPlay) => set({ autoPlay }),
      setAutoSkipIntro: (autoSkipIntro) => set({ autoSkipIntro }),
      setAutoNext: (autoNext) => set({ autoNext }),
    }),
    {
      name: "aniheist-player-preferences",
      version: 1,
    }
  )
);
