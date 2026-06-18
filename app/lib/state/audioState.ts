import { create } from "zustand";

interface AudioState {
  isBgmEnabled: boolean;
  setBgmEnabled: (value: boolean) => void;
  toggleBgm: () => void;
}

export const useAudioStore = create<AudioState>()((set) => ({
  isBgmEnabled: false,
  setBgmEnabled: (value) => set({ isBgmEnabled: value }),
  toggleBgm: () =>
    set((state) => ({
      isBgmEnabled: !state.isBgmEnabled,
    })),
}));
