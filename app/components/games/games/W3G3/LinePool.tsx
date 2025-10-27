import { useRef, useEffect, useState } from "react";
import { Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { Billboard, Html, Text } from "@react-three/drei";

interface LineObject {
  group: Group;
  text: string;
}

export default function LinePool({
  playerRef,
  lines,
  maxCount = 100,
  spawnInterval = 0.5, // 초 단위 (기본 1초마다 생성)
  lineStyle
}: {
  playerRef: { current: { position: Vector3 } };
  lines: string[];
  maxCount?: number;
  spawnInterval?: number;
  lineStyle: string;
}) {
  const [, setVersion] = useState(0); // local state to trigger rerender

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current !== null) {
        setVersion(v => v + 1); // force rerender when ref is set
      }
    }, 16); // 60fps
    return () => clearInterval(interval);
  }, []);

  const groupRef = useRef<Group>(null!);
  const objects = useRef<LineObject[]>([]);
  const timeAccumulator = useRef(0);

  useEffect(() => {
    objects.current = []; // reset when remounted
  }, []);

  useFrame((_, delta) => {
    if (!playerRef.current) return;
    timeAccumulator.current += delta;

    // 일정 시간마다 새로운 텍스트 생성
    if (timeAccumulator.current >= spawnInterval) {
      timeAccumulator.current = 0;

      const playerPos = playerRef.current.position.clone();
      const newGroup = new Group();

      // 플레이어 주변 랜덤 위치
      newGroup.position.set(
        playerPos.x + (Math.random() - 0.5) * 30,
        playerPos.y + (Math.random() - 0.5) * 30,
        playerPos.z + (Math.random() - 0.5) * 30
      );

      const newText = lines[Math.floor(Math.random() * lines.length)];

      groupRef.current.add(newGroup);
      objects.current.push({ group: newGroup, text: newText });

      // 너무 많아지면 오래된 것부터 제거
      if (objects.current.length > maxCount) {
        const old = objects.current.shift();
        if (old) groupRef.current.remove(old.group);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {objects.current.map((obj, i) => (
        <primitive object={obj.group} key={i}>
          <Billboard>
            <Html className={`${lineStyle} break-keep text-center truncate w-auto h-auto`}>
              {obj.text}
            </Html>
          </Billboard>
        </primitive>
      ))}
    </group>
  );
}