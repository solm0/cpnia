import Button from "../../util/Button";
import SmallScene from "../../util/SmallScene";
import Model from "../../util/Model";
import ChatNpcForm from "../interfaces/ChatNpcForm";
import { chatNpcBrains } from "@/app/lib/data/chatNpcBrain";
import { chatNpcProp } from "@/app/lib/data/chatNpcs";
import { useEntropyChatStore } from "@/app/lib/state/entropyChatState";
import { useState } from "react";
import ThreeDotLoader from "../../util/ThreeDotLoader";

export default function ChatNpcScreen({
  npcData, worldKey, handleClose
}: {
  npcData: chatNpcProp;
  worldKey: string;
  handleClose: (open: boolean) => void;
}) {
  const npcBrain = chatNpcBrains[worldKey];
  const messages = useEntropyChatStore((state) => state.messages);
  const [loading, setLoading] = useState(false);

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-gray-100 flex flex-col items-center p-32 justify-between pointer-events-auto">
      
      {/* 아바타들의 아이콘 */}
      <div className="w-56 absolute top-0 left-0">
        <SmallScene>
          <Model
            src="/models/chat-npc.glb"
            scale={3.6}
            position={[0, -0.9, 0]}
            rotation={[0, Math.PI, 0]}
          />
        </SmallScene>
      </div>
      <div className="w-56 absolute bottom-0 right-0">
        <SmallScene>
          <Model
            src="/models/avatar.glb"
            scale={3.6}
            position={[0, -0.9, 0]}
            rotation={[0, Math.PI, 0]}
          />
        </SmallScene>
      </div>

      {/* 채팅내역 */}
      <div className="flex flex-col gap-2 w-full overflow-y-scroll">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`w-3/4 h-auto rounded-full px-4 py-2 bg-gray-200 text-gray-700 ${message.from === 'npc' ? 'self-start' : 'self-end'}`}
          >
            {message.text}
          </div>
        ))}
        {loading &&
          <div className="animate-pulse w-3/4 h-auto rounded-full px-4 py-2 bg-gray-200 self-start">
            {loading && `${npcData.name}가 생각하고 있어요`}
          </div>
        }
      </div>

      {/* 인풋창 */}
      <ChatNpcForm
        npcData={npcData}
        npcBrain={npcBrain}
        loading={loading}
        setLoading={setLoading}
      />
      
      <Button
        onClick={() => handleClose(false)}
        label="닫기"
      />
    </div>
  )
}