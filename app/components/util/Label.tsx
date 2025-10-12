import { Text } from "@react-three/drei";

export default function Label({
  text = "no label",
  position = [0,0,0],
  rotation = [0,0,0],
  color = 'black',
}: {
  text: string | null;
  position?: [number, number, number];
  rotation?:  [number, number, number];
  color?: string
}) {
  return (
    <Text
      fontSize={0.4}
      color={color}
      anchorX="center"
      anchorY="middle"
      position={position}
      rotation={rotation}
    >
      {text}
    </Text>
  );
}