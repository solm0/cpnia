import Scene from "../../util/Scene";
import GameMenu from "../interfaces/GameMenu";
import { RefObject, useEffect, useRef, useState } from "react";
import SlotGame from "./W1G2/SlotGame";
import Button from "../../util/Button";

function Ui({
  successRef, motionPhase, onGameEnd, worldKey, gameKey, cylinderRotProg, groupRotProg, handleRotProg
}: {
  successRef: RefObject<boolean | null>;
  motionPhase: RefObject<'idle' | 'toSide' | 'handle' | 'toFront' | 'cylinder' | 'done'>;
  onGameEnd: (success: boolean) => void;
  worldKey: string;
  gameKey: string;
  cylinderRotProg: RefObject<number>;
  groupRotProg: RefObject<number>;
  handleRotProg: RefObject<number>;
}) {
  

  const [, setVersion] = useState(0); // local state to trigger rerender

  useEffect(() => {
    const interval = setInterval(() => {
      if (successRef.current !== null) {
        setVersion(v => v + 1); // force rerender when ref is set
      }
    }, 16); // 60fps
    return () => clearInterval(interval);
  }, []);

  const [trial, setTrial] = useState(0);
  const [successCount, setSuccessCount] = useState(0);

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
    <>
      <GameMenu
        worldKey={worldKey}
        gameKey={gameKey}
        score={successCount}
      />
      <div className="w-screen h-screen pt-60 pointer-events-none absolute">
        {motionPhase.current === 'idle'
          ? (
            <Button
              worldKey="time"
              label="시작"
              autoFocus={true}
              onClick={() => {
                motionPhase.current = 'toSide'

                groupRotProg.current = 0;
                handleRotProg.current = 0;
                cylinderRotProg.current = 0;

                successRef.current = null;
              }}
            />
          )
          : motionPhase.current === 'done' && successRef.current === true
            ? (
              <div>
                <div>성공</div>
                <Button
                  onClick={() => {
                    motionPhase.current = 'idle';
                    onRoundEnd(true);
                  }}
                  label="한 번 더 시도"
                  worldKey="time"
                  autoFocus={true}
                />
              </div>
            )
            : motionPhase.current === 'done' && successRef.current === false
            ? (
              <div>
                <div>실패</div>
                <Button
                  onClick={() => {
                    motionPhase.current = 'idle';
                    onRoundEnd(false);
                  }}
                  label="다시 시도"
                  worldKey="time"
                  autoFocus={true}
                />
              </div>
            )
            : null
        }
      </div>
    </>
  )
}

export default function W1G2({
  worldKey, gameKey, onGameEnd
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
}) {
  const motionPhase = useRef<'idle' | 'toSide' | 'handle' | 'toFront' | 'cylinder' | 'done'>('idle');
  const successRef = useRef<boolean>(null);

  const cylinderRotProg = useRef(0);
  const groupRotProg = useRef(0);
  const handleRotProg = useRef(0);

  return (
    <main className="w-full h-full">
      
      {/* 게임 인터페이스 */}
      <Ui
        successRef={successRef}
        motionPhase={motionPhase}
        onGameEnd={onGameEnd}
        worldKey={worldKey}
        gameKey={gameKey}
        groupRotProg={groupRotProg}
        cylinderRotProg={cylinderRotProg}
        handleRotProg={handleRotProg}
      />

      {/* 게임 */}
      <Scene>
        <SlotGame
          motionPhase={motionPhase}
          successRef={successRef}
          groupRotProg={groupRotProg}
          cylinderRotProg={cylinderRotProg}
          handleRotProg={handleRotProg}
        />
        
        {/* 빛 */}
        <directionalLight intensity={3} position={[0,30,40]} />
      </Scene>
    </main>
  )
}