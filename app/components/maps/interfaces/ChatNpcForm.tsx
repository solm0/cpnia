'use client'

import { useEffect, useState, useRef } from "react";
import { chatNpcProp } from "@/app/lib/data/chatNpcs";
import { useNpcConfigStore } from "@/app/lib/state/npcConfigState";
import { chatNpcLines } from "@/app/lib/data/chatNpcLines";
import { chatPlayerLines } from "@/app/lib/data/chatPlayerLines";
import { useTimeChatStore, useSacrificeChatStore, useEntropyChatStore } from "@/app/lib/state/entropyChatState";

export default function ChatNpcForm({
  worldKey, npcData, npcBrain, loading, setLoading,
}: {
  worldKey: string;
  npcData: chatNpcProp;
  npcBrain: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) {
  const npcName = npcData.name;
  const npcWorld = npcData.world;

  const [input, setInput] = useState('');
  const [playerLines, setPlayerLines] = useState([1,2,3]);

  const npcConfig = useNpcConfigStore(state => state.npcConfig);
  const {formality, verbosity, warmth } = npcConfig;

  type WorldKey = "time" | "sacrifice" | "entropy";

  const storeMap = {
    time: useTimeChatStore,
    sacrifice: useSacrificeChatStore,
    entropy: useEntropyChatStore,
  } as const;

  const key: WorldKey = worldKey as WorldKey; // cast incoming string
  const messages = storeMap[key](state => state.messages);
  const addMessage = storeMap[key](state => state.addMessage);

  // npc 첫 대사
  const firstLineAdded = useRef(false);

  useEffect(() => {
    if (!firstLineAdded.current && messages.length === 0) {
      if (!formality || !verbosity || !warmth) return;
      const npcLine = chatNpcLines[formality]?.[verbosity]?.[warmth]?.[0] ?? 'npc 대사를 찾을 수 없습니다';
      addMessage({ from: 'npc', text: npcLine });
      firstLineAdded.current = true;
    }
  }, [])

  async function onSubmit(inputText: string) {
    setLoading(true);
    addMessage({ from: 'player', text: inputText });

    try {
      const response = await fetch('/api/chat', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: npcName,
          world: npcWorld,
          brain: npcBrain,
          message: inputText,
          parameter: npcConfig
        }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value);
        }
      }
      addMessage({ from: 'npc', text: buffer });
    } catch(err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit() {
    if (!input.trim()) {
      alert('예시 질문중에 고르거나 말을 입력해주시죠?');
      return;
    }
    onSubmit(input.trim());
    setInput("");
  }

  return (
    <>
      <label htmlFor="form" className="hidden">{`${npcName}에게 물어보기`}</label>
      <form
        id='form'
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-2 w-full items-end fixed right-8 bottom-8"
      >
        {/* 채팅창 */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-96 h-10 rounded-full bg-[#00000099] backdrop-blur-sm text-white border border-gray-700 p-4 truncate"
          disabled={loading}
          placeholder={`${npcName}에게 물어보기. Enter를 쳐서 전송`}
        />

        {/* 질문 선택지 */}
        <div className="flex gap-2 w-auto h-auto">
          {playerLines.map(index => {
            const line = chatPlayerLines[formality ?? '하십시오체'][index];
            return (
              <div
                key={index}
                onClick={() => {
                  onSubmit(line);
                  setPlayerLines(prev => prev.filter(i => i !== index));
                }}
                className="w-auto h-10 rounded-full bg-[#00000099] backdrop-blur-sm text-white border border-gray-700 p-4 flex items-center hover:bg-[#00000080]"
              >
                {line}
              </div>
            )
          }
          )}
        </div>
      </form>
    </>
  )
}