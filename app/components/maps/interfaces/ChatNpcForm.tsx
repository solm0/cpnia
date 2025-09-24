'use client'

import { useState } from "react";
import Button from "../../util/Button";
import { chatNpcProp } from "@/app/lib/data/chatNpcs";
import { useNpcConfigStore } from "@/app/lib/state/npcConfigState";

export default function ChatNpcForm({
  npcData, npcBrain,
}: {
  npcData: chatNpcProp;
  npcBrain: string;
}) {
  const npcName = npcData.name;
  const npcWorld = npcData.world;

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const npcConfig = useNpcConfigStore(state => state.npcConfig);

  async function onSubmit(inputText: string) {
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: npcName, world: npcWorld, brain: npcBrain, message: inputText, parameter: npcConfig}),
      })

      const result:string = await response.json();
      console.log("message received:", result);

      // response를 기존 json에 추가해야됨.
      // 초기 json은 worldKey, 보낸사람, 월드별 첫대사가 들어간 default json을 이 컴포넌트의 부모에서 set해야됨.
      // 먼저 json 구조를 짜고, zustand파일을 만들고, 거기다 추가를 어케할지.
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
    <div>
      <label htmlFor="form" className="hidden">{`${npcName}에게 물어보기`}</label>
      <form
        id='form'
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-2 items-center"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-96 h-10 rounded-full bg-gray-200 p-4 truncate"
          disabled={loading}
          placeholder={`${npcName}에게 물어보기. Enter를 쳐서 전송`}
        />
        {loading && `${npcName}가 생각하고 있어요`}
      </form>
    </div>
  )
}