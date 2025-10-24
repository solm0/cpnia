import Scene from "../../util/Scene";
import { RefObject, useEffect, useRef, useState } from "react";
import FullScreenModal from "../../util/FullScreenModal";
import Button from "../../util/Button";
import { Mesh, MeshStandardMaterial, Object3D, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import Player from "./W3G2/Player";
import { Physics } from "@react-three/rapier";
import { useGLTF } from "@react-three/drei";

export interface Core {
  object: Object3D;
  position: Vector3;
  leftClicks: number;
  isTarget: boolean;
}

export interface PlayerData {
  position: Vector3;
  rotation: Vector3;
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
  // map gltf 가져오기
  
  useFrame(() => {
    // isTarget이면 색
    coresRef.current.forEach((core) => {
      core.object.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mat = (child as Mesh).material as MeshStandardMaterial;
          if (core.isTarget) {
            mat.emissive.set(0x33ff66);
            mat.emissiveIntensity = 0.5;
          } else {
            mat.emissive.set(0x000000);
          }
        }
      });
    });
    // 플레이어와 코어들의 거리계산: playerRef.current.position과 coresRef[?].current.position 계산
    // 타겟 한개 선택해 coresRef.current[?].isTarget = true
    // 클릭 감지: useKeyboardControl, useGamepadControl
    // 클릭 시 coresRef.current.find((core) => core.isTarget === true).leftClicks --
    // 어떤 core의 leftClick가 0이 아니었는데 0이 되면? scoreRef.current += 1, setScore(scoreRef.current)
    // playerRef.current.position, rotation 업데이트(camera에 ref를 달아서 copy해야 하나? 좀이따 Player컴포넌트 뜯어보기)
  })
  return (
    <Physics>
      {/* 맵 */}

      {/* 코어 */}
      {coresRef.current.map((core, i) => (
        <primitive
          key={i}
          object={core.object}
          position={core.position}
        />
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
    rotation: new Vector3(0,0,0)
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
    const array = Array.from({length: coreCount}, (_, i) => i + 1);
    array.forEach(() => {
      const maxX = field.center[0] + field.size[0] / 2;
      const minX = field.center[0] - field.size[0] / 2;
      const maxY = 5;
      const minY = 0;
      const maxZ = field.center[1] + field.size[1] / 2;
      const minZ = field.center[1] - field.size[1] / 2;

      initialCores.push({
        object: coreGltf.clone(),
        position: new Vector3(
          Math.floor(Math.random() * (maxX - minX)),
          Math.floor(Math.random() * (maxY - minY)),
          Math.floor(Math.random() * (maxZ - minZ)),
        ),
        leftClicks: Math.floor(Math.random() * (maxClicks - 1)),
        isTarget: false,
      })
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