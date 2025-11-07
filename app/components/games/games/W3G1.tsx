import Scene from "../../util/Scene";
import { useEffect, useRef, useState } from "react";
import { Environment, OrbitControls,useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { AnimationMixer, Group, Object3D, Vector3 } from "three";
import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
import StartScreen from "./StartScreen";
import AudioPlayer from "../../util/AudioPlayer";
import Player from "./W3G1/Player";

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
        desc='파란 타일을 밟고 문까지 도달하세요'
        buttonLabel='시작하기'
        style="text-gray-900 bg-gray-400 border-2 border-blue-600"
      />

      <AudioPlayer src={`/audio/entropy_bg.mp3`} audioRef={audioRef} />
    </main>
  )
}