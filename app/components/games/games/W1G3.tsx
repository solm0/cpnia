import Scene from "../../util/Scene";
import GameMenu from "../interfaces/GameMenu";
import { useEffect, useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import RouletteRoll from "./W1G3/RouletteRoll";
import PlaceHolder from "../../util/PlaceHolder";

export default function W1G3({
  worldKey, gameKey, onGameEnd
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
}) {
  const trial = useRef(1);
  const leftMoney = useRef(100);
  const [betNum, setBetNum] = useState<number | null>(null);

  function onRoundEnd(success: boolean) {
    // 맞는점수나옴 => 게임종료(성공)
    if (success) {
      onGameEnd(true);
    } else {
      // 안나옴 => 다음라운드
      trial.current += 1;
      leftMoney.current -= 10;
    }
  }

  // 돈 다 잃으면 게임종료(실패)
  useEffect(() => {
    if (leftMoney.current <= 0) {
      onGameEnd(false);
    }
  }, [leftMoney.current]);
  
  return (
    <main className="w-full h-full">
      {/* 게임 */}
      <Scene>
        {!betNum ? (
          // 베팅 테이블
          <PlaceHolder />
          // ref로 이동. 키보드 사용 앞뒤좌우.
          // 클릭하면 베팅하시겠습가? ok하면
          // setBetNum()
        ): (
          // 룰렛
          <>
            <RouletteRoll />
            <OrbitControls minDistance={90} maxDistance={100} />
          </>
        )}
      </Scene>

      {/* 게임 인터페이스 */}
      <GameMenu
        worldKey={worldKey}
        gameKey={gameKey}
        score={leftMoney.current}
      />
    </main>
  )
}