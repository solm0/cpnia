import { RigidBody } from "@react-three/rapier";
import { degToRad } from "three/src/math/MathUtils.js";
import Model from "../../util/Model";
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

useGLTF.preload("/models/pachinko-big.glb");
useGLTF.preload("/models/pachinko-small.glb");

export default function PachinkoCircle({
  center = [0, 0, 0],
  count = 6,
  distance = 3,
  scale = 1,
  initialRotation = [0, degToRad(25), 0], // X, Y, Z rotation of the whole circle
}: {
  center?: [number, number, number];
  count?: number;
  distance?: number;
  scale?: number;
  initialRotation?: [number, number, number];
}) {
  const bigPachinko = useGLTF("/models/pachinko-big.glb").scene;
  const smallPachinkoScene = useGLTF("/models/pachinko-small.glb").scene;
  const smallPachinkos = useMemo(() => {
    return Array.from({ length: count+1 }, () => clone(smallPachinkoScene))
  }, [smallPachinkoScene, count])

  const items = [
    {
      position: [0, 13, 0] as [number, number, number],
      rotation: [0, degToRad(100), 0] as [number, number, number],
      scale: scale * 1.5,
    },
    ...Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      return {
        position: [x, 0, z] as [number, number, number],
        rotation: [0, -angle - 1.5, 0] as [number, number, number],
        scale: scale,
      };
    }),
  ];

  return (
    <group position={center} rotation={initialRotation}>
      {items.map((item, i) => (
        <RigidBody
          key={i}
          type="fixed"
          position={item.position}
          rotation={item.rotation}
          colliders="cuboid"
        >
          <Model
            scene={i === 0 ? bigPachinko : smallPachinkos[i]}
            scale={item.scale}
          />
        </RigidBody>
      ))}
    </group>
  );
}