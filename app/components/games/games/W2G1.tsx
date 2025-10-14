import Scene from "../../util/Scene";
import GameMenu from "../interfaces/GameMenu";
import { lineProp } from "@/app/lib/data/lines/mapNpcLines";
import { Suspense, useState } from "react";
import BattleField from "./W2G1/BattleField";

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
      <Scene>
        <Suspense>
          <BattleField
            score={score}
            setScore={setScore}
            onGameEnd={onGameEnd}
          />
        </Suspense>
      </Scene>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center h-auto w-auto pointer-events-none">
        <div className="absolute w-80 h-80 border-2 rounded-full">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-15 bg-black"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-15 bg-black"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-15 h-[2px] bg-black"></div>
          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-15 h-[2px] bg-black"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-50 h-[1px] bg-red-500"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[1px] h-50 bg-red-500"></div>
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