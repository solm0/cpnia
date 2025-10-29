import { timeIsland } from "@/app/lib/data/positions/timeIslands"
import CoinStairs from "./CoinStairs";
import PachinkoCircle from "./PachinkoCircle";
import { RigidBody } from "@react-three/rapier";
import { coinStairs } from "@/app/lib/data/positions/coinStairs";
import Model from "../../util/Model";
import { degToRad } from "three/src/math/MathUtils.js";
import { FloatingIsland } from "./FloatingIsland";
import { stagePositions } from "@/app/lib/data/positions/stagePositions";
import { useGLTF } from "@react-three/drei";

export default function TimeMap({
  stairClimbMode,
  setClickedStair,
}: {
  stairClimbMode?: React.RefObject<boolean>;
  setClickedStair: (clickedStair: number | null) => void;
}) {
  const rouletteIslands1 = timeIsland['roulette1'];
  const card = useGLTF("/models/card.glb").scene;
  const pachinko = useGLTF("/models/pachinko-stage.glb").scene;
  const roulette = useGLTF("/models/roulette.gltf").scene;

  function handleClickStair(clickedStair: number) {
    setClickedStair(clickedStair);
    if (stairClimbMode) stairClimbMode.current = true;
    console.log('start stairclimb', stairClimbMode, clickedStair)
  }

  return (
    <>
      {/* Stage 1. 카드 */}
      <Model
        scene={card}
        scale={2}
        position={[stagePositions.card.x, stagePositions.card.y, stagePositions.card.z]}
        rotation={[0,degToRad(90),0]}
      />

      {/* Stage 2. 파친코 */}
      <Model
        scene={pachinko}
        scale={2.2}
        position={[
          stagePositions.pachinko.x,
          stagePositions.pachinko.y,
          stagePositions.pachinko.z
        ]}
      />

      <PachinkoCircle
        count={8}
        distance={14}
        center={[
          stagePositions.pachinko.x-2,
          stagePositions.pachinko.y+39.3,
          stagePositions.pachinko.z+3.5
        ]}
        scale={1.6}
      />

      {/* Stage 3. 룰렛 */}
      <Model
        scene={roulette}
        scale={0.02}
        position={[
          stagePositions.roulette.x,
          stagePositions.roulette.y,
          stagePositions.roulette.z,
        ]}
        rotation={[0,0,0]}
      />

      {rouletteIslands1.map((island, idx) => 
        <FloatingIsland
          key={idx}
          scene={roulette}
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
            count={coinStair.count}
          />
        </group>
      ))}
    </>
  )
}