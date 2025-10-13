import { useGLTF } from "@react-three/drei"

export const useAnimGltf = () => [
  useGLTF('/models/animations/idle.glb'),
  useGLTF('/models/animations/walk.glb'),
  useGLTF('/models/animations/jump.glb'),
  useGLTF('/models/animations/arm.glb'),
];