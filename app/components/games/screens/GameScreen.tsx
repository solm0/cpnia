// 게임 컴포넌트의 선택, 각 게임의 npc 데이터를 골라주는 컴포넌트

import W1G1 from "../games/W1G1";
import W1G2 from "../games/W1G2";
import W1G3 from "../games/W1G3";
import W2G1 from "../games/W2G1";
import W2G2 from "../games/W2G2";
import W2G3 from "../games/W2G3";
import W3G1 from "../games/W3G1";
import W3G2 from "../games/W3G2";
import W3G3 from "../games/W3G3";
import PausedScreen from "../../util/PausedScreen";
import { Object3D } from "three";

export default function GameScreen({
  worldKey, gameKey, handleGameEnd, avatar
}: {
  worldKey: string;
  gameKey: string;
  handleGameEnd: (result: boolean) => void;
  avatar: Object3D;
}) {
  type GameComponent = React.FC<{
    worldKey: string;
    gameKey: string;
    onGameEnd: (success: boolean) => void;
    avatar: Object3D;
  }>
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

  const SelectedGame = gameMap[worldKey]?.[gameKey];
  if (!SelectedGame) return <div>게임을 찾을 수 없습니다</div>
  
  return (
    <>
      <SelectedGame
        worldKey={worldKey}
        gameKey={gameKey}
        onGameEnd={handleGameEnd}
        avatar={avatar}
      />
      <PausedScreen
        worldKey={worldKey}
        isInMap={false}
      />
    </>
  )
}