import PlayerWithAvatar from "../PlayerWithAvatar";
import PlaceHolder from "../../util/PlaceHolder";
import Scene from "../../util/Scene";
import { gamePortals } from "@/app/lib/data/gamePortals";
import GamePortalLayout from "../interfaces/GamePortalLayout";
import { useRouter } from "next/navigation";
import Button from "../../util/Button";
import SacrificeLights from "../SacrificeLights";
import { useState } from "react";
import MapNpc from "../MapNpc";
import { mapNpcs } from "@/app/lib/data/mapNpcs";
import NpcLineModal from "../NpcLineModal";
import { chatNpcs } from "@/app/lib/data/chatNpcs";
import ChatNpc from "../ChatNpc";
import ChatNpcScreen from "./ChatNpcScreen";

export default function EntropyScreen() {
  const worldKey = 'entropy'
  const router = useRouter();

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
        <PlaceHolder label="엔트로피 체제의 맵" />

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
        <PlayerWithAvatar />

        {/* 배경음악 */}
      </Scene>
      
      {/* 월드 인터페이스 */}
      <div className="absolute top-2/3 w-screen h-auto flex justify-center">
        <Button
          onClick={() => router.push('/')}
          label="첫화면으로"
        />

        {/* 맵 npc 대사 모달 */}
        {activeNpc &&
          <NpcLineModal
            worldKey={worldKey}
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