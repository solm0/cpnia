import Model from "@/app/components/util/Model";
import { SurfaceHelper } from "../W2G2/SurfaceHelper";
import { Mesh, Vector3 } from "three";
import RouletteNumbers from "./RouletteNumbers";
import { RefObject, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import Button from "@/app/components/util/Button";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";

export function Ui({
  success, onRoundEnd, onGameEnd, moneyRef
}: {
  success: boolean;
  onRoundEnd: (success: boolean) => void;
  onGameEnd: (success: boolean) => void;
  moneyRef: RefObject<number>;
}) {
  if (success) {
    moneyRef.current += 1000;
    console.log('성공')

    return (
      <Html>
        <div>성공! 축하드립니다 시간을 많이 얻으셧네요.</div>
        <Button
          worldKey="sacrifice"
          label="확인"
          onClick={() => onRoundEnd(true)}
        />
      </Html>
    )
  } else {
    console.log('실패')
    return (
      <Html>
        <div>실패. 다시 하시겠습니까?</div>
        <Button
          worldKey="sacrifice"
          label="예"
          onClick={() => onRoundEnd(false)}
        />
        <Button
          worldKey="sacrifice"
          label="아니오"
          onClick={() => onGameEnd(false)}
        />
      </Html>
    )
  }
}

export default function RouletteRoll({
  n, betNum, onRoundEnd, onGameEnd, moneyRef
}: {
  n: number;
  betNum: number;
  onRoundEnd: (success: boolean) => void;
  onGameEnd: (success: boolean) => void;
  moneyRef: RefObject<number>;
}) {
  const [isRolling, setIsRolling] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const [uiState, setUiState] = useState<"idle" | "rolling" | "dropping" | "done">("idle");
  const [success, setSuccess] = useState<boolean | null>(null);
  const [winningNum, setWinningNum] = useState<number | null>(null);

  const spaceKeyPressed = useRef(false);
  const pressedKeys = useKeyboardControls();

  // 룰렛 설정
  const roulettePos = [0, 0, 0] as [number, number, number]
  const rouletteScale = 0.02
  const rouletteSurface = {
    center: new Vector3(
      roulettePos[0],
      roulettePos[1] + rouletteScale * 60,
      roulettePos[2],
    ),
    normal: new Vector3(0, 1, 0).normalize(),
    radius: rouletteScale * 2000
  }

  // 공 설정
  const ballRef = useRef<Mesh>(null);
  ballRef.current?.position.set(
    rouletteSurface.center.x + 20,
    rouletteSurface.center.y,
    rouletteSurface.center.z,
  )
  const spinAngle = useRef(0);
  const spinSpeed = useRef(0);

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

  const startRoll = () => {
    const win = Math.floor(Math.random() * n) + 1;
    setWinningNum(win);
    setSuccess(win === betNum);
    spinAngle.current = 0;
    spinSpeed.current = 20;
    setIsRolling(true);
    setUiState("rolling");
  }

  useFrame((_, delta) => {
    if (isRolling && ballRef.current) {
      spinAngle.current += spinSpeed.current * delta;
      spinSpeed.current *= 0.985; // friction

      // keep rotating the ball
      const rad = (spinAngle.current * Math.PI) / 180;
      const x = rouletteSurface.center.x + Math.cos(rad) * (rouletteSurface.radius - 5);
      const y = rouletteSurface.center.y + Math.sin(rad) * (rouletteSurface.radius - 5);
      ballRef.current.position.set(x, y, rouletteSurface.center.z + 2);

      // 🧮 if speed is slow enough, snap to winning angle and drop
      if (spinSpeed.current < 0.3 && winningNum !== null) {
        const winAngle = numWithAngle.find((n) => n.num === winningNum)?.angle ?? 0;
        spinAngle.current = winAngle;
        setIsRolling(false);
        setIsDropping(true);
        setUiState("dropping");
      }
    }

    if (isDropping && ballRef.current) {
      const pos = ballRef.current.position;

      // 떨어지는게 아니고, 일정한 정도만큼 angle의 방향으로 간 다음 done하면 됨.
      pos.z -= delta;
      if (pos.z < rouletteSurface.center.z - 1) {
        setIsDropping(false);
        setUiState("done");
      }
    }

    if (pressedKeys.current.has("Space")) {
      if (uiState === 'idle') {
        startRoll();
      }
    }
  });

  return (
    <>
      {/* 룰렛 */}
      <Model
        src="/models/roulette.gltf"
        scale={rouletteScale}
        position={roulettePos}
      />
      <SurfaceHelper
        center={rouletteSurface.center}
        normal={rouletteSurface.normal}
        radius={rouletteSurface.radius}
        color="red"
      />
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
      {uiState !== "done" && success &&
        <Ui
          success={success}
          onGameEnd={onGameEnd}
          onRoundEnd={onRoundEnd}
          moneyRef={moneyRef}
        />
      }

      {/* 빛 */}
      <directionalLight intensity={3} position={[0,8,0]} color={'white'} />
      <ambientLight intensity={0.5} color={'white'} />
    </>
  )
}