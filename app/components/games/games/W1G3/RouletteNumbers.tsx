import { Text } from "@react-three/drei";
import { Vector3 } from "three";

export default function RouletteNumbers({
  numWithAngle,
  center,
  distance,
}: {
  numWithAngle: { num: number, angle: number }[]
  center: Vector3;
  distance: number;
}) {
  return (
    <group
      rotation={[-Math.PI/2,0,0]}
      position={[
        center.x,
        center.y-2,
        center.z
      ]}
    >
      {numWithAngle.map(({ num, angle }) => {
        const rad = (angle * Math.PI) / 180;
        const x = center.x + distance * Math.cos(rad);
        const y = center.y + distance * Math.sin(rad);

        return (
          <Text
            key={num}
            position={[x, y, center.z]}
            rotation={[0, 0, rad - Math.PI/2]}
            fontSize={3.5}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            {num}
          </Text>
        );
      })}
    </group>
  )
}