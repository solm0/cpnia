import { timeIsland } from "@/app/lib/data/timeIslands"
import ClonedModel from "../../util/ClonedModels"
import CoinStairs from "./CoinStairs";
import PachinkoCircle from "./PachinkoCircle";
import { RigidBody } from "@react-three/rapier";
import { coinStairs } from "@/app/lib/data/coinStairs";
import { useRef } from "react";
import { Object3D } from "three";
import { useFrame } from "@react-three/fiber";

function FloatingIsland({
  src, scale, position, rotation, waitTime
}: {
  src: string;
  scale: number;
  position: [number, number, number];
  rotation: [number, number, number];
  waitTime: number;
}) {
  const ref = useRef<Object3D>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.position.y = position[1] + Math.sin(t * (waitTime+1)/2) * 6;
    }
  });

  return (
    <group ref={ref}>
      <ClonedModel
        src={src}
        scale={scale}
        position={position}
        rotation={rotation}
      />
    </group>
  )
}

export default function TimeMap({
  stairClimbMode,
  setClickedStair,
}: {
  stairClimbMode?: React.RefObject<boolean>;
  setClickedStair: (clickedStair: number | null) => void;
}) {
  const rouletteIslands1 = timeIsland['roulette1'];

  function handleClickStair(clickedStair: number) {
    setClickedStair(clickedStair);
    if (stairClimbMode) stairClimbMode.current = true;
    console.log('start stairclimb', stairClimbMode, clickedStair)
  }

  return (
    <>
      {/* Stage 1. 카드 */}

      {/* Stage 2. 파친코 */}
      <ClonedModel
        src="/models/coin.gltf"
        scale={0.01}
        position={[80,-100,50]}
        rotation={[0,0,0]}
      />

      <PachinkoCircle
        count={8}
        distance={24}
        center={[80,-97,50]}
      />

      {/* Stage 3. 룰렛 */}
      <ClonedModel
        src="/models/roulette.gltf"
        scale={0.02}
        position={[0,-1.4,-37]}
        rotation={[0,0,0]}
      />

      {rouletteIslands1.map((island, idx) => 
        <FloatingIsland
          key={idx}
          src="/models/roulette.gltf"
          scale={island.scale}
          position={island.position}
          rotation={island.rotation}
          waitTime={idx}
        />
      )}
      <RigidBody type="fixed" colliders={'ball'}>
        <mesh position={[0,0,-37]}>
          <sphereGeometry args={[12, 10]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
      </RigidBody>

      {/* 계단 */}
      {coinStairs.map((coinStair, idx) => (
        <group
          key={idx}
          onClick={() => handleClickStair(idx)}
        >
          <CoinStairs
            endPosition={coinStair.bottom}
            startPosition={coinStair.top}
            count={10}
          />
        </group>
      ))}
    </>
  )
}