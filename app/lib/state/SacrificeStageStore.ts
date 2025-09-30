import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StageState {
  stage: number;
  setStage: (stage: number) => void;
  resetStage: () => void;
}

export const useStageStore = create<StageState>()(
  persist(
    (set) => ({
      stage: 0,
      setStage: (stage) => set({ stage }),
      resetStage: () => set({ stage: 0 }),
    }),
    {
      name: "stage-storage", // key in localStorage
    }
  )
);