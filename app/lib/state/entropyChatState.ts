import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ChatMessage = {
  from: 'npc' | 'player';
  text: string;
};

interface ChatStore {
  messages: ChatMessage[];
  addMessage: (newMessage: ChatMessage) => void;
  clearMessages: () => void;
}

export const useTimeChatStore = create<ChatStore>() (
  persist(
    (set) => ({
      messages: [],
      addMessage: (newMessage) =>
        set(state => ({
          messages: [...state.messages, newMessage],
        })),
      clearMessages: () =>
        set(() => ({
          messages: [],
        })),
    }),
    {
      name: 'time-chat',
    }
  )
)


export const useSacrificeChatStore = create<ChatStore>() (
  persist(
    (set) => ({
      messages: [],
      addMessage: (newMessage) =>
        set(state => ({
          messages: [...state.messages, newMessage],
        })),
      clearMessages: () =>
        set(() => ({
          messages: [],
        })),
    }),
    {
      name: 'sacrifice-chat',
    }
  )
)


export const useEntropyChatStore = create<ChatStore>() (
  persist(
    (set) => ({
      messages: [],
      addMessage: (newMessage) =>
        set(state => ({
          messages: [...state.messages, newMessage],
        })),
      clearMessages: () =>
        set(() => ({
          messages: [],
        })),
    }),
    {
      name: 'entropy-chat',
    }
  )
)