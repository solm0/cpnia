import { create } from "zustand";

interface GameEndState {
  gameEnded: boolean;
  setGameEnded: (gameEnded: boolean) => void;
}

export const useGameEndStore = create<GameEndState>((set) => ({
  gameEnded: false,
  setGameEnded: (gameEnded: boolean) => set({ gameEnded }),
}));