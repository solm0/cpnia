import { useState } from "react";
import { useGameStore } from "@/app/lib/state/gameState";
import GameEndScreen from "./screens/GameEndScreen";
import GameScreen from "./screens/GameScreen";

export default function Game({
  worldKey, gameKey
}: {
  worldKey: string;
  gameKey: string;
}) {
  const [gameEnded, setGameEnded] = useState(false);

  const [success, setSuccess] = useState(false);
  const [endScreenData, setEndScreenData] = useState(false); // 시민권화면을 보여줄것인지

  const setGame = useGameStore((state) => state.setGame);
  const isWorldCompleted = useGameStore((state) => state.isWorldCompleted);
  
  const handleGameEnd = (result: boolean) => {
    const completedBeforeRun = useGameStore.getState().worlds[worldKey].games[gameKey]; // <- read it here

    setGameEnded(true);
    setSuccess(result);

    if (result && !completedBeforeRun) { // 성공했으면 && 이번에 처음 깬 게임이면
      setGame(worldKey, gameKey, true); // gameState 업데이트
    }

    setEndScreenData(!completedBeforeRun && isWorldCompleted(worldKey))
  }

  // 게임 현재 점수, 일시정지 함수(화면 띄우고 타이머 등 멈추기) 저장하고 GameMenu에 넘겨줘야됨.

  if (!gameEnded) {
    return (
      <GameScreen
        worldKey={worldKey}
        gameKey={gameKey}
        handleGameEnd={handleGameEnd}
      />
    )
  } else {
    return (
      <GameEndScreen
        success={success}
        worldKey={worldKey}
        gameKey={gameKey}
        showCitizenship={endScreenData}
      />
    )
  }
}