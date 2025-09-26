import { gamePortals } from "@/app/lib/data/gamePortals";
import GamePortalLayout from "../interfaces/GamePortalLayout";
import ChatNpc from "../ChatNpc";
import { useRouter } from "next/navigation";
import Model from "../../util/Model";
import Scene from "@/app/components/util/Scene"
import PlaceHolder from "../../util/PlaceHolder";
import { useState } from "react";
import NpcLineModal from "../NpcLineModal";
import { mapNpcs } from "@/app/lib/data/mapNpcs";
import MapNpc from "../MapNpc";
import { chatNpcs } from "@/app/lib/data/chatNpcs";
import ChatNpcScreen from "./ChatNpcScreen";
import Player from "../Avatar";

export default function SacrificeScreen() {
  const worldKey = 'sacrifice';
  const router = useRouter();

  const [hoveredNpc, setHoveredNpc] = useState<string | null>(null);
  const [activeNpc, setActiveNpc] = useState<string | null>(null);

  const chatNpc = chatNpcs[worldKey];
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <main className="w-full h-full">
      <Scene>
        {/* 지형 */}
        <Model
          src="/models/sacrifice-map.glb"
          scale={5}
          position={[-100,-129,200]}
          rotation={[0,0,0]}
        />

        {/* 게임 포탈 */}
        {gamePortals[worldKey].map(game => 
          <GamePortalLayout
            key={game.gameKey}
            label={game.label}
            worldKey={worldKey}
            gameKey={game.gameKey}
            position={game.position}
            rotation={game.rotation}
          >
            <PlaceHolder />
          </GamePortalLayout>
        )}

        {/* 홈 포탈 */}
        <group
          scale={1}
          position={[15,0,-5]}
          onClick={() => router.push('/')}
        >
          <PlaceHolder label="첫화면으로" />
        </group>

        {/* 기타 모델들 */}

        {/* 소품 */}

        {/* 맵 npc */}
        {mapNpcs[worldKey].map(npc =>
          <MapNpc
            key={npc.name}
            name={npc.name}
            scale={1}
            position={npc.position}
            rotation={npc.rotation}
            hoveredNpc={hoveredNpc}
            setHoveredNpc={setHoveredNpc}
            setActiveNpc={setActiveNpc}
          />
        )}

        {/* 챗 npc */}
        <ChatNpc
          name={chatNpc.name}
          scale={1}
          position={chatNpc.position}
          rotation={chatNpc.rotation}
          hoveredNpc={hoveredNpc}
          setHoveredNpc={setHoveredNpc}
          setIsChatOpen={setIsChatOpen}
        />

        {/* 플레이어 아바타 */}
        <Player position={[0,0,0]} />

        {/* 배경음악 */}
      </Scene>

      {/* 월드 인터페이스 */}
      <div className="absolute top-2/3 w-screen h-auto flex justify-center">
        {/* 모달 */}
        {activeNpc &&
          <NpcLineModal
            worldKey="sacrifice"
            name={activeNpc}
            setActiveNpc={setActiveNpc}
          />
        }
      </div>

      {/* 챗 npc 채팅 모달 */}
      {isChatOpen &&
        <ChatNpcScreen
          npcData={chatNpc}
          worldKey={worldKey}
          handleClose={setIsChatOpen}
        />
      }
    </main>
  )
}