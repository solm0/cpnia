import PlaceHolderGame from "./PlaceHolderGame";
import Scene from "../../util/Scene";
import GameMenu from "../interfaces/GameMenu";
import { lineProp } from "@/app/lib/data/npc-default-lines";
import { useState } from "react";

export default function W3G3({
  worldKey, gameKey, npcData, onGameEnd
}: {
  worldKey: string;
  gameKey: string;
  npcData: Record<string, lineProp>;
  onGameEnd: (success: boolean) => void;
}) {
  // 게임마다 다른 게임 상태 저장. 점수만 Game으로 올려줌.
  const [click, setClick] = useState(0);
  
  return (
    <main className="w-full h-full">
      {/* 게임 */}
      <Scene>
        <PlaceHolderGame
          click={click}
          setClick={setClick}
          onGameEnd={onGameEnd}
        />
      </Scene>

      {/* 게임 인터페이스 */}
      <GameMenu
        worldKey={worldKey}
        gameKey={gameKey}
        npcData={npcData}
        score={click}
      />
    </main>
  )
}