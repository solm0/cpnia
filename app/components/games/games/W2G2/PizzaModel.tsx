import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { Quaternion, Vector3 } from "three";

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

  return (
    <primitive
      object={scene}
      position={center}
      quaternion={quaternion}
      scale={scale}
    />
  )
}