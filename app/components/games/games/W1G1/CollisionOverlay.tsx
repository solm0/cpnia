import { useFrame } from "@react-three/fiber";
import { RefObject, useRef } from "react";
import { MathUtils, Mesh, MeshBasicMaterial } from "three";
import { PlayerData } from "../W3G2";

export default function CollisionOverlay({
  isColliding, playerRef
}: {
  isColliding: RefObject<boolean>;
  playerRef: RefObject<PlayerData>;
}) {
  const mesh = useRef<Mesh>(null);
  const filterProg = useRef(0);

  useFrame(() => {
    if (!mesh.current) return;
    mesh.current.position.copy(playerRef.current.position);
    const material = mesh.current.material as MeshBasicMaterial;

    if (isColliding.current) {
      console.log(filterProg.current)
      filterProg.current += 0.01;
      material.opacity = MathUtils.lerp(0.2, 0.0, Math.min(filterProg.current, 1));
      if (filterProg.current >= 1) {
        filterProg.current = 0;
        isColliding.current = false;
      }
    }
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial color="red" transparent opacity={0.2} />
    </mesh>
  );
}