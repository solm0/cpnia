import PlayerWithAvatar from "../PlayerWithAvatar";
import PlaceHolder from "../../util/PlaceHolder";
import Scene from "../../util/Scene";
import { gamePortals } from "@/app/lib/data/gamePortals";
import GamePortalLayout from "../interfaces/GamePortalLayout";
import { useRouter } from "next/navigation";
import Button from "../../util/Button";
import { mapNpcs } from "@/app/lib/data/mapNpcs";
import MapNpc from "../MapNpc";
import { useState } from "react";
import SacrificeLights from "../SacrificeLights";
import NpcLineModal from "../NpcLineModal";

export default function TimeMap() {
  const router = useRouter();

  const [hoveredNpc, setHoveredNpc] = useState<string | null>(null);
  const [activeNpc, setActiveNpc] = useState<string | null>(null);

  return (
    <main className="w-full h-full">
      {/* 월드 씬 */}
      <Scene>
        {/* 빛 */}
        <SacrificeLights/>

        {/* 지형 */}
        <PlaceHolder label="시간기반체제의 맵" />

        {/* 게임 포탈 */}
        {gamePortals['time'].map(game => 
          <GamePortalLayout
            key={game.gameKey}
            label={game.label}
            worldKey={'time'}
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
        {mapNpcs['time'].map(npc =>
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

        {/* 프리토킹 npc */}

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

        {/* 모달: 닫기버튼 */}
        {activeNpc &&
          <NpcLineModal
            worldKey="time"
            name={activeNpc}
            setActiveNpc={setActiveNpc}
          />
        }
      </div>
    </main>
  )
}