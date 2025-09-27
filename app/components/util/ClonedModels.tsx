import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { useMemo } from "react";

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
  const clonedScene = useMemo(() => clone(gltf.scene), [gltf.scene])

  return (
    <primitive
      object={clonedScene}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  )
}