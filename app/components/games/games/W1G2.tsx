import Scene from "../../util/Scene";
import GameMenu from "../interfaces/GameMenu";
import { RefObject, useEffect, useRef, useState } from "react";
import SlotGame from "./W1G2/SlotGame";
import Button from "../../util/Button";
import { Object3D } from "three";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";
import AudioPlayer from "../../util/AudioPlayer";
import { TimeEffects } from "../../maps/Effects";
import { TimeLights } from "../../maps/Lights";

function Ui({
  successRef, motionPhase, onGameEnd, worldKey, gameKey,
  cylinderRotProg, groupRotProg, handleRotProg,
  resetRound
}: {
  successRef: RefObject<boolean | null>;
  motionPhase: RefObject<'idle' | 'toSide' | 'handle' | 'toFront' | 'cylinder' | 'done'>;
  onGameEnd: (success: boolean) => void;
  worldKey: string;
  gameKey: string;
  cylinderRotProg: RefObject<number>;
  groupRotProg: RefObject<number>;
  handleRotProg: RefObject<number>;
  resetRound: () => void;
}) {
  // const [, setVersion] = useState(0); // local state to trigger rerender

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (successRef.current !== null) {
  //       setVersion(v => v + 1); // force rerender when ref is set
  //     }
  //   }, 16); // 60fps
  //   return () => clearInterval(interval);
  // }, []);

  const [trial, setTrial] = useState(1);
  const [successCount, setSuccessCount] = useState(0);

  function onRoundEnd(success: boolean) {
    // 3개의 각도 조합이 맞음 => 성공횟수 + 1
    if (success) {
      setSuccessCount(prev => prev + 1);
    }

    // 마지막이면 성공횟수 검사 후 게임종료, 아니면 다음단계
    if (trial === 6) {
      if (successCount > 0) {
        onGameEnd(true);
      } else {
        onGameEnd(true);  // 걍.이기게 해주자...
      }
    } else {
      setTrial(prev => prev + 1);
    }
  }

  return (
    <>
      <div className="w-screen h-screen pointer-events-none absolute">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 p-4 rounded-2xl bg-white text-neutral-700 flex flex-col gap-4 z-80 items-center text-center">
          <p className="font-bold">On Time 퀘스트 2</p>
          <p>슬롯머신에서 세 개의 같은 숫자가 나오면 성공!<br/> 6회의 기회가 주어집니다</p>
          <p className="w-full flex justify-center text-2xl">지금까지 번 시간: {successCount * 10}일</p>
          <p>라운드: {trial}</p>
          <Button
            onClick={() => {
              if (motionPhase.current === 'idle') {
                motionPhase.current = 'toSide'
                resetRound();
              } else if (motionPhase.current === 'done') {
                motionPhase.current = 'idle';
                onRoundEnd(successRef.current ? true : false);
              }
            }}
            label={motionPhase.current === 'idle' ? '시도' : '확인'}
            worldKey="time"
            id='1'
            important={true}
          />
        </div>
        {motionPhase.current === 'done' &&
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-30 h-30 flex items-center justify-center rounded-full bg-yellow-300 text-black text-5xl flex flex-col gap-4 z-80 items-center text-center">{successRef.current ? '성공!' : '꽝!'}</div>
        }
      </div>
    </>
  )
}

export default function W1G2({
  worldKey, gameKey, onGameEnd, avatar
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
  avatar: Object3D;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const motionPhase = useRef<'idle' | 'toSide' | 'handle' | 'toFront' | 'cylinder' | 'done'>('idle');
  const successRef = useRef<boolean>(null);
  const trialRef = useRef(0); // ui와 관련없음, 마지막에 이기게 해주기 위한 것

  const cylinderRotProg = useRef(0);
  const groupRotProg = useRef(0);
  const handleRotProg = useRef(0);

  const groupRef = useRef<Object3D>(null);
  const handleRef = useRef<Object3D>(null);
  const cylinderRefs = useRef<Object3D[]>([]);

  const randomAnglesRef = useRef<{angle:number,obj:string}[]>([]);
  const spins = 5;
  const finalRotRef = useRef<number[]>([]);
  const correction = 40;

  function resetRound() {
    const angleObjMap: {angle:number, obj:string}[][] = [
      [
        { angle: 0, obj: 'text' },
        { angle: 50, obj: 'cherry' },
        { angle: 108, obj: 'bell' },
        { angle: 174, obj: 'seven' },
        { angle: 260, obj: 'text' },
      ],
      [
        { angle: 0, obj: 'seven' },
        { angle: 50, obj: 'bell' },
        { angle: 108, obj: 'text' },
        { angle: 184, obj: 'cherry' },
        { angle: 260, obj: 'seven' },
      ],
      [
        { angle: 0, obj: 'cherry' },
        { angle: 57, obj: 'text' },
        { angle: 124, obj: 'seven' },
        { angle: 190, obj: 'bell' },
        { angle: 271, obj: 'cherry' },
      ],
    ]

    trialRef.current += 1;
    console.log(trialRef.current)

    if (trialRef.current < 6) {
      // 일반 라운드: 랜덤 선택
      randomAnglesRef.current = angleObjMap.map(
        (reel) => reel[Math.floor(Math.random() * reel.length)]
      );
    } else {
      // 마지막 라운드: 무조건 성공 (모두 같은 obj)
      const winningObj = "seven";
      randomAnglesRef.current = angleObjMap.map((reel) => {
        return reel.find((item) => item.obj === winningObj) || reel[0];
      });
    }

    finalRotRef.current = randomAnglesRef.current.map(item => item.angle + 360 * spins);
    successRef.current = randomAnglesRef.current.every(a => a.obj === randomAnglesRef.current[0].obj);

    // reset progress
    cylinderRotProg.current = 0;
    groupRotProg.current = 0;
    handleRotProg.current = 0;

    // reset rotations visually
    if (groupRef.current) groupRef.current.rotation.y = Math.PI;
    if (handleRef.current) handleRef.current.rotation.x = degToRad(5);
    cylinderRefs.current.forEach(c => c.rotation.x = degToRad(-correction));
  }

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
        resetRound={resetRound}
      />

      {/* 게임 */}
      <Scene>
        <SlotGame
          motionPhase={motionPhase}
          successRef={successRef}
          groupRotProg={groupRotProg}
          cylinderRotProg={cylinderRotProg}
          handleRotProg={handleRotProg}
          groupRef={groupRef}
          handleRef={handleRef}
          cylinderRefs={cylinderRefs}
          finalRotRef={finalRotRef}
        />
        
        {/* 빛 */}
        <group rotation={[0,radToDeg(-10),0]}>
          <TimeLights />
        </group>
        <TimeEffects />
      </Scene>

      <AudioPlayer src={`/audio/time_bg.mp3`} audioRef={audioRef} />
    </main>
  )
}