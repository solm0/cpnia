import PlaceHolderGame from "./PlaceHolderGame";
import Scene from "../../util/Scene";
import GameMenu from "../interfaces/GameMenu";
import { useState } from "react";
import { OrbitControls } from "@react-three/drei";

export default function W1G3({
  worldKey, gameKey, onGameEnd
}: {
  worldKey: string;
  gameKey: string;
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
        <OrbitControls minDistance={30} maxDistance={100} />
      </Scene>

      {/* 게임 인터페이스 */}
      <GameMenu
        worldKey={worldKey}
        gameKey={gameKey}
        score={click}
      />
    </main>
  )
}