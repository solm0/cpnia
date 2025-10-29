import CoinStairs from "./CoinStairs";
import PachinkoCircle from "./PachinkoCircle";
import { RigidBody } from "@react-three/rapier";
import Model from "../../util/Model";
import { degToRad } from "three/src/math/MathUtils.js";
import { FloatingIsland } from "./FloatingIsland";
import { useGLTF } from "@react-three/drei";
import { RefObject, useMemo, useState } from "react";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import Npcs from "../Npcs";
import PlayerWithStair from "./PlayerWithStair";
import Portals from "../Portals";
import { Object3D, Vector3 } from "three";
import { chatNpcProp } from "@/app/lib/data/positions/chatNpcs";
import { useGameStore } from "@/app/lib/state/gameState";
import { DebugBoundaries } from "../player/debogBoundaries";
import RouletteNumbers from "./RouletteNumbers";

useGLTF.preload("/models/card.glb");
useGLTF.preload("/models/pachinko-stage.glb");
useGLTF.preload("/models/roulette.gltf");

const scale = 1;
const center = [0,0,0];

export const stagePositions: Record<string, {
  x:number, y:number, z:number, scale: number;
}> = {
  card: {
    x: scale * center[0] - scale * 50,
    y: scale * center[1] - scale * 230,
    z: scale * center[2] + scale * 100,
    scale: scale * 4.5
  },
  pachinko: {
    x: scale * center[0] + scale * 120,
    y: scale * center[1] - scale * 134.5,
    z: scale * center[2] + scale * 160,
    scale: scale * 2.4
  },
  roulette: {
    x: scale * center[0] + scale * 1,
    y: scale * center[1] - scale * 1.4,
    z: scale * center[2] - scale * 37,
    scale: scale * 5
  },
}

export interface coinStairProp {
  top: [number,number,number];
  bottom: [number, number, number];
  count: number;
}

export const coinStairs: coinStairProp[] = [
  {
    // 1-2
    top: [
      stagePositions.pachinko.x - scale * 50,
      stagePositions.pachinko.y + scale * 40,
      stagePositions.pachinko.z - scale * 10
    ],
    bottom: [
      stagePositions.card.x + stagePositions.card.scale * 1,
      stagePositions.card.y + stagePositions.card.scale * 20,
      stagePositions.card.z + stagePositions.card.scale,
    ],
    count: 5,
  },
  // 2-3
  {
    top: [
      stagePositions.roulette.x * stagePositions.roulette.scale * 0.2,
      stagePositions.roulette.y + stagePositions.roulette.scale * 0.7,
      stagePositions.roulette.z + stagePositions.roulette.scale * 12
    ],
    bottom: [
      stagePositions.pachinko.x - stagePositions.pachinko.scale * 1,
      stagePositions.pachinko.y + stagePositions.pachinko.scale * 10,
      stagePositions.pachinko.z - stagePositions.pachinko.scale * 10
    ],
    count: 10,
  },
]

export const rouletteIsland: {
  scale: number;
  position: [number, number, number];
}[] = [
  {
    scale: scale * 1.8,
    position: [
      stagePositions.roulette.x + 49,
      stagePositions.roulette.y - 18.6,
      stagePositions.roulette.z - 13
    ],
  },
  {
    scale: scale * 1.5,
    position: [
      stagePositions.roulette.x - 51,
      stagePositions.roulette.y - 18.6,
      stagePositions.roulette.z - 13
    ],
  },
  {
    scale: scale * 1.7,
    position: [
      stagePositions.roulette.x - 1,
      stagePositions.roulette.y - 28.6,
      stagePositions.roulette.z + 37,
    ],
  },
]

export const subtractions: Record<string, {
  position:[number,number,number],
  rotation:[number,number,number],
  radius?:number,
  size?:[number,number,number],
  type?: string;
}[]> = {
  time: [
    {
      position: [stagePositions.pachinko.x,stagePositions.pachinko.y,stagePositions.pachinko.z],
      rotation: [0,0,0],
      radius: 23,
      type: 'circle'
    },
    {
      position: [stagePositions.roulette.x,stagePositions.roulette.y,stagePositions.roulette.z],
      rotation: [0,0,0],
      radius: 10,
      type: 'circle'
    },
  ],
  sacrifice: [],
  entropy: []
}

export default function TimeMap({
  stairClimbMode, avatar, chatNpc,
  activeNpc, setActiveNpc, setIsChatOpen,
}: {
  stairClimbMode?: RefObject<boolean>;
  avatar: Object3D;
  chatNpc: chatNpcProp;
  activeNpc: string | null;
  setActiveNpc: (activeNpc: string | null) => void;
  setIsChatOpen: (isChatOpen: boolean) => void;
}) {
  const worldKey = 'time';

  const card = useGLTF("/models/card.glb").scene;
  const pachinko = useGLTF("/models/pachinko-stage.glb").scene;
  const roulette = useGLTF("/models/roulette.gltf").scene;
  const rouletteIslands = useMemo(() => {
    return Array.from({ length: rouletteIsland.length }, () => clone(roulette));
  }, [roulette]);
  const npcModelScene = useGLTF('/models/avatars/time-npc.glb').scene;
  const gandalf = useGLTF('/models/avatars/gandalf.gltf').scene;
  const npcModel = useMemo(() => {
    return [
      ...Array.from({ length: 3 }, () => clone(npcModelScene)),
      gandalf
    ];
  }, [npcModelScene, gandalf]);

  function handleClickStair(clickedStair: number) {
    setClickedStair(clickedStair);
    if (stairClimbMode) stairClimbMode.current = true;
    // console.log('start stairclimb', stairClimbMode, clickedStair)
  }

  const gameState = useGameStore(state => state.worlds[worldKey].games);
  let stage = 0;
  if (gameState['game1'] === false) { stage = 0 }
  else if (gameState['game2'] === false) { stage = 1 }
  else if (gameState['game3'] === false) { stage = 2 }

  const [currentStage, setCurrentStage] = useState(stage);
  const [clickedStair, setClickedStair] = useState<number | null>(null);
  const groundYs = [ 120, -97, 0 ]
  const groundY = groundYs[currentStage];

  const config: Record<number, {
    playerPos: Vector3, playerRot: Vector3
  }> = {
    0: {
      playerPos: new Vector3(
        stagePositions.card.x,
        stagePositions.card.y,
        stagePositions.card.z
      ),
      playerRot: new Vector3(0,Math.PI,0),
    },
    1: {
      playerPos: new Vector3(
        stagePositions.pachinko.x,
        stagePositions.pachinko.y,
        stagePositions.pachinko.z + 30
      ),
      playerRot: new Vector3(0,Math.PI,0),
    },
    2: {
      playerPos: new Vector3(
        stagePositions.roulette.x - 33,
        stagePositions.roulette.y,
        stagePositions.roulette.z
      ),
      playerRot: new Vector3(0,Math.PI,0),
    }
  }

  return (
    <>
      {/* Stage 1. 카드 */}
      <Model
        scene={card}
        scale={stagePositions.card.scale}
        position={[stagePositions.card.x, stagePositions.card.y, stagePositions.card.z]}
        rotation={[0,degToRad(-90),0]}
      />

      {/* Stage 2. 파친코 */}
      <Model
        scene={pachinko}
        scale={stagePositions.pachinko.scale}
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
          stagePositions.pachinko.x - scale * 2,
          stagePositions.pachinko.y + scale * 43,
          stagePositions.pachinko.z + scale * 3.5
        ]}
        scale={scale * 1.6}
      />

      <RigidBody type="fixed" colliders={'ball'}>
        <mesh position={[0,0,-37]}>
          <sphereGeometry args={[12, 10]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
      </RigidBody>

      {/* Stage 3. 룰렛 */}
      <Model
        scene={roulette}
        scale={stagePositions.roulette.scale}
        position={[
          stagePositions.roulette.x,
          stagePositions.roulette.y,
          stagePositions.roulette.z,
        ]}
        rotation={[0,0,0]}
      />

      {rouletteIsland.map((island, idx) => 
        <FloatingIsland
          key={idx}
          scene={rouletteIslands[idx]}
          scale={island.scale}
          position={island.position}
          waitTime={idx}
        />
      )}

      <RouletteNumbers
        center={[
          stagePositions.roulette.x,
          stagePositions.roulette.y,
          stagePositions.roulette.z,
        ]}
        distance={stagePositions.roulette.scale * 12}
        scale={10}
        initialRotation= {[0, degToRad(25), 0]}
      />

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
            coinScale={scale * 3}
          />
        </group>
      ))}

      {/* 포탈들 */}
      <Portals worldKey={worldKey} />

      {/* npc들 */}
      <Npcs
        worldKey={worldKey}
        activeNpc={activeNpc}
        setActiveNpc={setActiveNpc}
        setIsChatOpen={setIsChatOpen}
        chatNpc={chatNpc}
        models={npcModel}
      />

      {/* 플레이어 */}
      <PlayerWithStair
        worldKey={worldKey}
        groundY={groundY}
        stairClimbMode={stairClimbMode}
        currentStage={currentStage}
        setCurrentStage={setCurrentStage}
        clickedStair={clickedStair}
        avatar={avatar}
        stairPosData={coinStairs}
        config={config[currentStage]}
      />
    </>
  )
}