import Scene from "../../util/Scene";
import GameMenu from "../interfaces/GameMenu";
import { Suspense, useEffect, useRef, useState } from "react";
import BattleField from "./W2G1/BattleField";
import { degToRad } from "three/src/math/MathUtils.js";
import Loader from "../../util/Loader";
import { roundConfig } from "./W2G1/roundConfig";
import { Vector3 } from "three";
import Timer from "./W2G1/Timer";
import Button from "../../util/Button";

export interface BodyData {
  ingr: string;
  pos: [number, number, number];
}

// 조리대
export const sizeX = 60;
export const sizeY = 20;
export const center = new Vector3(-1.7,0,-5.5);

// 피자
export const pizzaRadius = 4.5;

export function isInsidePizza(x: number, z: number): boolean {
  const dx = x - center.x;
  const dz = z - center.z;
  return dx * dx + dz * dz < pizzaRadius * pizzaRadius;
}

export function randomPosition(): [number, number, number] {
  let x: number, z: number;

  do {
    x = center.x + (Math.random() - 0.5) * sizeX;
    z = center.z + (Math.random() - 0.5) * sizeY;
  } while (isInsidePizza(x, z));

  return [x, center.y, z];
}

export function W2G1Interface({
  round, gameOver, secondsRef, worldKey, gameKey
}: {
  round: number;
  gameOver:(success: boolean) => void;
  secondsRef: React.RefObject<number>;
  worldKey: string;
  gameKey: string;
}) {
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (score === roundConfig[round].abnormCount) {
      gameOver(true);
      setScore(0);
    }
  }, [score, round])

  
  return (
    <>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center h-auto w-auto pointer-events-none">
        <div className="absolute w-96 h-96 border-16 border-black rounded-full inset-shadow-sm inset-shadow-black">
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-60 h-[1px] bg-red-600"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[1px] h-60 bg-red-600"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[4px] h-20 bg-black"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[4px] h-20 bg-black"></div>
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-20 h-[4px] bg-black"></div>
          <div className="absolute top-1/2 -translate-y-1/2 right-0 w-20 h-[4px] bg-black"></div>
        </div>

        <div className="flex flex-col gap-2">
          <p>라운드: {round}</p>
          <p>남은 스파이 수: {score}/{roundConfig[round].abnormCount}</p>
          <Timer secondsRef={secondsRef} />
          <Button
            worldKey={worldKey}
            label="클릭"
            onClick={() => setScore(score+1)}
          />
        </div>
        
      </div>

      {/* 게임 인터페이스 */}
      <GameMenu
        worldKey={worldKey}
        gameKey={gameKey}
      />
    </>
  )
}

export default function W2G1({
  worldKey, gameKey, onGameEnd
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
}) {
  const [round, setRound] = useState(1);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const secondsRef = useRef<number>(0);

  // clear previous timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, []);

  function gameOver(success: boolean) {
    if (success) {
      if (round === 3) {
        onGameEnd(true);
      } else {
        setRound(prev => {
          const newRound = prev + 1;

          const time = roundConfig[newRound].time;
          console.log(time)
          secondsRef.current = time;

          return newRound;
        });
      }
    } else {
      onGameEnd(false);
    }
  }

  function startRound(round: number) {
    const time = roundConfig[round].time;
    console.log(round, time)
    secondsRef.current = time;
  
    if (timerRef.current) clearInterval(timerRef.current);
  
    timerRef.current = setInterval(() => {
      if (secondsRef.current <= 1) {
        clearInterval(timerRef.current!);
        gameOver(false);
      } else {
        secondsRef.current -= 1;
      }
    }, 1000);
  }

  
  return (
    <main className="w-full h-full">
      {/* 게임 */}
      <Scene
        position={[0,0,5]}
        rotation={[0,degToRad(20),degToRad(20)]}
      >
        <Suspense fallback={<Loader />}>
          <BattleField
            round={round}
            onRoundReady={startRound}
          />
        </Suspense>
      </Scene>

      <W2G1Interface
        round={round}
        gameOver={gameOver}
        secondsRef={secondsRef}
        worldKey={worldKey}
        gameKey={gameKey}
      />
    </main>
  )
}