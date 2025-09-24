import Button from "../../util/Button";
import SmallScene from "../../util/SmallScene";
import Model from "../../util/Model";
import ChatNpcForm from "../interfaces/ChatNpcForm";
import { chatNpcBrains } from "@/app/lib/data/chatNpcBrain";
import { chatNpcProp } from "@/app/lib/data/chatNpcs";

export default function ChatNpcScreen({
  npcData, worldKey, handleClose
}: {
  npcData: chatNpcProp;
  worldKey: string;
  handleClose: (open: boolean) => void;
}) {
  const npcBrain = chatNpcBrains[worldKey];

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-gray-100 flex flex-col items-center p-20 justify-between pointer-events-auto">
      
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
      {/* zustand(localstorage)에 json으로 저장한 대화내역을 매핑해서 보여준다. */}

      {/* 인풋창 */}
      <ChatNpcForm
        npcData={npcData}
        npcBrain={npcBrain}
      />
      {/* 추천질문 5개, 사용하면 사라짐(state) */}
      {/* api에 Post 하고 response를 받아 zustand에 추가한다. */}
      
      <Button
        onClick={() => handleClose(false)}
        label="닫기"
      />
    </div>
  )
}