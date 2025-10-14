import Scene from "../../util/Scene";
import GameMenu from "../interfaces/GameMenu";
import { lineProp } from "@/app/lib/data/lines/mapNpcLines";
import { Suspense, useState } from "react";
import BattleField from "./W2G1/BattleField";
import { degToRad } from "three/src/math/MathUtils.js";

export default function W2G1({
  worldKey, gameKey, npcData, onGameEnd
}: {
  worldKey: string;
  gameKey: string;
  npcData: Record<string, lineProp>;
  onGameEnd: (success: boolean) => void;
}) {
  const [score, setScore] = useState(0);

  return (
    <main className="w-full h-full">
      {/* 게임 */}
      <Scene
        position={[0,0,5]}
        rotation={[0,degToRad(20),degToRad(20)]}
      >
        <Suspense>
          <BattleField
            score={score}
            setScore={setScore}
            onGameEnd={onGameEnd}
          />
        </Suspense>
      </Scene>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center h-auto w-auto pointer-events-none">
        <div className="absolute w-96 h-96 border-16 border-black rounded-full inset-shadow-sm inset-shadow-black">
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-60 h-[1px] bg-red-600"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[1px] h-60 bg-red-600"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[4px] h-20 bg-black"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[4px] h-20 bg-black"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-20 h-[4px] bg-black"></div>
          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-20 h-[4px] bg-black"></div>
        </div>
      </div>

      {/* 게임 인터페이스 */}
      <GameMenu
        worldKey={worldKey}
        gameKey={gameKey}
        npcData={npcData}
        score={score}
      />
    </main>
  )
}