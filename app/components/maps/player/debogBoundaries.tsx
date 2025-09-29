import { Circle, Box } from "@react-three/drei";
import { Boundary } from "@/app/components/maps/player/clampToBoundary";

export function DebugBoundaries({ boundaries }: { boundaries: Boundary[] }) {
  return (
    <group>
      {boundaries.map((b, i) => {
        if (b.type === "rect") {
          const [cx, cz] = b.center;
          const [w, d] = b.size ?? [0, 0];
          return (
            <Box
              key={i}
              args={[w, 0.1, d]} // width, height, depth
              position={[cx, 0.05, cz]}
            >
              <meshBasicMaterial color="red" wireframe transparent opacity={0.5} />
            </Box>
          );
        }

        if (b.type === "circle") {
          const [cx, cz] = b.center;
          return (
            <Circle
              key={i}
              args={[b.radius ?? 1, 64]} // radius, segments
              rotation={[-Math.PI / 2, 0, 0]} // flat on ground
              position={[cx, 0.05, cz]}
            >
              <meshBasicMaterial color="blue" wireframe transparent opacity={0.5} />
            </Circle>
          );
        }

        return null;
      })}
    </group>
  );
}