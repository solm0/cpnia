import { degToRad } from "three/src/math/MathUtils.js";
import { Text } from "@react-three/drei";

export default function RouletteNumbers({
  center = [0, 0, 0],
  distance = 3,
  scale = 1,
  initialRotation = [0, degToRad(25), 0],
}: {
  center?: [number, number, number];
  distance?: number;
  scale?: number;
  initialRotation?: [number, number, number];
}) {
  const items = [
    ...Array.from({ length: 20 }).map((_, i) => {
      const angle = (i / 20) * Math.PI * 2;
      const x = Math.cos(angle) * distance;
      
      const z = Math.sin(angle) * distance;
      return {
        position: [x, 15, z] as [number, number, number],
        rotation: [0, -angle - 1.5, 0] as [number, number, number],
      };
    }),
  ];

  return (
    <group position={center} rotation={initialRotation}>
      {items.map((item, i) => (
        <Text
          key={i}
          position={item.position}
          rotation={item.rotation}
          scale={scale}
          fontSize={1}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/casino.ttf"
        >
          {i+1}
        </Text>
      ))}
    </group>
  );
}