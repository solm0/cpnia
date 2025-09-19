import { useState } from "react";
import Scene from "../util/Scene";
import W1G1 from "./W1G1";
import W1G2 from "./W1G2";
import W1G3 from "./W1G3";
import W2G1 from "./W2G1";
import W2G2 from "./W2G2";
import W2G3 from "./W2G3";
import W3G1 from "./W3G1";
import W3G2 from "./W3G2";
import W3G3 from "./W3G3";
import { useGameStore } from "@/app/lib/state/gameState";
import GameEndScreen from "./GameEndScreen";

type GameComponent = React.FC<{ onGameEnd: (success: boolean) => void}>
const gameMap: Record<string, Record<string, GameComponent>> = {
  time: {
    game1: W1G1,
    game2: W1G2,
    game3: W1G3,
  },
  sacrifice: {
    game1: W2G1,
    game2: W2G2,
    game3: W2G3,
  },
  entropy: {
    game1: W3G1,
    game2: W3G2,
    game3: W3G3,
  },
};

export default function Game({
  worldKey, gameKey
}: {
  worldKey: string;
  gameKey: string;
}) {
  const [gameEnded, setGameEnded] = useState(false);
  const [success, setSuccess] = useState(false);
  const [endScreenData, setEndScreenData] = useState(false); // 시민권화면을 보여줄것인지

  const SelectedGame = gameMap[worldKey]?.[gameKey];
  const setGame = useGameStore((state) => state.setGame);
  const isWorldCompleted = useGameStore((state) => state.isWorldCompleted);
  
  if (!SelectedGame) return <div>게임을 찾을 수 없습니다</div>

  const handleGameEnd = (result: boolean) => {
    const completedBeforeRun = useGameStore.getState().worlds[worldKey].games[gameKey]; // <- read it here

    setGameEnded(true);
    setSuccess(result);

    if (result && !completedBeforeRun) { // 성공했으면 && 이번에 처음 깬 게임이면
      setGame(worldKey, gameKey, true); // gameState 업데이트
    }

    setEndScreenData(!completedBeforeRun && isWorldCompleted(worldKey))
  }

  return (
    <Scene>
      {!gameEnded ? (
        // Game end 시 화면전환 효과 GSAP으로 넣기
        <SelectedGame onGameEnd={handleGameEnd} />
      ) : (
        <GameEndScreen
          success={success}
          worldKey={worldKey}
          gameKey={gameKey}
          showCitizenship={endScreenData}
        />
      )}
    </Scene>
  )
}