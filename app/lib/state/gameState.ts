import { create } from "zustand";

type MiniGames = Record<string, boolean>;
type World = { completed: boolean; miniGames: MiniGames };
type Worlds = Record<string, World>;

interface GameState {
  worlds: Worlds;
  setMiniGame: (worldKey: string, gameKey: string, value: boolean) => void;
  setWorldCompleted: (worldKey: string, value: boolean) => void;
  reset: () => void;
  isWorldCompleted: (worldKey: string) => boolean;
}

// Zustand store
export const useGameStore = create<GameState>((set, get) => ({
  worlds: {
    time: { completed: false, miniGames: { game1: false, game2: false, game3: false } },
    sacrifice: { completed: false, miniGames: { game1: false, game2: false, game3: false } },
    entropy: { completed: false, miniGames: { game1: false, game2: false, game3: false } },
  },
  setMiniGame: (worldKey, gameKey, value) =>
    set((state) => ({
      worlds: {
        ...state.worlds,
        [worldKey]: {
          ...state.worlds[worldKey],
          miniGames: {
            ...state.worlds[worldKey].miniGames,
            [gameKey]: value,
          },
        },
      },
    })),
  setWorldCompleted: (worldKey, value) =>
    set((state) => ({
      worlds: {
        ...state.worlds,
        [worldKey]: {
          ...state.worlds[worldKey],
          completed: value,
        },
      },
    })),
  reset: () =>
    set({
      worlds: {
        time: { completed: false, miniGames: { game1: false, game2: false, game3: false } },
        sacrifice: { completed: false, miniGames: { game1: false, game2: false, game3: false } },
        entropy: { completed: false, miniGames: { game1: false, game2: false, game3: false } },
      },
    }),
  isWorldCompleted: (worldKey: string) => {
    const miniGames = get().worlds[worldKey].miniGames;
    return Object.values(miniGames).every((done) => done);
  },
}));