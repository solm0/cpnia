import PlaceHolderGame from "./PlaceHolderGame";
import Scene from "../../util/Scene";
import GameMenu from "../interfaces/GameMenu";
import { useState } from "react";
import { OrbitControls } from "@react-three/drei";
import SlotGame from "./W1G2/SlotGame";

export default function W1G2({
  worldKey, gameKey, onGameEnd
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
}) {
  // 게임마다 다른 게임 상태 저장. 점수만 Game으로 올려줌.
  const [score, setScore] = useState(0);
  
  return (
    <main className="w-full h-full">
      {/* 게임 */}
      <Scene>
        <SlotGame />
      </Scene>

      {/* 게임 인터페이스 */}
      <GameMenu
        worldKey={worldKey}
        gameKey={gameKey}
        score={score}
      />
    </main>
  )
}