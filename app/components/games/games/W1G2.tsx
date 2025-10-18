import Scene from "../../util/Scene";
import GameMenu from "../interfaces/GameMenu";
import { useEffect, useState } from "react";
import SlotGame from "./W1G2/SlotGame";

export default function W1G2({
  worldKey, gameKey, onGameEnd
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
}) {
  const [trial, setTrial] = useState(0);
  const [successCount, setSuccessCount] = useState(0);

  function onRoundEnd(success: boolean) {
    // 3개의 각도 조합이 맞음 => 성공횟수 + 1
    if (success) {
      setSuccessCount(prev => prev + 1);
    }

    // 마지막이면 성공횟수 검사 후 게임종료, 아니면 다음단계
    if (trial === 3) {
      if (successCount > 0) {
        onGameEnd(true);
      } else {
        onGameEnd(false);
      }
    } else {
      setTrial(prev => prev + 1);
    }
  }
  
  return (
    <main className="w-full h-full">
      {/* 게임 */}
      <Scene>
        <SlotGame
          onRoundEnd={onRoundEnd}
        />
        
        {/* 빛 */}
        <directionalLight intensity={3} position={[0,30,40]} />
      </Scene>

      {/* 게임 인터페이스 */}
      <GameMenu
        worldKey={worldKey}
        gameKey={gameKey}
        score={successCount * 10}
      />
    </main>
  )
}