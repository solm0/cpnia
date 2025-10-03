import ChatNpcForm from "./ChatNpcForm";
import { chatNpcBrains } from "@/app/lib/data/chatNpcBrain";
import { chatNpcProp } from "@/app/lib/data/chatNpcs";
import { useTimeChatStore, useSacrificeChatStore, useEntropyChatStore } from "@/app/lib/state/entropyChatState";
import { useState, useRef, useEffect } from "react";
import { TypingText } from "../../util/TypingText";

function NpcChatBlock({
  text, isLatest
}: {
  text: string;
  isLatest: boolean;
}) {
  return (
    <div className="w-full h-auto flex gap-3 max-w-6/7 self-start p-4">
      <div className="w-14 h-14 shrink-0 border-1 border-[#ffffff70] rounded-full"></div>
      <div className='text-white grow'>
        {isLatest ? <TypingText text={text} /> : <span>{text}</span>}
      </div>
    </div>
  )
}

function PlayerChatBlock({text}: {text:string}) {
  return (
    <div className='w-auto h-auto max-w-6/7 self-end text-lime-400 pr-6'>
      {text}
    </div>
  )
}

function NpcLoadingBlock({name}: {name: string}) {
  return (
    <div className="flex animate-pulse w-auto h-auto gap-3 self-start p-4">
      <div className="w-14 h-14 shrink-0 border-1 border-[#ffffff70] rounded-full"></div>
      <div className="text-white grow">
        {`${name}가 생각하고 있어요`}
      </div>   
    </div>
  )
}

export default function ChatNpcScreen({
  npcData, worldKey, handleClose
}: {
  npcData: chatNpcProp;
  worldKey: string;
  handleClose: (open: boolean) => void;
}) {
  const npcName = npcData.name;
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
    <div
      className="text-white break-keep absolute top-8 right-8 w-[30rem] h-2/3 bg-transparent flex flex-col pointer-events-none items-center backdrop-blur-sm border-3 border-[#ffffff70]"
      onWheel={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="absolute top-0 left-0 -z-10 w-full h-full bg-[#00000090] border-3 border-[#ffffff] blur-sm" />
      <div className="w-full flex items-center h-10 shrink-0">
        <p className="h-full flex items-center justify-center text-center grow border-1 border-[#ffffff70]">
          {npcName}와의 대화
        </p>
        <div
          onClick={() => handleClose(false)}
          className="h-full px-4 flex items-center border-1 border-[#ffffff70] pointer-events-auto hover:opacity-50 transition-opacity cursor-pointer"
        >
          닫기
        </div>
      </div>

      <div className="border-1 border-[#ffffff70] h-[calc(100%-2.5rem)] w-full pointer-events-auto">
        <div className="h-[calc(100%-9rem)] flex flex-col gap-2 overflow-y-scroll">
          {/* 채팅 기록 */}
          {messages.map((msg, idx) => (
            msg.from === "npc"
            ? <NpcChatBlock key={idx} text={msg.text} isLatest={idx === messages.length - 1} />
            : <PlayerChatBlock key={idx} text={msg.text} />
          ))}
          
          {loading && <NpcLoadingBlock name={npcName} /> }

          <div ref={bottomRef} />
        </div>

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