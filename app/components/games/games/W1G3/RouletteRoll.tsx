import Model from "@/app/components/util/Model";
import { Mesh, Vector3 } from "three";
import RouletteNumbers from "./RouletteNumbers";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import Button from "@/app/components/util/Button";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";
import { TimeEffects } from "@/app/components/maps/Effects";
import { TimeLights } from "@/app/components/maps/Lights";

export function Ui({
  success, setSuccess, onRoundEnd, onGameEnd, moneyRef, setUiState
}: {
  success: boolean;
  setSuccess: (success: boolean | null) => void;
  onRoundEnd: (success: boolean) => void;
  onGameEnd: (success: boolean) => void;
  moneyRef: RefObject<number>;
  setUiState: (uiState: "idle" | "rolling" | "dropping" | "done") => void;
}) {
  if (success) {
    moneyRef.current += 1000;
    console.log('성공')

    return (
      <Html className="w-96 rounded-2xl bg-white p-8 -translate-x-1/2 flex flex-col gap-4 items-start">
        <p className="break-keep">성공! 축하드립니다. 시간을 많이 얻으셨네요.</p>
        <Button
          worldKey="time"
          label="확인"
          onClick={() => onRoundEnd(true)}
          id='w1g3-2'
          important={true}
        />
      </Html>
    )
  } else {
    console.log('실패')
    return (
      <Html className="w-96 rounded-2xl bg-white p-8 -translate-x-1/2 flex flex-col gap-4 items-start">
        <p className="break-keep">실패. 다시 하시겠습니까?</p>
        <div className="flex gap-4">
          <Button
            worldKey="time"
            label="예"
            onClick={() => {
              onRoundEnd(false);
              setSuccess(null);
              setUiState("idle");
            }}
            id='w1g3-1'
            important={true}
          />
          <Button
            worldKey="time"
            label="아니오"
            onClick={() => onGameEnd(false)}
            id='w1g3-2'
          />
        </div>
      </Html>
    )
  }
}

export default function RouletteRoll({
  n, betNum, onRoundEnd, onGameEnd, moneyRef, trial
}: {
  n: number;
  betNum: number;
  onRoundEnd: (success: boolean) => void;
  onGameEnd: (success: boolean) => void;
  moneyRef: RefObject<number>;
  trial: number;
}) {
  const roulette = useGLTF("/models/roulette.gltf").scene;

  const [isRolling, setIsRolling] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const [uiState, setUiState] = useState<"idle" | "rolling" | "dropping" | "done">("idle");
  const [success, setSuccess] = useState<boolean | null>(null);
  const [winningNum, setWinningNum] = useState<number | null>(null);
  const pressedKeys = useKeyboardControls();
  const outwardProgress = useRef<number | null>(null);

  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0,8,10);
    camera.lookAt(0, 0, 0);
  }, [camera, trial]);

  // 룰렛 설정
  const roulettePos = [0, 0, 0] as [number, number, number]
  const rouletteScale = 4
  const rouletteSurface = {
    center: new Vector3(
      roulettePos[0],
      roulettePos[1] + rouletteScale,
      roulettePos[2],
    ),
    normal: new Vector3(0, 1, 0).normalize(),
    radius: rouletteScale * 10
  }

  // 공 설정
  const ballRef = useRef<Mesh>(null);
  ballRef.current?.position.set(
    rouletteSurface.center.x + 20,
    rouletteSurface.center.y,
    rouletteSurface.center.z,
  )
  const spinAngle = useRef(0);

  // 각도 설정
  const numWithAngle = useMemo(() => {
    const unitAngle = 360 / n;

    const shuffled = Array.from({ length: n }, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5);

    return shuffled.map((num, i) => ({
      num,
      angle: i * unitAngle,
    }));
  }, [n]);

  const unitAngle = 360 / n;
  const winningIndex = numWithAngle.findIndex(n => n.num === winningNum);
  const winningAngle = winningIndex * unitAngle;

  const rotationProgress = useRef(0);
  const startAngle = useRef(0);
  const totalRotation = useRef(0);

  const startRoll = () => {
    const win = moneyRef.current <= 10 ? betNum : Math.floor(Math.random() * n) + 1 ;
    setWinningNum(win);
    setSuccess(win === betNum);
    console.log('win', win, 'bet', betNum) // do not remove
  
    const winAngle = numWithAngle.find(n => n.num === win)?.angle ?? 0;
  
    startAngle.current = spinAngle.current; // current position
    totalRotation.current = startAngle.current + 3 * 360 + winAngle;
  
    rotationProgress.current = 0;
    setIsRolling(true);
    setUiState("rolling");
    outwardProgress.current = 0;
  }

  // add a ref to store start radius
  const startOutwardRadius = useRef<number>(0);

  const stopAngle = useRef<number | null>(null);

  useFrame((_, delta) => {
    if (isRolling && ballRef.current) {
      rotationProgress.current = Math.min(rotationProgress.current + delta * 1, 1);
      const eased = 1 - Math.pow(1 - rotationProgress.current, 3);
    
      spinAngle.current = startAngle.current + (totalRotation.current - startAngle.current) * eased;
    
      const rad = (spinAngle.current * Math.PI) / 180;
      const rimRadius = rouletteSurface.radius - 20;
    
      ballRef.current.position.set(
        rouletteSurface.center.x + Math.cos(rad) * rimRadius,
        rouletteSurface.center.y,
        rouletteSurface.center.z + Math.sin(rad) * rimRadius
      );
    
      if (rotationProgress.current >= 1) {
        startOutwardRadius.current = rimRadius;
        stopAngle.current = spinAngle.current;
        setIsRolling(false);
        setIsDropping(true);
      }
    }
    
    if (isDropping && ballRef.current && stopAngle.current !== null) {
      outwardProgress.current = Math.min((outwardProgress.current ?? 0) + delta * 0.5, 1);
      const eased = 1 - Math.pow(1 - outwardProgress.current, 3);
      const targetRadius = startOutwardRadius.current + 3;
    
      const newRadius = startOutwardRadius.current + (targetRadius - startOutwardRadius.current) * eased;
      const rad = (stopAngle.current * Math.PI) / 180;
    
      ballRef.current.position.set(
        rouletteSurface.center.x + Math.cos(rad) * newRadius,
        rouletteSurface.center.y,
        rouletteSurface.center.z + Math.sin(rad) * newRadius
      );
    
      if (outwardProgress.current >= 1) {
        setIsDropping(false);
        setUiState("done");
      }
    }

  if (pressedKeys.current.has("Space") && uiState === 'idle') {
    startRoll();
  }
});

  return (
    <>
      {/* 룰렛 */}
      <Model
        scene={roulette}
        scale={rouletteScale}
        position={roulettePos}
      />
      {/* <SurfaceHelper
        center={rouletteSurface.center}
        normal={rouletteSurface.normal}
        radius={rouletteSurface.radius}
        color="red"
      /> */}
      <RouletteNumbers
        numWithAngle={numWithAngle}
        center={rouletteSurface.center}
        distance={rouletteSurface.radius - 12}
      />

      {/* 공 */}
      <mesh ref={ballRef}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* ui */}
      {uiState === 'idle' &&
        <Html className="absolute top-1/2 left-1/2 -translate-x-1/2 bg-neutral-800 p-4">
          <Button
            label='공 굴리기'
            id='w1g3-1'
            important={true}
            onClick={() => startRoll()}
          />
        </Html>
      }
      {uiState === "done" && success !== null &&
        <Ui
          success={success}
          setSuccess={setSuccess}
          onGameEnd={onGameEnd}
          onRoundEnd={onRoundEnd}
          moneyRef={moneyRef}
          setUiState={setUiState}
        />
      }

      {/* 빛 */}
      <TimeEffects />
      <TimeLights />
    </>
  )
}