import Scene from "../../util/Scene";
import GameMenu from "../interfaces/GameMenu";
import { useEffect, useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import RouletteRoll from "./W1G3/RouletteRoll";
import RouletteTable from "./W1G3/RouletteTable";
import { Object3D } from "three";
import AudioPlayer from "../../util/AudioPlayer";

export default function W1G3({
  worldKey, gameKey, onGameEnd, avatar
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
  avatar: Object3D;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trial, setTrial] = useState(1)
  const leftMoney = useRef(100);
  const [betNum, setBetNum] = useState<number | null>(null);

  const rouletteMaxNum = 20;

  function onRoundEnd(success: boolean) {
    // 맞는점수나옴 => 게임종료(성공)
    if (success) {
      onGameEnd(true);
    } else {
      // 안나옴 => 다음라운드
      setTrial(prev => prev + 1)
      leftMoney.current -= 10;
    }
  }

  // 돈 다 잃으면 게임종료(실패)
  useEffect(() => {
    if (leftMoney.current <= 0) {
      onGameEnd(true);  // 걍.이기게 해주자...
    }
  }, [leftMoney.current]);
  
  return (
    <main className="w-full h-full">
      {/* 게임 */}
      <Scene>
        {!betNum ? (
          // 베팅 테이블
          <RouletteTable
            n={rouletteMaxNum}
            setBetNum={setBetNum}
          />
        ): (
          // 룰렛
          <>
            <RouletteRoll
              n={rouletteMaxNum}
              betNum={betNum}
              onRoundEnd={onRoundEnd}
              onGameEnd={onGameEnd}
              moneyRef={leftMoney}
            />
            <OrbitControls minDistance={90} maxDistance={100} />
          </>
        )}
      </Scene>

      {/* 게임 인터페이스 */}
      <p>{leftMoney.current}</p>

      <AudioPlayer src={`/audio/time_bg.mp3`} audioRef={audioRef} />
    </main>
  )
}