import { useMemo, useRef } from "react";
import { Object3D } from "three";
import { useFrame } from "@react-three/fiber";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import Model from "../../util/Model";

export function FloatingIsland({
  scene, scale, position, waitTime
}: {
  scene: Object3D;
  scale: number;
  position: [number, number, number];
  waitTime: number;
}) {
  const ref = useRef<Object3D>(null);
  const clonedScene = useMemo(() => clone(scene), [scene]);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.position.y = position[1] + Math.sin(t * (waitTime+1)/2) * 6;
    }
  });

  return (
    <group ref={ref}>
      <Model
        scene={clonedScene}
        scale={scale}
        position={position}
      />
    </group>
  )
}