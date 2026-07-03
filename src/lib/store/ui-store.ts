import { create } from "zustand";

interface UIState {
  isMobileMenuOpen: boolean;
  isCommandPaletteOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isMobileMenuOpen: false,
  isCommandPaletteOpen: false,
  setIsMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  toggleMobileMenu: () =>
    set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
}));
