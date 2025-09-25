import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserNameState {
  userName: string | null;
  setUserName: (name: string) => void;
}

export const useUserNameStore = create<UserNameState>()(
  persist(
    (set) => ({
      userName: null,
      setUserName: (newConfig) =>
        set(() => ({
          userName: newConfig,
        })),
    }),
    {
      name: 'user-name',
    }
  )
)