import { create } from "zustand";
import { persist } from "zustand/middleware";

type NpcConfig = {
  formality: string | null,
  verbosity: string | null,
  warmth: string | null
};

interface NpcConfigState {
  npcConfig: NpcConfig;
  setNpcConfig: (newConfig: NpcConfig) => void;
}

export const useNpcConfigStore = create<NpcConfigState>()(
  persist(
    (set) => ({
      npcConfig: {
        formality: null,
        verbosity: null,
        warmth: null,
      },
      setNpcConfig: (newConfig) =>
        set(() => ({
          npcConfig: newConfig,
        })),
    }),
    {
      name: 'npc-config',
    }
  )
);