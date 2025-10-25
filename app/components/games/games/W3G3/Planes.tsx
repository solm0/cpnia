// RandomRectangles.tsx
import { useMemo } from "react";

type RandomRectanglesProps = {
  count?: number;
  spread?: number; // how far positions can go, e.g., 5 => -5 ~ 5
  size?: [number, number]; // width & depth range, e.g., [0.5, 3]
  y?: number; // fixed Y position
};

export default function Planes({
  count = 20,
  spread = 500,
  size = [0.5, 1000],
  y = 0,
}: RandomRectanglesProps) {
  // precompute rectangles
  const rectangles = useMemo(() => {
    return Array.from({ length: count }, () => {
      const w = size[0] + Math.random() * (size[1] - size[0]);
      const d = size[0] + Math.random() * (size[1] - size[0]);
      const x = Math.random() * spread * 2 - spread;
      const z = Math.random() * spread * 2 - spread;
      const rotY = Math.random() > 0.5 ? 0 : Math.PI / 2; // 0 or 90°

      return { w, d, x, z, rotY };
    });
  }, [count, spread, size]);

  return (
    <>
      {rectangles.map((rect, i) => (
        <mesh
          key={i}
          position={[rect.x, y, rect.z]}
          rotation={[0, rect.rotY, 0]}
        >
          <planeGeometry args={[rect.w, rect.d]} />
          <meshStandardMaterial color="orange" opacity={0.1} transparent={true} />
        </mesh>
      ))}
    </>
  );
}