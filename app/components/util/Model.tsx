import { useEffect } from "react";
import { Mesh, Object3D } from "three";

export default function Model({
  scene,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0]
}: {
  scene: Object3D;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <primitive
      object={scene}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  );
}