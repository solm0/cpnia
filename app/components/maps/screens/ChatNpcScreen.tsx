import Button from "../../util/Button";
import ChatNpcForm from "../interfaces/ChatNpcForm";
import { chatNpcBrains } from "@/app/lib/data/chatNpcBrain";
import { chatNpcProp } from "@/app/lib/data/chatNpcs";
import { useTimeChatStore, useSacrificeChatStore, useEntropyChatStore } from "@/app/lib/state/entropyChatState";
import { useState, useRef, useEffect } from "react";

export default function ChatNpcScreen({
  npcData, worldKey, handleClose
}: {
  npcData: chatNpcProp;
  worldKey: string;
  handleClose: (open: boolean) => void;
}) {
  const npcBrain = chatNpcBrains[worldKey];

  type WorldKey = "time" | "sacrifice" | "entropy";

  const storeMap = {
    time: useTimeChatStore,
    sacrifice: useSacrificeChatStore,
    entropy: useEntropyChatStore,
  } as const;

  const key: WorldKey = worldKey as WorldKey;
  const messages = storeMap[key](state => state.messages);

  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="absolute bottom-0 right-0 w-auto pr-8 h-2/3 bg-transparent flex flex-col items-end justify-between pointer-events-none text-sm gap-2">

      <Button
        onClick={() => handleClose(false)}
        label="닫기"
      />

      {/* 채팅 */}
      <div className="flex flex-col gap-2 overflow-y-scroll h-full w-96 pointer-events-auto mb-36">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`
              w-auto max-w-5/6 break-keep h-auto rounded-[1.4rem] px-4 py-2
              ${message.from === 'npc' ? 'self-start bg-[#ffffff99] backdrop-blur-sm border border-gray-300 text-gray-700' : 'self-end bg-[#00000099] backdrop-blur-sm text-white border border-gray-700'}
            `}
          >
            {message.text}
          </div>
        ))}
        {loading &&
          <div className="animate-pulse w-auto h-auto rounded-full px-4 py-2 bg-gray-200 self-start">
            {loading && `${npcData.name}가 생각하고 있어요`}
          </div>
        }
        <div ref={bottomRef} />

        {/* 인풋창 */}
        <ChatNpcForm
          worldKey={worldKey}
          npcData={npcData}
          npcBrain={npcBrain}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  )
}