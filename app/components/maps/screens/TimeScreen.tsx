import Player from "../Player";
import PlaceHolder from "../../util/PlaceHolder";
import Scene from "../../util/Scene";
import { gamePortals } from "@/app/lib/data/gamePortals";
import GamePortalLayout from "../interfaces/GamePortalLayout";
import ChatNpc from "../ChatNpc";
import { chatNpcs } from "@/app/lib/data/chatNpcs";
import { mapNpcs } from "@/app/lib/data/mapNpcs";
import MapNpc from "../MapNpc";
import { useState } from "react";
import SacrificeLights from "../sacrifice/SacrificeLights";
import NpcLineModal from "../NpcLineModal";
import ChatNpcScreen from "./ChatNpcScreen";
import HomePortalLayout from "../interfaces/HomePortalLayout";
import TimeMap from "../time/TimeMap";
import { Physics, RigidBody } from "@react-three/rapier";

export default function TimeScreen() {
  const worldKey = 'time';

  const [hoveredNpc, setHoveredNpc] = useState<string | null>(null);
  const [activeNpc, setActiveNpc] = useState<string | null>(null);

  const chatNpc = chatNpcs[worldKey];
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <main className="w-full h-full">
      {/* 월드 씬 */}
      <Scene>
        <Physics debug gravity={[0,-9,0]}>

          {/* 빛 */}
          <SacrificeLights/>

          {/* 지형 */}
          <TimeMap />

          {/* 게임 포탈 */}
          {gamePortals[worldKey].map(game => 
            <RigidBody
              key={game.gameKey}
              position={game.position}
              rotation={game.rotation}
              type="fixed"
            >
              <GamePortalLayout
                label={game.label}
                worldKey={worldKey}
                gameKey={game.gameKey}
              >
                <PlaceHolder />
              </GamePortalLayout>
            </RigidBody>
          )}

          {/* 홈 포탈 */}
          <RigidBody
            position={[15,0,-5]}
            rotation={[0,0,0]}
            type="fixed"
          >
            <HomePortalLayout label="첫화면으로">
              <PlaceHolder />
            </HomePortalLayout>
          </RigidBody>

          {/* 기타 모델들 */}

          {/* 소품 */}

          {/* 맵 npc */}
          {mapNpcs[worldKey].map(npc =>
            <RigidBody
              key={npc.name}
              position={npc.position}
              rotation={npc.rotation}
              colliders={'cuboid'}
              type="fixed"
            >
              <MapNpc
                name={npc.name}
                hoveredNpc={hoveredNpc}
                setHoveredNpc={setHoveredNpc}
                setActiveNpc={setActiveNpc}
              />
            </RigidBody>
          )}

          {/* 챗 npc */}
          <RigidBody
            position={chatNpc.position}
            rotation={chatNpc.rotation}
            colliders={'cuboid'}
            type="fixed"
          >
            <ChatNpc
              name={chatNpc.name}
              hoveredNpc={hoveredNpc}
              setHoveredNpc={setHoveredNpc}
              setIsChatOpen={setIsChatOpen}
            />
          </RigidBody>

          {/* 플레이어 아바타 */}
          <Player />
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