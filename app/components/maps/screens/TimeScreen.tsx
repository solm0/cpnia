import Player from "../player/Player";
import Scene from "../../util/Scene";
import Npcs from "../Npcs";
import { chatNpcs } from "@/app/lib/data/chatNpcs";
import { useState, useRef } from "react";
import SacrificeLights from "../sacrifice/SacrificeLights";
import NpcLineModal from "../NpcLineModal";
import ChatNpcScreen from "./ChatNpcScreen";
import TimeMap from "../time/TimeMap";
import { Physics } from "@react-three/rapier";
import Portals from "../Portals";

export default function TimeScreen() {
  const worldKey = 'time';
  const [activeNpc, setActiveNpc] = useState<string | null>(null);

  const chatNpc = chatNpcs[worldKey];
  const [isChatOpen, setIsChatOpen] = useState(false);

  const stairClimbMode = useRef(false);

  // stage랑 groundY값을 저장해놓는다, 처음에는 무조건 card에서 시작한다.
  // card -> 계단1, 올라가기
  // pachinko -> 계단1 내려가기, 계단2 올라가기
  // roulette -> 계단 2 내려가기
  // -> TimeMap, Player

  // 계단 클릭할때 선택된 계단, stage정보 확인 후 맞는 start,end 값을 넣어야됨.
  // 내려보내고 후에 stage정보 바꿔야됨. 선택한 계단정보

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
          <SacrificeLights/>

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
          <Player
            worldKey={worldKey}
            groundY={groundY}
            stairClimbMode={stairClimbMode}
            currentStage={currentStage}
            setCurrentStage={setCurrentStage}
            clickedStair={clickedStair}
          />
        </Physics>
      </Scene>
      
      {/* --- 월드 인터페이스 --- */}
      {/* 조작법설명 */}
      <div className="absolute top-0 left-0 w-full h-auto flex items-center flex-col">
        <p>wasd:아바타이동</p>
        <p>ijkl:카메라회전</p>
        <p>space:점프</p>
      </div>

      {/* 맵 npc 인터페이스 */}
      <div className="absolute top-2/3 w-screen h-auto flex justify-center">
        {activeNpc &&
          <NpcLineModal
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