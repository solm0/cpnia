import { RigidBody } from "@react-three/rapier";
import { gamePortals } from "@/app/lib/data/positions/gamePortals";
import PlaceHolder from "../../util/PlaceHolder";
import GamePortalLabel from "../interfaces/GamePortalLabel";
import { useState } from "react";
import { Html } from "@react-three/drei";
import Button from "../../util/Button";
import { useRouter } from "next/navigation";
import GamePortal from "./GamePortal";
import { use3dFocusStore } from "@/app/lib/gamepad/inputManager";

const lines = [
  '무질서를 받아들이겠습니까?',
  '엔트로피 억제 장치 "코어"가 발견되었습니다. 정해진 시간 내 안정을 되찾는 시도를 막으십시오.',
  '[경고] 세계의 분열이 극한에 도달했습니다. 하늘에서 큐브 조각이 떨어집니다.'
]

export default function EntropyGamePortal({
  worldKey,
}: {
  worldKey: string;
}) {
  const visibleGamePortals = gamePortals[worldKey].filter(portal => portal.position != null && portal.rotation != null);
  const [open, setOpen] = useState<string | null>(null);
  const router = useRouter();

  return (
    <>
      {/* 게임 포탈 */}
      {visibleGamePortals.map((game) => 
        <RigidBody
          key={game.gameKey}
          position={game.position}
          rotation={game.rotation}
          type="fixed"
        >
          <GamePortalLabel
            label={game.label}
            worldKey={worldKey}
            gameKey={game.gameKey}
            // locked={isLocked(game.gameKey, stage)}
            locked={false}
            y={game.labelYPos}
          />

          {game.model ? (
            <GamePortal
              modelSrc={game.model}
              worldKey={worldKey}
              gameKey={game.gameKey}
              scale={game.scale}
              setOpen={setOpen}
            />
          ): (
            <PlaceHolder />
          )}
        </RigidBody>
      )}

      {open &&
        <Html
          position={gamePortals['entropy'].find(portal => portal.gameKey === open)?.position}
          className="absolute top-20 left-1/2 -translate-x-1/2 flex flex-col items-center justify-between gap-2 w-96 h-50 p-10 bg-gray-400 border-2 border-blue-600 text-gray-900"
        >
          <div className="font-bold break-keep">
            {lines[Number(open.slice(-1))-1]}
          </div>
          <Button
            onClick={() => router.push(`/${worldKey}?game=${open}`)}
            label={`퀘스트 ${open.slice(-1)}으로 이동`}
            id='game-open'
            worldKey={worldKey}
            important={true}
          />
          <Button
            onClick={() => {
              setOpen(null);
            }}
            label="닫기"
            id='game-no-open'
            worldKey={worldKey}
          />
        </Html>
      }
    </>
  )
}