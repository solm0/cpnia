import Model from "../../util/Model";
import Scene from "@/app/components/util/Scene"
import Portals from "../Portals";
import { useState } from "react";
import NpcLineModal from "../NpcLineModal";
import Npcs from "../Npcs";
import { chatNpcs } from "@/app/lib/data/chatNpcs";
import ChatNpcScreen from "./ChatNpcScreen";
import Player from "../player/Player";
import SacrificeLights from "../sacrifice/SacrificeLights";
import { Physics, RigidBody } from '@react-three/rapier'

export default function SacrificeScreen() {
  const worldKey = 'sacrifice';
  const [activeNpc, setActiveNpc] = useState<string | null>(null);

  const chatNpc = chatNpcs[worldKey];
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <main className="w-full h-full">
      <Scene>
        <Physics debug gravity={[0,-9,0]}>
          {/* 빛 */}
          <SacrificeLights/>

          {/* 지형 */}
          <Model
            src="/models/sacrifice.glb"
            scale={5}
            position={[-150,-129,420]}
            rotation={[0,0,0]}
          />

          <RigidBody type="fixed">
            <mesh position={[103, -1.2, 6]} >
              <boxGeometry args={[233, 2, 85]} /> {/* give it a thin height */}
              <meshStandardMaterial transparent opacity={0} />
            </mesh>
          </RigidBody>

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
          <Player worldKey={worldKey}/>
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