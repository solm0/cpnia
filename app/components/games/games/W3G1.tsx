import Scene from "../../util/Scene";
import { RefObject, useEffect, useRef, useState } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useTimerRef } from "./W3G3/useTimerRef";
import FullScreenModal from "../../util/FullScreenModal";
import Button from "../../util/Button";
import { useFrame, useThree } from "@react-three/fiber";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";

function Player({
  timerRef, width,
}: {
  timerRef: RefObject<{
    startTime: number;
    elapsed: number;
    running: boolean;
  }>;
  width: number
}) {
  const avatar = useGLTF('/models/avatars/default.gltf').scene;
  const [pos, setPos] = useState(1);

  // 키보드 컨트롤
  const pressed = useKeyboardControls();
  const gamepad = useGamepadControls();

  useEffect(() => {
    const deadzone = 0.5;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (pressed.current.has("KeyD") || gamepad.current.axes[0] > deadzone) {
        setPos(prev => {
          if (prev <= 2) {
            return prev + 1;
          }
          return prev;
        });
      } else if (pressed.current.has("KeyA") || gamepad.current.axes[0] < -deadzone) {
        setPos(prev => {
          if (prev >= 1) {
            return prev - 1;
          }
          return prev;
        });
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useFrame(() => {
    // --- 타이머 ---
    if (timerRef.current.running) {
      timerRef.current.elapsed = (performance.now() - timerRef.current.startTime) / length;
    }
  })

  return (
    <primitive
      object={avatar}
      scale={width * 0.1}
      position={[pos * 3, 0, 0]}
    />
  )
}

function GameScene({
  width, timerRef
}: {
  width: number;
  timerRef: RefObject<{
    startTime: number;
    elapsed: number;
    running: boolean;
  }>;
}) {
  const { camera } = useThree();

  // 초기 카메라
  useEffect(() => {
    camera.position.set(0,5,10);
    camera.rotation.set(0,0,0);
    camera.lookAt(0, 5, 0);
  }, [camera]);

  useFrame(() => {
    

    // groupRef의 z축 이동 속도에 width 곱하기
  })

  return (
    <>
      {/* 큐브들 */}

      {/* 플레이어 */}
      <Player timerRef={timerRef} width={width} />

      <OrbitControls minDistance={30} maxDistance={100} />
    </>
  )
}

function Ui({
  life
}: {
  life: number;
}) {
  return (
    <div className="absolute top-0 left-0 w-auto h-10 bg-amber-600">{life}</div>
  )
}

export default function W3G1({
  worldKey, gameKey, onGameEnd
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
}) {
  const [life, setLife] = useState(10);
  const width = 50;
  const { timerRef, start } = useTimerRef();
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (life <= 0) onGameEnd(false);
  }, [life])
  
  return (
    <main className="w-full h-full">
      {/* 게임 */}
      <Scene>
        <GameScene
          width={width}
          timerRef={timerRef}
        />
        
      </Scene>

      {/* 게임 인터페이스 */}
      <Ui
        life={life}
      />

      {!hasStarted &&
        <FullScreenModal>
          <p>핑크 타일만 터치하세요</p>
          <Button
            onClick={() => {
              setHasStarted(true);
              start();
            }}
            label="시작하기"
            worldKey={worldKey}
            autoFocus={true}
          />
        </FullScreenModal>
      }
    </main>
  )
}