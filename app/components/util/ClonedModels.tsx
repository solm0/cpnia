import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { useMemo, useEffect } from "react";
import { Mesh } from "three";

export default function ClonedModel({
  src,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0]
}: {
  src: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const gltf = useLoader(GLTFLoader, src);
  const clonedScene = useMemo(() => clone(gltf.scene), [gltf.scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  return (
    <primitive
      object={clonedScene}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  );
}