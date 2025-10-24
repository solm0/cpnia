import Scene from "../../util/Scene";
import { RefObject, useEffect, useRef, useState } from "react";
import FullScreenModal from "../../util/FullScreenModal";
import Button from "../../util/Button";
import { Mesh, MeshStandardMaterial, Object3D, Quaternion, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import Player from "./W3G2/Player";
import { Physics } from "@react-three/rapier";
import { Html, useGLTF } from "@react-three/drei";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";

export interface Core {
  id: number;
  object: Object3D;
  position: Vector3;
  leftClicks: number;
  isTarget: boolean;
  meshes?: Mesh[];
}

export interface PlayerData {
  position: Vector3;
  rotation: Quaternion;
}

export interface Field {
  center: [number, number];
  size: [number, number];
}

function MiniMap({
  coresRef, playerRef
}: {
  coresRef: RefObject<Core[]>;
  playerRef: RefObject<PlayerData>;
}) {
  const relativeCorePos = useRef<Vector3[]>([]);
  
  useFrame(() => {
    // playerRef.rotation.current 이용해 방향 선 계산

    // playerRef.position.current와 coresRef.position.current이용해
    // 코어들의 상대적 위치 계산해 relativeCorePos.current 업데이트
    // 어떻게 배열들을 한꺼번에 업데이트?
  })

  return (
    <group> {/* 회전 */}
      {/* 검은색 동그라미 */}

      {/* 중심 플레이어 점 */}

      {/* 방향 선 */}

      {/* 코어 상대적인 위치 점 */}
    </group>
  )
}

function GameScene({
  scoreRef, coresRef, playerRef, setScore, field,
}: {
  scoreRef: RefObject<number>;
  coresRef: RefObject<Core[]>;
  playerRef: RefObject<PlayerData>;
  setScore: (score: number) => void;
  field: Field;
}) {
  const nearestCoreRef = useRef<Core | null>(null);
  const targetDistance = 8;
  
  const pressedKeys = useKeyboardControls();
  const gamepad = useGamepadControls();

  // map gltf 가져오기

  type CoreLabel = {
    id: number;
    position: Vector3;
    leftClicks: number;
  }

  const [coreLabels, setCoreLabels] = useState<CoreLabel[]>([]);

  useEffect(() => {
    // 코어 초기화 시 material을 독립적으로 복제, 각 core에 meshes 배열을 만들어둠
    coresRef.current.forEach((core, i) => {
      core.id = i;
      const meshes: Mesh[] = [];

      core.object.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh;
          mesh.material = (mesh.material as MeshStandardMaterial).clone();
          meshes.push(child as Mesh)
        }
      });
      core.meshes = meshes;
    });

    // coreLabels 초기화
    setCoreLabels(
      coresRef.current.map(core => ({
        id: core.id,
        position: core.position.clone(),
        leftClicks: core.leftClicks,
      }))
    );
  }, []);

  const clickProcessed = useRef(false);

  useFrame(() => {
    // --- 타겟 설정 ---
    const playerPos = playerRef.current.position;
    let nearestCore: Core | null = null;
    let nearestDist = Infinity;

    // 모든 coresRef를 순회하며 거리 계산 후 nearestCore 결정
    for (const core of coresRef.current) {
      const dist = playerPos.distanceTo(core.position);
      core.isTarget = false
      if (dist <= targetDistance && dist < nearestDist) {
        nearestCore = core;
        nearestDist = dist;
      };
    }

    if (nearestCore) {
      nearestCore.isTarget = true;
    }
    nearestCoreRef.current = nearestCore;

    // --- 색상 변경 ---
    coresRef.current.forEach(core => {
      const isTarget = core.isTarget;
      if (!core.meshes) return;
      core.meshes.forEach((mesh: Mesh) => {
        const mat = mesh.material as MeshStandardMaterial;
        mat.emissive.set(isTarget ? 0x33ff66 : 0x000000);
        mat.emissiveIntensity = isTarget ? 0.5 : 0;
      });
    });

    // --- 클릭 감지 ---
    const isClicking = pressedKeys.current.has("Enter") || gamepad.current.buttons[0];
    if (isClicking && nearestCore && !clickProcessed.current) {
      if (nearestCore.leftClicks > 0) nearestCore.leftClicks -= 1;

      setCoreLabels(
        coresRef.current.map(core => ({
          id: core.id,
          position: core.position.clone(),
          leftClicks: core.leftClicks,
        }))
      );

      if (nearestCore.leftClicks === 0) {
        scoreRef.current += 1;
        setScore(scoreRef.current);

        // 코어 배열에서 제거
        const index = coresRef.current.indexOf(nearestCore);
        if (index !== -1) coresRef.current.splice(index, 1);

        // coreLabel, 타겟 없애기
        setCoreLabels(prev => prev.filter(label => label.id !== nearestCore.id));
        nearestCoreRef.current = null;
      }
      clickProcessed.current = true;
    };
    
    if (!isClicking) {
      clickProcessed.current = false;
    }
  })

  return (
    <Physics>
      {/* 맵 */}

      {/* 코어 */}
      {coresRef.current.map((core, i) => (
        <primitive
          key={core.id}
          object={core.object}
          position={core.position}
        />
      ))}
      {coreLabels.map(label => (
        <Html
          key={label.id}
          position={[label.position.x, label.position.y + 2, label.position.z]}
          center
          className="bg-amber-500 w-auto h-auto absolute top-0 left-0"
        >
          {label.leftClicks}
        </Html>
      ))}

      {/* 플레이어 */}
      <Player playerRef={playerRef} field={field} />

      <directionalLight intensity={5} />
    </Physics>
  )
}

function Ui({
  score, leftSec
}: {
  score: number;
  leftSec: number;
}) {
  return (
    <div className="absolute top-0 left-0 flex flex-col gap-2">
      <p>파괴한 코어: {score}개</p>
      <p>남은 시간: {leftSec}초</p>
    </div>
  )
}

export default function W3G1({
  worldKey, gameKey, onGameEnd
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
}) {
  const sec = 60;
  const initialPlayer = {
    position: new Vector3(0,0,0),
    rotation: new Quaternion()
  }
  const field: Field = {
    center: [0, 0],
    size: [50, 50]
  }
  const goal = 5;
  const coreCount = 10;
  const initialCores: Core[] = [];
  const maxClicks = 20;
  const coreGltf = useGLTF('/models/placeholder.glb').scene;
  useEffect(() => {
    coreGltf.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [coreGltf])

  const scoreRef = useRef(0); // 실시간점수누적
  const [score, setScore] = useState(0); // UI 업데이트용
  const [leftSec, setLeftSec] = useState(sec);
  const coresRef = useRef<Core[]>([]);
  const playerRef = useRef<PlayerData>(initialPlayer)
  const [hasStarted, setHasStarted] = useState(false);

  // 타이머, 게임 종료
  useEffect(() => {
    if (hasStarted) {
      const timer = setInterval(() => {
        setLeftSec(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // onGameEnd(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [hasStarted]);

  // 게임 성공
  useEffect(() => {
    if (!hasStarted) return;
    if (score >= goal) onGameEnd(true);
  }, [score, goal, onGameEnd]);

  // 코어 데이터 생성
  useEffect(() => {
    const initialCores: Core[] = Array.from({ length: coreCount }, (_, i) => {
      const maxX = field.center[0] - field.size[0] / 2;
      const minX = field.center[0] + field.size[0] / 2;
      const maxY = 5;
      const minY = 0;
      const maxZ = field.center[1] - field.size[1] / 4;
      const minZ = field.center[1] + field.size[1] / 4;
    
      return {
        id: i,
        object: coreGltf.clone(),
        position: new Vector3(
          Math.floor(Math.random() * (maxX - minX) + minX),
          Math.floor(Math.random() * (maxY - minY) + minY),
          Math.floor(Math.random() * (maxZ - minZ) + minZ)
        ),
        leftClicks: Math.floor(Math.random() * (maxClicks - 1)),
        isTarget: false,
      }
    });
    coresRef.current = initialCores;
  }, []);

  return (
    <main className="w-full h-full">
      {/* 게임 */}
      <Scene>
        <GameScene
          scoreRef={scoreRef}
          coresRef={coresRef}
          playerRef={playerRef}
          setScore={setScore}
          field={field}
        />
      </Scene>

      <div className="w-96 h-96 absolute right-0 top-0">
        <Scene>
          <MiniMap
            coresRef={coresRef}
            playerRef={playerRef}
          />
        </Scene>
      </div>

      {/* 게임 인터페이스 */}
      {!hasStarted &&
        <FullScreenModal>
          <p>코어를 찾아서 부수세요.</p>
          <Button
            onClick={() => setHasStarted(true)}
            label="시작하기"
            worldKey={worldKey}
            autoFocus={true}
          />
        </FullScreenModal>
      }

      <Ui score={score} leftSec={leftSec} />
    </main>
  )
}