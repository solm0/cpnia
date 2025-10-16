import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Mesh, Object3D, Quaternion, Vector3 } from "three";

export function PizzaModel({
  center, normal, scale = 1,
}: {
  center: Vector3,
  normal: Vector3,
  scale?: number;
}) {
  const { scene } = useGLTF("/models/pizza.gltf");

  const quaternion = useMemo(
    () =>
      new Quaternion().setFromUnitVectors(
        new Vector3(0, 1, 0),
        normal
      ),
    [normal]
  );

  const ref = useRef<Object3D>(scene);

  useFrame(() => {
    ref.current.position.copy(center); // <- update position every frame
  });

  scene.traverse((child) => {
    if ((child as Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  })

  return (
    <primitive
      object={scene}
      position={center}
      quaternion={quaternion}
      scale={scale}
    />
  )
}