import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  isMobileMenuOpen: boolean;
  isCommandPaletteOpen: boolean;
  theme: "dark" | "light";
  setIsMobileMenuOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light") => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isMobileMenuOpen: false,
      isCommandPaletteOpen: false,
      theme: "dark",
      setIsMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
      toggleMobileMenu: () =>
        set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
      toggleTheme: () =>
        set((s) => {
          const next = s.theme === "dark" ? "light" : "dark";
          if (typeof document !== "undefined") {
            document.documentElement.classList.remove("dark", "light");
            document.documentElement.classList.add(next);
          }
          return { theme: next };
        }),
      setTheme: (theme) => {
        if (typeof document !== "undefined") {
          document.documentElement.classList.remove("dark", "light");
          document.documentElement.classList.add(theme);
        }
        set({ theme });
      },
    }),
    { name: "aniheist-ui" }
  )
);
