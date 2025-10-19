import Scene from "../../util/Scene";
import GameMenu from "../interfaces/GameMenu";
import { RefObject, useRef, useState } from "react";
import SlotGame from "./W1G2/SlotGame";
import Button from "../../util/Button";

function Ui({
  success, motionPhase, onRoundEnd,
}: {
  success: boolean | null;
  motionPhase: RefObject<'idle' | 'toSide' | 'handle' | 'toFront' | 'cylinder' | 'done'>;
  onRoundEnd: (success: boolean) => void;
}) {
  if (motionPhase.current === 'idle') {
    return (
      <div className="w-screen h-screen pt-60 pointer-events-none absolute">
        <Button
          worldKey="time"
          label="시작"
          autoFocus={true}
          onClick={() => {
            motionPhase.current = 'toSide'
            console.log('ff')
          }}
        />
      </div>
    )
  } else if (motionPhase.current === 'done') {
    console.log(success);
    if (success === true) {
      console.log('성공')
      return <div>성공</div>
    } else {
      console.log('실패')
      return <div>실패</div>
    }
  }
}

export default function W1G2({
  worldKey, gameKey, onGameEnd
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
}) {
  const [trial, setTrial] = useState(0);
  const [successCount, setSuccessCount] = useState(0);

  const motionPhase = useRef<'idle' | 'toSide' | 'handle' | 'toFront' | 'cylinder' | 'done'>('idle');
  const [success, setSuccess] = useState<boolean | null>(null);

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
      
      {/* 게임 인터페이스 */}
      <GameMenu
        worldKey={worldKey}
        gameKey={gameKey}
        score={successCount * 10}
      />
      <Ui
        success={success}
        motionPhase={motionPhase}
        onRoundEnd={onRoundEnd}
      />

      {/* 게임 */}
      <Scene>
        <SlotGame
          onRoundEnd={onRoundEnd}
          motionPhase={motionPhase}
          setSuccess={setSuccess}
        />
        
        {/* 빛 */}
        <directionalLight intensity={3} position={[0,30,40]} />
      </Scene>
    </main>
  )
}