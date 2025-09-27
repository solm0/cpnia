import Player from "../Avatar";
import PlaceHolder from "../../util/PlaceHolder";
import Scene from "../../util/Scene";
import { gamePortals } from "@/app/lib/data/gamePortals";
import GamePortalLayout from "../interfaces/GamePortalLayout";
import ChatNpc from "../ChatNpc";
import { chatNpcs } from "@/app/lib/data/chatNpcs";
import { mapNpcs } from "@/app/lib/data/mapNpcs";
import MapNpc from "../MapNpc";
import { useState } from "react";
import SacrificeLights from "../SacrificeLights";
import NpcLineModal from "../NpcLineModal";
import ChatNpcScreen from "./ChatNpcScreen";
import HomePortalLayout from "../interfaces/HomePortalLayout";

export default function TimeMap() {
  const worldKey = 'time';

  const [hoveredNpc, setHoveredNpc] = useState<string | null>(null);
  const [activeNpc, setActiveNpc] = useState<string | null>(null);

  const chatNpc = chatNpcs[worldKey];
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <main className="w-full h-full">
      {/* 월드 씬 */}
      <Scene>
        {/* 빛 */}
        <SacrificeLights/>

        {/* 지형 */}
        <PlaceHolder label="시간기반체제의 맵" />

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
        <HomePortalLayout
          label="첫화면으로"
        >
          <PlaceHolder />
        </HomePortalLayout>

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
        <Player
          position={[0,0,0]}
        />
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