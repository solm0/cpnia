import { Text } from "@react-three/drei";

export default function Label({
  text = "no label",
  position = [0,0,0],
}: {
  text: string | null;
  position?: [number, number, number]
}) {
  return (
    <Text
      fontSize={0.4}
      color="black"
      anchorX="center"
      anchorY="middle"
      position={position}
    >
      {text}
    </Text>
  );
}