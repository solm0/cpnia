
import PlaceHolder from "../../util/PlaceHolder";
import Scene from "../../util/Scene";
import { EntropyLights } from "../Lights";
import { useState } from "react";
import { EntropyNpcLineModal } from "../interfaces/NpcLineModals";
import { chatNpcs } from "@/app/lib/data/positions/chatNpcs";
import ChatNpcScreen from "../interfaces/chatnpc/ChatNpcScreen";
import Portals from "../Portals";
import { Physics } from "@react-three/rapier";
import Npcs from "../Npcs";
import { EntropyEffects } from "../Effects";
import GlobalMenu from "../interfaces/GlobalMenu";
import Model from "../../util/Model";
import PlayerEntropy from "../player/PlayerEntropy";

export default function EntropyScreen() {
  const worldKey = 'entropy'

  const [activeNpc, setActiveNpc] = useState<string | null>(null);

  const chatNpc = chatNpcs[worldKey];
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <main className="w-full h-full">
      {/* 월드 씬 */}
      <Scene>
        <Physics gravity={[0,-9,0]}>

          {/* 빛 */}
          <EntropyLights />

          {/* 지형 */}
          <PlaceHolder label="엔트로피 체제의 맵" />
          <Model
            src="/models/entropy.glb"
            scale={8}
          />

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
          />

          {/* 플레이어 */}
          <PlayerEntropy worldKey={worldKey} />
        </Physics>

        {/* 효과 */}
        <EntropyEffects />
        <directionalLight intensity={10} position={[10,80,10]} />
        <directionalLight intensity={10} position={[-10,80,-10]} />
      </Scene>
      
      {/* --- 월드 인터페이스 --- */}
      
      <GlobalMenu worldKey={worldKey} />
      
      {/* 맵 npc 인터페이스 */}
      <div className="absolute top-2/3 w-screen h-auto flex justify-center">
        {activeNpc &&
          <EntropyNpcLineModal
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