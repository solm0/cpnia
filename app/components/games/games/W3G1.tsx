import Scene from "../../util/Scene";
import { RefObject, useEffect, useRef, useState } from "react";
import { Billboard, OrbitControls, Text, useGLTF } from "@react-three/drei";
import FullScreenModal from "../../util/FullScreenModal";
import Button from "../../util/Button";
import { useFrame, useThree } from "@react-three/fiber";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";
import { Group, MathUtils, Vector3 } from "three";

function Player({
  width, cubeMap, onGameEnd, timeRef, runningRef
}: {
  width: number;
  cubeMap: number[];
  onGameEnd: (success: boolean) => void;
  timeRef: React.RefObject<number>;
  runningRef: React.RefObject<boolean>;
}) {
  const avatar = useGLTF('/models/avatars/default.gltf').scene;
  const [pos, setPos] = useState(1);
  const [life, setLife] = useState(10);

  // 키보드 컨트롤
  const pressed = useKeyboardControls();
  const gamepad = useGamepadControls();

  const lastSecRef = useRef(-1);

  useEffect(() => {
    const deadzone = 0.5;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (pressed.current.has("KeyD") || gamepad.current.axes[0] > deadzone) {
        setPos((p) => Math.min(2, p + 1));
      } else if (pressed.current.has("KeyA") || gamepad.current.axes[0] < -deadzone) {
        setPos((p) => Math.max(0, p - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pressed, gamepad]);

  useFrame(() => {
    if (!runningRef.current) return;
    const elapsed = timeRef.current; // seconds as float
    const sec = Math.floor(elapsed);

    if (sec !== lastSecRef.current) {
      lastSecRef.current = sec;

      // boundary check: if sec exceeds cubeMap length -> finish success
      if (sec >= cubeMap.length) {
        onGameEnd(true);
        return;
      }

      // logic: check tile at this second
      const expected = cubeMap[sec];
      if (expected !== pos) {
        setLife(life - 1)
        // you can sync a UI element to lifeRef via separate UI component reading lifeRef
        if (life - 1 <= 0) {
          onGameEnd(false);
        }
      }
    }
  });

  return (
    <group
      position={[-width*1.5 + pos*width, width*0.5, width*2]}
      rotation={[0,Math.PI,0]}
    >
      <Billboard position={[0,5,0]}>
        <Text>{life}</Text>
      </Billboard>
      <primitive
        object={avatar}
        scale={width * 1.3}
      />
    </group>
  )
}

function GameScene({
  width, timeRef, startTimeRef, runningRef, cubeMap,
}: {
  width: number;
  timeRef: React.RefObject<number>; // will be written here
  startTimeRef: React.RefObject<number>;
  runningRef: React.RefObject<boolean>;
  cubeMap: number[];
}) {
  const { camera } = useThree();
  const gutter = 1.1;

  const groupRef = useRef<Group>(null);

  useEffect(() => {
    camera.position.set(0,5,10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame((_, delta) => {
    if (!runningRef.current) {
      // not running -> keep timeRef at 0 and group at start
      timeRef.current = 0;
      if (groupRef.current) groupRef.current.position.z = 0;
      return;
    }

    // compute elapsed seconds from startTimeRef (use same wall clock origin)
    const elapsed = (performance.now() - startTimeRef.current) / 1000;
    timeRef.current = elapsed; // float seconds

    // Visual: move group by exactly elapsed seconds -> 1 cell per second
    // assuming each step should visually move width * 5 * gutter units per second:
    if (groupRef.current) {
      groupRef.current.position.z = elapsed * (width * 5 * gutter);
    }
  })

  return (
    <>
      {/* 큐브들 */}
      <group ref={groupRef} position={[-width*1.5, 0, 0]}>
        {cubeMap.map((row, rowIndex) => (
          <>
            {Array.from({length: 4}).map((_, i) => (
              <mesh
                key={`${rowIndex}-${i}`}
                position={new Vector3(
                  i * width * gutter,
                  row === i ? 0 : -width*0.5,
                  -rowIndex * width*5 * gutter
              )}>
                <boxGeometry args={[width, width, width*5]} />
                <meshBasicMaterial color={'blue'} transparent opacity={row === i ? 1 : 0.2} />
              </mesh>
            ))}
          </>
        ))}
      </group>
    </>
  )
}

function StartScreen({worldKey, handleStart}: {worldKey: string; handleStart:() => void;}) {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <>
      {!hasStarted &&
        <FullScreenModal>
          <p>핑크 타일만 터치하세요</p>
          <Button
            onClick={() => {
              handleStart();
              setHasStarted(true);
            }}
            label="시작하기"
            worldKey={worldKey}
            autoFocus={true}
          />
        </FullScreenModal>
      }
    </>
  )
}

export default function W3G1({
  worldKey, gameKey, onGameEnd
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
}) {
  const width = 3;
  const startTimeRef = useRef<number>(0);
  const runningRef = useRef<boolean>(false);
  const timeRef = useRef<number>(0);
  const length = 20;
  
  const [cubeMap] = useState<number[]>(() => {
    const map: number[] = [];
    for (let i = 0; i < length; i++) {
      const answer = Math.floor(Math.random() * 4);
      map.push(answer);
    }
    return map
  });

  const handleStart = () => {
    startTimeRef.current = performance.now();
    runningRef.current = true;
  };
  
  return (
    <main className="w-full h-full">
      {/* 게임 */}
      <Scene>
        <GameScene
          width={width}
          timeRef={timeRef}
          startTimeRef={startTimeRef}
          runningRef={runningRef}
          cubeMap={cubeMap}
        />

        {/* 플레이어 */}
        <Player
          width={width}
          cubeMap={cubeMap}
          onGameEnd={onGameEnd}
          timeRef={timeRef}
          runningRef={runningRef}
        />
        <OrbitControls minDistance={30} maxDistance={100} />
        <directionalLight intensity={1} position={[0,10,10]} />
        
      </Scene>

      {/* 게임 인터페이스 */}

      <StartScreen worldKey={worldKey} handleStart={handleStart} />
    </main>
  )
}