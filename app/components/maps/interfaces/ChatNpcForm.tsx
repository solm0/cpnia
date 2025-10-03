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

  function PlayerAnswerOptions() {
    return (
      <div className="relative flex flex-col items-start w-auto h-auto border-2 border-[#ffffff70] bg-black p-4 gap-2">
        <div className="absolute top-0 left-0 w-full h-full -z-10" />
        
        {playerLines.map(index => {
          const line = chatPlayerLines[formality ?? '하십시오체'][index];
  
          return (
            <div
              key={index}
              onClick={() => {
                setInput(line);
                setPlayerLines(prev => prev.filter(i => i !== index));
              }}
              className="w-full text-lime-400 hover:opacity-50 transition-opacity flex items-center"
            >
              {`> ${line}`}
            </div>
          )
        }
        )}
      </div>
    )
  }

  function PlayerAnswerInput() {
    return (
      <div className="h-10 w-full shrink-0 flex gap-4 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-full text-right max-w-6/7 text-lime-400 truncate focus:outline-none border-b"
          disabled={loading}
          placeholder={`${npcName}에게 물어보기`}
        />
        <button
          type="button"
          onClick={() => handleSubmit()}
          className="h-full px-4 flex items-center border-1 border-[#ffffff70] pointer-events-auto hover:opacity-50 transition-opacity cursor-pointer"
        >
          전송
        </button>
      </div>
    )
  }

  return (
    <div className="fixed">
      <label htmlFor="form" className="hidden">{`${npcName}에게 물어보기`}</label>
      <form
        id='form'
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="shrink-0 fixed flex flex-col gap-4 w-full h-28 px-5 bottom-8"
      >
        <PlayerAnswerInput />
        {playerLines.length != 0 && <PlayerAnswerOptions />}
      </form>
    </div>
  )
}