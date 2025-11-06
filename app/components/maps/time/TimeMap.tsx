import CoinStairs from "./CoinStairs";
import PachinkoCircle from "./PachinkoCircle";
import { RigidBody } from "@react-three/rapier";
import Model from "../../util/Model";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";
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
import { stagePositions } from "@/app/lib/data/positions/stagePositions";
import GamePortalLabel from "../interfaces/GamePortalLabel";

useGLTF.preload("/models/card.glb");
useGLTF.preload("/models/pachinko-stage.glb");
useGLTF.preload("/models/roulette.gltf");
useGLTF.preload("/models/floor.gltf");

export interface coinStairProp {
  top: [number,number,number];
  bottom: [number, number, number];
  count: number;
}

const scale = 1; // stagePosition의 복제

export const coinStairs: coinStairProp[] = [
  {
    // 1-2
    bottom: [
      stagePositions.card.x + stagePositions.card.scale * 5,
      stagePositions.card.y + stagePositions.card.scale * 23,
      stagePositions.card.z + stagePositions.card.scale,
    ],
    top: [
      stagePositions.pachinko.x - stagePositions.pachinko.scale * 21,
      stagePositions.pachinko.y + stagePositions.pachinko.scale * 19,
      stagePositions.pachinko.z - stagePositions.pachinko.scale * 5
    ],
    count: 5,
  },
  // 2-3
  {
    bottom: [
      stagePositions.pachinko.x - stagePositions.pachinko.scale * 12,
      stagePositions.pachinko.y + stagePositions.pachinko.scale * 20,
      stagePositions.pachinko.z - stagePositions.pachinko.scale * 18
    ],
    top: [
      stagePositions.roulette.x * stagePositions.roulette.scale * 0.2,
      stagePositions.roulette.y + stagePositions.roulette.scale * 1.5,
      stagePositions.roulette.z + stagePositions.roulette.scale * 10
    ],
    count: 10,
  },
]

export const rouletteIsland: {
  scale: number;
  position: [number, number, number];
}[] = [
  {
    scale: stagePositions.roulette.scale * 0.4,
    position: [
      stagePositions.roulette.x + 49*2,
      stagePositions.roulette.y - 18.6*2,
      stagePositions.roulette.z - 13*2
    ],
  },
  {
    scale: stagePositions.roulette.scale * 0.2,
    position: [
      stagePositions.roulette.x - 51*2,
      stagePositions.roulette.y - 18.6*2,
      stagePositions.roulette.z - 13*2
    ],
  },
  {
    scale: stagePositions.roulette.scale * 0.3,
    position: [
      stagePositions.roulette.x - 1*2,
      stagePositions.roulette.y - 28.6*2,
      stagePositions.roulette.z + 37*2,
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
      radius: 18,
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
  const npcModelScene = useGLTF('/models/avatars/time-npc.gltf').scene;
  const gandalf = useGLTF('/models/avatars/gandalf.gltf').scene;
  const npcModel = useMemo(() => {
    return [
      ...Array.from({ length: 3 }, () => clone(npcModelScene)),
      gandalf
    ];
  }, [npcModelScene, gandalf]);
  const floor = useGLTF('/models/floor.gltf').scene;
  const stair = useGLTF('/models/stair.gltf').scene;
  stair.userData = {
    id: `${worldKey}-npc-파친코 위에서 발견한 주민`,
    onClick: () => {
      setActiveNpc('파친코 위에서 발견한 주민');
      setIsChatOpen(false);
    },
  }

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
  else { stage = 3 } // 물체 언락용

  const [currentStage, setCurrentStage] = useState(stage < 3 ? stage : 2); // 계단오르기용
  const [clickedStair, setClickedStair] = useState<number | null>(null);
  const groundYs = [ 120, -97, 0 ]
  const groundY = groundYs[currentStage];

  // console.log(stage, currentStage)

  // Portals의 isLocked의 짭
  // 게임 1을 하기 전 stage는 0, 1층으로 올라가는 계단의 idx는 0
  // 게임 2를 하기 전 stage는 1, 2층으로 올라가는 계단의 idx는 1
  // stage가 idx보다 작거나 같으면 isLocked = true
  function isLocked(stairIdx: number, stage:number) {
    return Number(stage) <= Number(stairIdx)
  }

  const config: Record<number, {
    playerPos: Vector3, playerRot: Vector3,
    camXRot: number, camYRot: number, zoom: number
  }> = {
    0: {
      playerPos: new Vector3(
        stagePositions.card.x - 37,
        stagePositions.card.y,
        stagePositions.card.z + 24
      ),
      playerRot: new Vector3(0,Math.PI,0),
      camXRot: 13,
      camYRot: -90,
      zoom: 50,
    },
    1: {
      playerPos: new Vector3(
        stagePositions.pachinko.x,
        stagePositions.pachinko.y,
        stagePositions.pachinko.z + 30
      ),
      playerRot: new Vector3(0,Math.PI,0),
      camXRot: 15,
      camYRot: 0,
      zoom: 60,
    },
    2: {
      playerPos: new Vector3(
        stagePositions.roulette.x - 10,
        stagePositions.roulette.y,
        stagePositions.roulette.z + 82
      ),
      playerRot: new Vector3(0, Math.PI, 0),
      camXRot: 20,
      camYRot: 20,
      zoom: 50,
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
      <primitive
        object={stair}
        position={[
          stagePositions.pachinko.x - 5,
          stagePositions.pachinko.y + stagePositions.pachinko.scale * 21.4,
          stagePositions.pachinko.z + 8
        ]}
        rotation={[0,degToRad(144),0]}
        scale={2}
      />

      <PachinkoCircle
        count={8}
        distance={16}
        center={[
          stagePositions.pachinko.x - scale * 2,
          stagePositions.pachinko.y + scale * 43,
          stagePositions.pachinko.z + scale * 3.5
        ]}
        scale={scale * 1.6}
      />

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
          onClick={() => {
            if (!isLocked(idx, stage)) {
              handleClickStair(idx);
            }
          }}
        >
          <GamePortalLabel
            locked={isLocked(idx, stage)}
            position={[
              coinStair.bottom[0],
              coinStair.bottom[1] + scale * 10,
              coinStair.bottom[2]
            ]}
            label={isLocked(idx, stage) ? `${stage+1}번째 게임 성공 후에 계단이 열립니다.` : undefined}
          />
          <CoinStairs
            endPosition={coinStair.bottom}
            startPosition={coinStair.top}
            count={coinStair.count}
            coinScale={scale * 3.5}
            handleClickStair={handleClickStair}
            locked={isLocked(idx, stage)}
            idx={idx}
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
        config={config[currentStage < 3 ? currentStage : 2]}
      />

      <Model
        scene={floor}
        scale={10}
        position={[0,-250,0]}
      />
    </>
  )
}