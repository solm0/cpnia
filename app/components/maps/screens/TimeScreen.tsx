import Scene from "../../util/Scene";
import { chatNpcs } from "@/app/lib/data/positions/chatNpcs";
import { useState, useRef } from "react";
import { TimeLights } from "../Lights";
import { TimeNpcLineModal } from "../interfaces/NpcLineModals";
import ChatNpcScreen from "../interfaces/chatnpc/ChatNpcScreen";
import TimeMap from "../time/TimeMap";
import { Physics } from "@react-three/rapier";
import { TimeEffects } from "../Effects";
import GlobalMenu from "../interfaces/GlobalMenu";
import { Object3D } from "three";

export default function TimeScreen({
  avatar,
}: {
  avatar: Object3D;
}) {
  const worldKey = 'time';
  const chatNpc = chatNpcs[worldKey];

  const [activeNpc, setActiveNpc] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const stairClimbMode = useRef(false);

  return (
    <main className="w-full h-full">
      <Scene>
        <Physics gravity={[0,-9,0]}>
          <TimeMap
            stairClimbMode={stairClimbMode}
            avatar={avatar}
            chatNpc={chatNpc}
            activeNpc={activeNpc}
            setActiveNpc={setActiveNpc}
            setIsChatOpen={setIsChatOpen}
          />
        </Physics>

        {/* 빛 */}
        <TimeLights />

        {/* 효과 */}
        <TimeEffects />
      </Scene>
      
      {/* --- 월드 인터페이스 --- */}

      <GlobalMenu worldKey={worldKey} />

      {/* 맵 npc 인터페이스 */}
      <div className="absolute top-2/3 w-screen h-auto">
        {activeNpc &&
          <TimeNpcLineModal
            worldKey={worldKey}
            name={activeNpc}
            setActiveNpc={setActiveNpc}
          />
        }
      </div>

      {/* 챗 npc 인터페이스 */}
      <ChatNpcScreen
        npcData={chatNpc}
        worldKey={worldKey}
        setIsChatOpen={setIsChatOpen}
        isChatOpen={isChatOpen}
      />
    </main>
  )
}