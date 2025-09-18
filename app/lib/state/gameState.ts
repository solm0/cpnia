import { create } from "zustand";
import { persist } from "zustand/middleware";

type Games = Record<string, boolean>;
type World = { completed: boolean; games: Games };
type Worlds = Record<string, World>;

interface GameState {
  worlds: Worlds;
  setGame: (worldKey: string, gameKey: string, value: boolean) => void;
  setWorldCompleted: (worldKey: string, value: boolean) => void;
  reset: () => void;
  isWorldCompleted: (worldKey: string) => boolean;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      worlds: {
        time: { completed: false, games: { game1: false, game2: false, game3: false } },
        sacrifice: { completed: false, games: { game1: false, game2: false, game3: false } },
        entropy: { completed: false, games: { game1: false, game2: false, game3: false } },
      },
      setGame: (worldKey, gameKey, value) =>
        set((state) => ({
          worlds: {
            ...state.worlds,
            [worldKey]: {
              ...state.worlds[worldKey],
              Games: {
                ...state.worlds[worldKey].games,
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
            time: { completed: false, games: { game1: false, game2: false, game3: false } },
            sacrifice: { completed: false, games: { game1: false, game2: false, game3: false } },
            entropy: { completed: false, games: { game1: false, game2: false, game3: false } },
          },
        }),
      isWorldCompleted: (worldKey: string) => {
        const world = get().worlds[worldKey];
        if (!world) return false;
        console.log(worldKey, world)
        return Object.values(world.games).every((done) => done);
      },
    }),
    {
      name: 'game-storage',
    }
  )
);