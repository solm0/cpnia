import { RefObject, useEffect, useRef, useState } from "react";
import { Core, Field, PlayerData } from "../W3G2";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";
import { AnimationClip, AnimationMixer, Color, LoopRepeat, Mesh, MeshStandardMaterial, Object3D, PointLight, Vector3 } from "three";
import { Physics } from "@react-three/rapier";
import Player from "./Player";
import { useFrame } from "@react-three/fiber";
import CoreLabel from "./CoreLabel";

export default function GameScene({
  scoreRef, coresRef, playerRef, setScore, field, avatar, coreAnim
}: {
  scoreRef: RefObject<number>;
  coresRef: RefObject<Core[]>;
  playerRef: RefObject<PlayerData>;
  setScore: (score: number) => void;
  field: Field;
  avatar: Object3D;
  coreAnim: AnimationClip[];
}) {
  const nearestCoreRef = useRef<Core | null>(null);
  const targetDistance = 8;
  
  const pressedKeys = useKeyboardControls();
  const gamepad = useGamepadControls();
  const lightRef = useRef<PointLight>(null);
  const isBreaking = useRef<boolean>(false);
  const mixers = useRef<AnimationMixer[]>([]);

  // map gltf 가져오기

  type CoreLabel = {
    id: number;
    position: Vector3;
    leftClicks: number;
    isVisible: boolean;
  }

  const [coreLabels, setCoreLabels] = useState<CoreLabel[]>([]);
  const color = new Color();

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
        isVisible: false,
      }))
    );
  }, []);

  useEffect(() => {
    // 애니메이션
    mixers.current = coresRef.current.map(core => {
      const m = new AnimationMixer(core.object);
      const clip = coreAnim[0];
      const action = m.clipAction(clip);
      
      action.clampWhenFinished = true;
      action.loop = LoopRepeat; // 기본은 반복
      action.play();

      return m;
    });
    return () => mixers.current.forEach(m => m.stopAllAction());
  }, [coreAnim])

  const clickProcessed = useRef(false);

  useFrame((_, delta) => {
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

    const maxClicks =
    coresRef.current?.reduce((max, c) => Math.max(max, c.leftClicks), 1) ?? 1;

    // --- 색상 변경 ---
    coresRef.current.forEach(core => {
      const isTarget = core.isTarget;
      if (!core.meshes) return;
      core.meshes.forEach((mesh: Mesh) => {
        const mat = mesh.material as MeshStandardMaterial;
        const ratio = Math.min(core.leftClicks / maxClicks, 1);
        const lerped = color
          .setHex(0xff3333)
          .lerp(new Color(0x33ff66), ratio)
          .getHex();
        mat.emissive.set(isTarget ? lerped : 0x000000);
        mat.emissiveIntensity = isTarget ? 0.4 : 0;
      });
    });

    // --- 클릭 감지 ---
    const isClicking = pressedKeys.current.has("Enter") || gamepad.current.buttons[0];
    if (isClicking && nearestCore && !clickProcessed.current) {
      isBreaking.current = true;
      if (nearestCore.leftClicks > 0) nearestCore.leftClicks -= 1;

      setCoreLabels(
        coresRef.current.map(core => ({
          id: core.id,
          position: core.position.clone(),
          leftClicks: core.leftClicks,
          isVisible: playerRef.current.position.distanceTo(core.position) < targetDistance,
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
      isBreaking.current = false;
    }

    // --- 빛 ---
    if (lightRef.current) {
      lightRef.current.position.set(
        playerRef.current.position.x,
        playerRef.current.position.y + 20,
        playerRef.current.position.z - 10
      )
    }

    // --- 코어 부서짐 애니메이션
    mixers.current.forEach(m => m.update(delta));
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
          scale={15}
        />
      ))}
      {coreLabels.map(label => (
        <CoreLabel key={label.id} label={label} />
      ))}

      {/* 플레이어 */}
      <Player
        playerRef={playerRef}
        field={field}
        isBreaking={isBreaking}
        avatar={avatar}
      />
      
      <pointLight 
        ref={lightRef}
        intensity={300}
        castShadow
      />

      {/* 바닥 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="gray" />
      </mesh>

      <color attach="background" args={["black"]} />

      <directionalLight intensity={0.1} />
    </Physics>
  )
}