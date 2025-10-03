import Scene from "../../util/Scene";
import Npcs from "../Npcs";
import { chatNpcs } from "@/app/lib/data/chatNpcs";
import { useState, useRef } from "react";
import { TimeLights } from "../Lights";
import { TimeNpcLineModal } from "../interfaces/NpcLineModal";
import ChatNpcScreen from "../interfaces/ChatNpcScreen";
import TimeMap from "../time/TimeMap";
import { Physics } from "@react-three/rapier";
import Portals from "../Portals";
import PlayerWithStair from "../player/PlayerWithStair";
import { TimeEffects } from "../Effects";

export default function TimeScreen() {
  const worldKey = 'time';
  const [activeNpc, setActiveNpc] = useState<string | null>(null);

  const chatNpc = chatNpcs[worldKey];
  const [isChatOpen, setIsChatOpen] = useState(false);

  const stairClimbMode = useRef(false);
  const groundYs = [ 120, -97, 0 ]

  const [currentStage, setCurrentStage] = useState(1);
  const [clickedStair, setClickedStair] = useState<number | null>(null)
  const groundY = groundYs[currentStage];

  return (
    <main className="w-full h-full">
      {/* 월드 씬 */}
      <Scene>
        <Physics debug gravity={[0,-9,0]}>

          {/* 빛 */}
          <TimeLights />

          {/* 지형 */}
          <TimeMap stairClimbMode={stairClimbMode} setClickedStair={setClickedStair} />

          {/* 포탈들 */}
          <Portals worldKey={worldKey} />

          {/* 기타 모델들 */}

          {/* 소품 */}

          {/* npc들 */}
          <Npcs
            worldKey={worldKey}
            setActiveNpc={setActiveNpc}
            setIsChatOpen={setIsChatOpen}
            chatNpc={chatNpc}
          />

          {/* 플레이어 */}
          <PlayerWithStair
            worldKey={worldKey}
            groundY={groundY}
            stairClimbMode={stairClimbMode}
            currentStage={currentStage}
            setCurrentStage={setCurrentStage}
            clickedStair={clickedStair}
          />
        </Physics>

        {/* 효과 */}
        <TimeEffects />
      </Scene>
      
      {/* --- 월드 인터페이스 --- */}
      {/* 조작법설명 */}
      <div className="absolute top-0 left-0 w-full h-auto flex items-center flex-col">
        <p>wasd:아바타이동</p>
        <p>ijkl:카메라회전</p>
        <p>space:점프</p>
      </div>

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
      {isChatOpen &&
        <ChatNpcScreen
          npcData={chatNpc}
          worldKey={worldKey}
          handleClose={setIsChatOpen}
        />
      }

      {/* 배경음악 */}
    </main>
  )
}