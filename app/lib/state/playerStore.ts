import { create } from "zustand";

interface PlayerState {
  isMoving: boolean;
  position: { x: number; y: number; z: number };
  setIsMoving: (isMoving: boolean) => void;
  setPosition: (pos: { x: number; y: number; z: number }) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  isMoving: false,
  position: { x: 0, y: 0, z: 0 },

  setIsMoving: (isMoving: boolean) => set({ isMoving }),
  setPosition: (pos: { x: number; y: number; z: number }) => set({ position: pos }),
}));