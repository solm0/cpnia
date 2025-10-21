import ChatNpcForm from "./ChatNpcForm";
import { chatNpcBrains } from "@/app/lib/data/prompts/chatNpcBrain";
import { chatNpcProp } from "@/app/lib/data/positions/chatNpcs";
import { useTimeChatStore, useSacrificeChatStore, useEntropyChatStore } from "@/app/lib/state/entropyChatState";
import { useState, useRef, useEffect } from "react";
import Button from "../../../util/Button";
import { TimeNpcChatBlock, SacrificeNpcChatBlock, EntropyNpcChatBlock } from "./NpcChatBlocks";
import { TimePlayerChatBlock, SacrificePlayerChatBlock, EntropyPlayerChatBlock } from "./PlayerChatBlocks";
import { TimeNpcLoadingBlock, SacrificeNpcLoadingBlock, EntropyNpcLoadingBlock } from "./NpcLoadingBlocks";
import { nanumGothicCodingBold } from "@/app/lib/fonts";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";

export default function ChatNpcScreen({
  npcData, worldKey, setIsChatOpen, isChatOpen
}: {
  npcData: chatNpcProp;
  worldKey: string;
  setIsChatOpen: (open: boolean) => void;
  isChatOpen: boolean;
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

  let content:React.ReactNode = null;

  const gamepad = useGamepadControls();

  useEffect(() => {
    let prevPressed = false;
  
    function checkPause() {
      const pressed = Boolean(gamepad?.current?.buttons[2]);
      if (pressed && !prevPressed) {
        // @ts-expect-error fff
        setIsChatOpen(prev => !prev);
      }
      prevPressed = pressed;
    }
  
    const interval = setInterval(checkPause, 50);
    return () => clearInterval(interval);
  }, [gamepad]);

  switch(worldKey) {
    case 'time':
      content = (
        <div
          className={`
            text-white break-keep absolute top-8 right-8 transition-[width,height] bg-transparent flex flex-col pointer-events-auto items-center backdrop-blur-sm border-3 border-[#ffffff70] w-[30rem] h-2/3 overflow-visible
            z-80
            ${nanumGothicCodingBold.className}
          `}
          onWheel={(e) => { e.stopPropagation() }}
        >
          <div className="absolute top-0 left-0 -z-10 w-full h-full bg-[#00000090] border-3 border-[#ffffff] blur-sm" />
          <div className="w-full flex items-center h-12 shrink-0">
            <p className="h-full flex items-center justify-start text-center grow border-1 border-[#ffffff70] pl-4">
              {npcName}와의 대화
            </p>
            <Button
              onClick={() => setIsChatOpen(false)}
              label="닫기"
              worldKey="time"
              small={true}
            />
          </div>
    
          <div className="border-1 border-[#ffffff70] h-[calc(100%-3rem)] w-full pointer-events-auto">
            <div className="h-[calc(100%-9rem)] flex flex-col gap-2 overflow-y-scroll">
              {/* 채팅 기록 */}
              {messages.map((msg, idx) => (
                msg.from === "npc"
                ? <TimeNpcChatBlock key={idx} text={msg.text} isLatest={idx === messages.length - 1} />
                : <TimePlayerChatBlock key={idx} text={msg.text} />
              ))}
              
              {loading && <TimeNpcLoadingBlock name={npcName} /> }
    
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
      break;
    case 'sacrifice':
      content = (
        <div
          className={`
            text-white font-bold break-keep absolute top-8 right-8 transition-[width,height] p-4 flex flex-col pointer-events-none items-center backdrop-blur-sm rounded-4xl w-[30rem] h-2/3 overflow-visible
            ${nanumGothicCodingBold.className}
          `}
          onWheel={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="absolute top-0 left-0 -z-10 w-full h-full bg-[#ae4bff95] blur-sm" />
          <div className="w-full flex items-center h-12 shrink-0 pr-4">
            <p className="h-full flex items-center justify-start text-center grow pl-4">
              {npcName}와의 대화
            </p>
            <Button
              onClick={() => setIsChatOpen(false)}
              label="닫기"
              worldKey="sacrifice"
            />
          </div>

          <div className="border-b-5 border-yellow-300 w-full border-double" ></div>
    
          <div className="h-[calc(100%-2.5rem)] w-full pointer-events-auto">
            <div className="h-[calc(100%-9rem)] flex flex-col gap-2 overflow-y-scroll">
              {/* 채팅 기록 */}
              {messages.map((msg, idx) => (
                msg.from === "npc"
                ? <SacrificeNpcChatBlock key={idx} text={msg.text} isLatest={idx === messages.length - 1} />
                : <SacrificePlayerChatBlock key={idx} text={msg.text} />
              ))}
              
              {loading && <SacrificeNpcLoadingBlock name={npcName} /> }
    
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
      break;
    case 'entropy':
      content = (
        <div
          className={`
            text-white break-keep absolute top-8 right-8 transition-[width,height] bg-transparent flex flex-col pointer-events-none items-center backdrop-blur-sm border-3 border-[#ffffff70] w-[30rem] h-2/3 overflow-visible
            ${nanumGothicCodingBold.className}
          `}
          onWheel={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="absolute top-0 left-0 -z-10 w-full h-full bg-[#00000090] border-3 border-[#ffffff] blur-sm" />
          <div className="w-full flex items-center h-10 shrink-0">
            <p className="h-full flex items-center justify-start text-center grow border-1 border-[#ffffff70] pl-4">
              {npcName}와의 대화
            </p>
            <Button
              onClick={() => setIsChatOpen(false)}
              label="닫기"
              worldKey="time"
            />
          </div>
    
          <div className="border-1 border-[#ffffff70] h-[calc(100%-2.5rem)] w-full pointer-events-auto">
            <div className="h-[calc(100%-9rem)] flex flex-col gap-2 overflow-y-scroll">
              {/* 채팅 기록 */}
              {messages.map((msg, idx) => (
                msg.from === "npc"
                ? <EntropyNpcChatBlock key={idx} text={msg.text} isLatest={idx === messages.length - 1} />
                : <EntropyPlayerChatBlock key={idx} text={msg.text} />
              ))}
              
              {loading && <EntropyNpcLoadingBlock name={npcName} /> }
    
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
      break;
  }

  if (isChatOpen) {
    return content;
  }
}