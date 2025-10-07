import { RigidBody } from "@react-three/rapier";
import ClonedModel from "../../util/ClonedModels";
import { degToRad } from "three/src/math/MathUtils.js";

export default function PachinkoCircle({
  center = [0, 0, 0],
  count = 6,
  distance = 3,
  scale = 1.2,
  initialRotation = [0, degToRad(25), 0], // X, Y, Z rotation of the whole circle
}: {
  center?: [number, number, number];
  count?: number;
  distance?: number;
  scale?: number;
  initialRotation?: [number, number, number];
}) {
  const items = [
    {
      position: [0, 13, 0] as [number, number, number],
      rotation: [0, degToRad(120), 0] as [number, number, number],
      scale: scale * 1.7,
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
          <ClonedModel src="/models/pachinko.glb" scale={item.scale} />
        </RigidBody>
      ))}
    </group>
  );
}