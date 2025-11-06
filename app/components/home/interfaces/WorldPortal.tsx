import { useGLTF } from "@react-three/drei";
import { Group, Vector3 } from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import Model from "../../util/Model";

export default function WorldPortal({
  src,
  worldKey,
  position,
  rotation,
  scale,
  rotationAxis,
  rotationSpeed,
  onFocus,
  setFocusedWorld,
  id,
}: {
  src: string;
  worldKey: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  rotationAxis: [number, number, number];
  rotationSpeed: number;
  onFocus: (num: number, isMove: boolean) => void;
  setFocusedWorld: (focusedWorld: string) => void;
  id: number;
}) {
  const ref = useRef<Group | null>(null);
  const { scene } = useGLTF(src);

  // 💎 독립된 복제본을 useMemo로 만들어둔다.
  const clonedScene = useMemo(() => clone(scene), [scene]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotateOnAxis(new Vector3(...rotationAxis), rotationSpeed * delta);
  });

  return (
    <group
      scale={1}
      ref={ref}
      position={position}
      rotation={rotation}
      onClick={() => {
        onFocus?.(id, false);
        setFocusedWorld(worldKey);
      }}
    >
      <Model scene={clonedScene} scale={scale} />
    </group>
  );
}