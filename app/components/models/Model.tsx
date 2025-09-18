import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Model({
  src
}: {
  src: string;
}) {
  const gltf = useLoader(GLTFLoader, src);

  return (
    <primitive
      object={gltf.scene}
      scale={1}
      position={[0, 3, 0]}
      rotation={[0, 0, 0]}
    />
  )
}