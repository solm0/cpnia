import { gamePortals } from "@/app/lib/data/gamePortals";
import GamePortalLayout from "../interfaces/GamePortalLayout";
import Button from "../../util/Button";
import { useRouter } from "next/navigation";
import PlayerWithAvatar from "../PlayerWithAvatar";
import Model from "../../util/Model";
import SacrificeLights from "../SacrificeLights";
import Scene from "@/app/components/util/Scene"
import PlaceHolder from "../../util/PlaceHolder";
import { useState } from "react";
import NpcLineModal from "../NpcLineModal";
import { mapNpcs } from "@/app/lib/data/mapNpcs";
import MapNpc from "../MapNpc";

export default function SacrificeScreen() {
  const router = useRouter();

  const [hoveredNpc, setHoveredNpc] = useState<string | null>(null);
  const [activeNpc, setActiveNpc] = useState<string | null>(null);

  return (
    <main className="w-full h-full">
      {/* 월드 씬 */}
      <Scene>
        {/* 빛 */}
        <SacrificeLights />

        {/* 지형 */}
        <Model
          src="/models/sacrifice-map.glb"
          scale={5}
          position={[-100,-129,200]}
          rotation={[0,0,0]}
        />

        {/* 게임 포탈 */}
        {gamePortals['sacrifice'].map(game => 
          <GamePortalLayout
            key={game.gameKey}
            label={game.label}
            worldKey={'sacrifice'}
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
        {mapNpcs['sacrifice'].map(npc =>
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

        {/* 모달 */}
        {activeNpc &&
          <NpcLineModal
            worldKey="sacrifice"
            name={activeNpc}
            setActiveNpc={setActiveNpc}
          />
        }
      </div>
    </main>
  )
}