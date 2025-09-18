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

// 목표 점수를 달성했는지 체크하는 함수
// function isSuccess() {
//   게임마다 내용이 다름.
//   return success;
// }

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
  const SelectedGame = gameMap[worldKey]?.[gameKey];
  const setGame = useGameStore((state) => state.setGame);
  const isWorldCompleted = useGameStore((state) => state.isWorldCompleted);

  if (!SelectedGame) return <div>게임을 찾을 수 없습니다</div>

  // 게임종료 함수. 어디서 부르느냐는 게임마다 다름. props로 넘겨줌.
  const handleGameEnd = (success: boolean) => {
    if (success) {
      const completed = useGameStore.getState().worlds[worldKey].games[gameKey];

      if (!completed) { // 이번에 처음 깬 게임이면
        setGame(worldKey, gameKey, true);  // gameState 업데이트
        
        // let button = 월드 홈으로 돌아가는 버튼
        if (isWorldCompleted(worldKey)) { {/* button = citizenship */} }

        // button이 포함된 성공화면 렌더
      }
    } else {
      // 월드 홈으로 돌아가는 button이 포함된 실패화면 렌더
    }
  }

  return (
    <Scene>
      <SelectedGame onGameEnd={handleGameEnd} />
    </Scene>
  )
}