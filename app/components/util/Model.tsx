import { useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export default function Model({
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

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [gltf]);

  return (
    <primitive
      object={gltf.scene}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  );
}