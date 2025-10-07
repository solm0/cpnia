import { useRef } from "react";
import { Object3D } from "three";
import { useFrame } from "@react-three/fiber";
import ClonedModel from "../../util/ClonedModels";

export function FloatingIsland({
  src, scale, position, rotation, waitTime
}: {
  src: string;
  scale: number;
  position: [number, number, number];
  rotation: [number, number, number];
  waitTime: number;
}) {
  const ref = useRef<Object3D>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.position.y = position[1] + Math.sin(t * (waitTime+1)/2) * 6;
    }
  });

  return (
    <group ref={ref}>
      <ClonedModel
        src={src}
        scale={scale}
        position={position}
        rotation={rotation}
      />
    </group>
  )
}