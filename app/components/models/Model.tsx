import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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

  return (
    <primitive
      object={gltf.scene}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  )
}