import Scene from "../../util/Scene";
import { RefObject, useEffect, useRef, useState } from "react";
import FullScreenModal from "../../util/FullScreenModal";
import Button from "../../util/Button";
import { BufferAttribute, Color, Line, Mesh, Object3D, Quaternion, Sprite, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import GameScene from "./W3G2/GameScene";
import Ui from "./W3G2/Ui";
import MiniMap from "./W3G2/MiniMap";

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

export default function W3G2({
  worldKey, gameKey, onGameEnd
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
}) {
  const sec = 90;
  const initialPlayer = {
    position: new Vector3(0,0,0),
    rotation: new Quaternion()
  }
  const field: Field = {
    center: [0, 0],
    size: [1000, 1000]
  }
  const goal = 5;
  const coreCount = 10;
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
      const maxY = 10;
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

      <div className="w-96 h-96 absolute right-0 top-0 flex items-center justify-center rounded-full overflow-hidden">
        <div className="absolute bg-black rounded-full w-full h-full border-[1px] border-white"/>
        <div className="absolute bg-white rounded-full w-3 h-3"/>
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