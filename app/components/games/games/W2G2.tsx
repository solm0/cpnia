import Scene from "../../util/Scene";
import GameMenu from "../interfaces/GameMenu";
import { Loader, OrbitControls } from "@react-three/drei";
import { Suspense, useState } from "react";
import ShootingRange from "./W2G2/ShootingRange";
import { W2G2roundConfig } from "./roundConfig";
import Crowd from "./W2G2/Crowd";

export default function W2G2({
  worldKey, gameKey, onGameEnd
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
}) {
  const [round, setRound] = useState(1);

  function gameOver(success: boolean) {
    if (success) {
      if (round === 3) {
        onGameEnd(true);
      } else {
        setRound(prev => prev + 1);
      }
    } else {
      onGameEnd(false);
    }
  }

  const config = W2G2roundConfig[round]
  
  return (
    <main className="w-full h-full">
      {/* 게임 */}
      <Scene
        position={[0,0,5]} // 카메라도 나중에 새총 y에 대해
        rotation={[0,0,0]}
      >
        <Suspense>
          <ShootingRange
            targetRadius={config.targetRadius}
            gameOver={gameOver}
          />

          {/* 구경꾼 */}
          <Crowd />
        </Suspense>
        <OrbitControls minDistance={30} maxDistance={100} />
      </Scene>

      {/* 게임 인터페이스 */}
      <GameMenu
        worldKey={worldKey}
        gameKey={gameKey}
      />
    </main>
  )
}