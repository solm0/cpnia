'use client'

import { useEffect, useState, useRef } from "react";
import { chatNpcProp } from "@/app/lib/data/chatNpcs";
import { useNpcConfigStore } from "@/app/lib/state/npcConfigState";
import { chatNpcLines } from "@/app/lib/data/chatNpcLines";
import { useTimeChatStore, useSacrificeChatStore, useEntropyChatStore } from "@/app/lib/state/entropyChatState";
import { TimePlayerAnswerOptions, SacrificePlayerAnswerOptions, EntropyPlayerAnswerOptions } from "./PlayerAnswerOptions";
import { TimePlayerAnswerInput, SacrificePlayerAnswerInput, EntropyPlayerAnswerInput } from "./PlayerAnswerInputs";

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

  switch (worldKey) {
    case 'time':
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
    
            <TimePlayerAnswerInput
              input={input}
              setInput={setInput}
              loading={loading}
              npcName={npcName}
              handleSubmit={handleSubmit}
            />
    
            {playerLines.length != 0 &&
              <TimePlayerAnswerOptions
                playerLines={playerLines}
                setPlayerLines={setPlayerLines}
                formality={formality}
                setInput={setInput}
              />
            }
          </form>
        </div>
      )
    case 'sacrifice':
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

            <SacrificePlayerAnswerInput
              input={input}
              setInput={setInput}
              loading={loading}
              npcName={npcName}
              handleSubmit={handleSubmit}
            />
    
            {playerLines.length != 0 &&
              <SacrificePlayerAnswerOptions
                playerLines={playerLines}
                setPlayerLines={setPlayerLines}
                formality={formality}
                setInput={setInput}
              />
            }
          </form>
        </div>
      )
    case 'entropy':
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

            <EntropyPlayerAnswerInput
              input={input}
              setInput={setInput}
              loading={loading}
              npcName={npcName}
              handleSubmit={handleSubmit}
            />
    
            {playerLines.length != 0 &&
              <EntropyPlayerAnswerOptions
                playerLines={playerLines}
                setPlayerLines={setPlayerLines}
                formality={formality}
                setInput={setInput}
              />
            }
          </form>
        </div>
      )
  }
}