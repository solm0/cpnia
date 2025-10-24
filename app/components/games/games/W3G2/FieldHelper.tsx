import { Box } from "@react-three/drei";
import { Field } from "../W3G2";

export function FieldHelper({ field }: { field: Field }) {
  const [cx, cz] = field.center;
  const [w, d] = field.size ?? [0, 0];

  return (
    <Box
      args={[w, 0.1, d]} // width, height, depth
      position={[cx, 0.05, cz]}
    >
      <meshBasicMaterial color="red" wireframe transparent opacity={0.5} />
    </Box>
  );
}