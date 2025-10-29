import Scene from "../../util/Scene";
import Npcs from "../Npcs";
import { chatNpcs } from "@/app/lib/data/positions/chatNpcs";
import { useState, useRef, useMemo } from "react";
import { TimeLights } from "../Lights";
import { TimeNpcLineModal } from "../interfaces/NpcLineModals";
import ChatNpcScreen from "../interfaces/chatnpc/ChatNpcScreen";
import TimeMap from "../time/TimeMap";
import { Physics } from "@react-three/rapier";
import Portals from "../Portals";
import PlayerWithStair from "../player/PlayerWithStair";
import { TimeEffects } from "../Effects";
import GlobalMenu from "../interfaces/GlobalMenu";
import { Object3D } from "three";
import { useGLTF } from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

export default function TimeScreen({
  avatar,
}: {
  avatar: Object3D;
}) {
  const worldKey = 'time';
  const npcModelScene = useGLTF('/models/avatars/time-npc.glb').scene;
  const gandalf = useGLTF('/models/avatars/gandalf.gltf').scene;

  const npcModel = useMemo(() => {
    return [
      ...Array.from({ length: 3 }, () => clone(npcModelScene)),
      gandalf
    ];
  }, [npcModelScene]);

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
        <Physics gravity={[0,-9,0]}>

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
            activeNpc={activeNpc}
            setActiveNpc={setActiveNpc}
            setIsChatOpen={setIsChatOpen}
            chatNpc={chatNpc}
            models={npcModel}
          />

          {/* 플레이어 */}
          <PlayerWithStair
            worldKey={worldKey}
            groundY={groundY}
            stairClimbMode={stairClimbMode}
            currentStage={currentStage}
            setCurrentStage={setCurrentStage}
            clickedStair={clickedStair}
            avatar={avatar}
          />
        </Physics>

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