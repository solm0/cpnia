import { useFrame } from "@react-three/fiber";
import { Group, Mesh, MeshStandardMaterial, SphereGeometry, Vector3 } from "three";
import { useRef, useEffect } from "react";

interface PoolObject {
  mesh: Mesh;
  target: Vector3;
}

export default function PoolManager({
  playerRef,
  count = 150,
  radius = 150,
}: {
  playerRef: { current: { position: Vector3 } };
  count?: number;
  radius?: number;
}) {
  const groupRef = useRef<Group>(null!);
  const objects = useRef<PoolObject[]>([]);
  const tmpVec = new Vector3();

  useEffect(() => {
    // 초기 생성
    const group = groupRef.current;
    for (let i = 0; i < count; i++) {
      const geo = new SphereGeometry(1, 8, 8);
      const mat = new MeshStandardMaterial({ color: "orange" });
      const mesh = new Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 300
      );
      group.add(mesh);
      objects.current.push({
        mesh,
        target: mesh.position.clone(), // 초기 목표 위치는 현재 위치
      });
    }
  }, []);

  // 매 프레임 업데이트
  useFrame((_, delta) => {
    const playerPos = playerRef.current.position;

    for (const obj of objects.current) {
      const dist = obj.mesh.position.distanceTo(playerPos);
      obj.mesh.visible = dist < radius;

      // lerp로 target까지 이동
      obj.mesh.position.lerp(obj.target, delta * 0.5);
    }

    // 5초마다 랜덤 target 갱신
    if (performance.now() % 5000 < 16) {
      for (const obj of objects.current) {
        obj.target.set(
          playerPos.x + (Math.random() - 0.5) * radius * 2,
          playerPos.y + (Math.random() - 0.5) * radius * 2,
          playerPos.z + (Math.random() - 0.5) * radius * 2
        );
      }
    }
  });

  return <group ref={groupRef} />;
}