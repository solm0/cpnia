import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { Mesh, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

export default function ExplodingModel({ exploded }: { exploded: boolean }) {
  const { scene } = useGLTF("/models/entropy-2.glb");
  const meshes = useMemo(() => {
    const result: Mesh[] = [];
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) result.push(child as Mesh);
    });
    return result;
  }, [scene]);

  // 각 mesh의 원래 위치 저장
  const originalPositions = useMemo(
    () => meshes.map((m) => m.position.clone()),
    [meshes]
  );

  // 흩뿌릴 랜덤 방향 벡터
  const randomDirs = useMemo(
    () => meshes.map(() => new Vector3(
      (Math.random() - 0.5) * 5,
      Math.random() * 5,
      (Math.random() - 0.5) * 5
    )),
    [meshes]
  );

  useFrame((_, delta) => {
    meshes.forEach((mesh, i) => {
      const orig = originalPositions[i];
      const target = exploded
        ? orig.clone().add(randomDirs[i])
        : orig.clone();

      // 부드럽게 이동
      mesh.position.lerp(target, 2 * delta);
    });
  });

  return <primitive object={scene} scale={50} position={[0,0,0]} />;
}