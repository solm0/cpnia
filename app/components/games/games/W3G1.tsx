import Scene from "../../util/Scene";
import { useEffect, useRef, useState } from "react";
import { Billboard, Environment, OrbitControls, Text, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";
import { AnimationMixer, Group, LoopRepeat, Object3D, Vector3 } from "three";
import { useAnimGltf } from "@/app/lib/hooks/useAnimGltf";
import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
import StartScreen from "./StartScreen";
import AudioPlayer from "../../util/AudioPlayer";

function Player({
  width, cubeMap, onGameEnd, timeRef, runningRef, avatar
}: {
  width: number;
  cubeMap: number[];
  onGameEnd: (success: boolean) => void;
  timeRef: React.RefObject<number>;
  runningRef: React.RefObject<boolean>;
  avatar: Object3D;
}) {
  const animGltf = useAnimGltf();
  const mixer = useRef<AnimationMixer | null>(null);
  const [pos, setPos] = useState(1);
  const [life, setLife] = useState(10);

  // 키보드 컨트롤
  const pressed = useKeyboardControls();
  const gamepad = useGamepadControls();

  const lastSecRef = useRef(-1);
  const groupRef = useRef<Group>(null);
  const jumpHeight = width * 1.2;

  useEffect(() => {
    const deadzone = 0.5;
    const handleKeyDown = () => {
      if (pressed.current.has("KeyD") || gamepad.current.axes[0] > deadzone) {
        setPos((p) => Math.min(3, p + 1));
      } else if (pressed.current.has("KeyA") || gamepad.current.axes[0] < -deadzone) {
        setPos((p) => Math.max(0, p - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pressed, gamepad]);

  useEffect(() => {
    mixer.current = new AnimationMixer(avatar);
    return () => {
      mixer.current?.stopAllAction();
    };
  }, [avatar]);

  useEffect(() => {
    if (!mixer.current) return;
    const anim = animGltf[2]?.animations?.[0];
    if (!anim) return;
  
    const action = mixer.current.clipAction(anim);
    action
      .reset()
      .fadeIn(0.2)
      .setLoop(LoopRepeat, Infinity)
      .play();
  
  }, [animGltf]);


  useFrame((_, delta) => {
    mixer.current?.update(delta);

    if (!runningRef.current) return;
    const elapsed = timeRef.current;
    const sec = Math.floor(elapsed);
    const t = elapsed - sec;

    // 🟣 Jump curve y = h * 4t(1-t)
    const jumpY = jumpHeight * 4 * t * (1 - t);

    // Update player group position
    if (groupRef.current) {
      groupRef.current.position.set(
        -width * 1.5 + pos * width,
        width * 0.5 + jumpY,
        width * 2
      );
    }

    if (sec !== lastSecRef.current) {
      lastSecRef.current = sec;

      if (sec >= cubeMap.length) {
        onGameEnd(true);
        return;
      }

      const expected = cubeMap[sec];
      if (expected !== pos) {
        setLife(life - 1)
        if (life - 1 <= 0) {
          onGameEnd(false);
        }
      }
    }
  });

  return (
    <group
      ref={groupRef}
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

useGLTF.preload('/models/gate.glb');

function GameScene({
  width, timeRef, startTimeRef, runningRef, cubeMap,
}: {
  width: number;
  timeRef: React.RefObject<number>; // will be written here
  startTimeRef: React.RefObject<number>;
  runningRef: React.RefObject<boolean>;
  cubeMap: number[];
}) {
  const gate = useGLTF('/models/gate.glb');
  const mixer = useRef<AnimationMixer | null>(null);

  const { camera } = useThree();
  const gutter = 1.1;

  const groupRef = useRef<Group>(null);

  useEffect(() => {
    camera.position.set(0,5,10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useEffect(() => {
    mixer.current = new AnimationMixer(gate.scene);
    const anim = gate?.animations?.[0];
    console.log(gate?.animations)
    if (!anim) return;
    console.log(anim)
    const action = mixer.current.clipAction(anim);
    action.play();

    return () => {
      mixer.current?.stopAllAction();
    };
  }, [gate]);

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

    // console.log(timeRef.current)
    if (timeRef.current >= 15) {
      // console.log('f', timeRef.current)
      mixer.current?.update(delta);
    }

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
                  0,
                  -rowIndex * width*5 * gutter
              )}>
                <boxGeometry args={[width, width, width*5]} />
                <meshBasicMaterial color={'blue'} transparent opacity={row === i ? 1 : 0.2} />
              </mesh>
            ))}

          </>
        ))}
        <Environment files={'/hdri/bay.hdr'} background={false} environmentIntensity={1} />
        
        <primitive
          object={gate.scene}
          position={[width*1.87, 5, -cubeMap.length * width*5 * gutter]}
          scale={35}
        />
        <directionalLight
          intensity={10}
          position={[width*1.87+10, -10, -cubeMap.length * width*5 * gutter]}
        />
        <directionalLight
          intensity={10}
          position={[width*1.87-10, -10, -cubeMap.length * width*5 * gutter]}
        />
      </group>

    </>
  )
}

export default function W3G1({
  worldKey, gameKey, onGameEnd, avatar,
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
  avatar: Object3D;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
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
    return map;
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
          avatar={avatar}
        />
        <OrbitControls minDistance={30} maxDistance={100} />
        <directionalLight intensity={1} position={[0,10,10]} />
        
        <color attach="background" args={["black"]} />
        <EffectComposer>
          <DepthOfField focusDistance={0} focalLength={0.3} bokehScale={8} height={480} />
        </EffectComposer>
      </Scene>

      {/* 게임 인터페이스 */}

      <StartScreen
        worldKey={worldKey}
        gameKey={gameKey}
        handleStart={handleStart}
        desc='파란 타일을 밟고 도시의 중심까지 도달하세요'
        buttonLabel='시작하기'
        style="text-white"
      />

      <AudioPlayer src={`/audio/entropy_bg.mp3`} audioRef={audioRef} />
    </main>
  )
}