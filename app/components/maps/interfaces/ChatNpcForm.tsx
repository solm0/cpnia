'use client'

import { useEffect, useState, useRef } from "react";
import { chatNpcProp } from "@/app/lib/data/chatNpcs";
import { useNpcConfigStore } from "@/app/lib/state/npcConfigState";
import { useEntropyChatStore } from "@/app/lib/state/entropyChatState";
import { chatNpcLines } from "@/app/lib/data/chatNpcLines";

export default function ChatNpcForm({
  npcData, npcBrain, loading, setLoading,
}: {
  npcData: chatNpcProp;
  npcBrain: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) {
  const npcName = npcData.name;
  const npcWorld = npcData.world;

  const [input, setInput] = useState('');

  const npcConfig = useNpcConfigStore(state => state.npcConfig);
  const {formality, verbosity, warmth } = npcConfig;
  
  const message = useEntropyChatStore(state => state.messages);
  const addMessage = useEntropyChatStore(state => state.addMessage);

  // npc 첫 대사
  const firstLineAdded = useRef(false);

  useEffect(() => {
    if (!firstLineAdded.current && message.length === 0) {
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
      alert('예상질문중에 고르거나 말을 입력해주시죠?');
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
        className="flex flex-col gap-2 w-full items-end"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-96 h-10 rounded-full bg-gray-200 p-4 truncate"
          disabled={loading}
          placeholder={`${npcName}에게 물어보기. Enter를 쳐서 전송`}
        />
      </form>
    </>
  )
}