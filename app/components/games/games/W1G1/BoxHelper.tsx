import { useMemo, useRef } from "react";
import { Mesh, MeshBasicMaterial, BoxGeometry, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

export function BoxHelper({
  width,
  depth,
  center,
  color = "orange",
}: {
  width: number;
  depth: number;
  center: Vector3;
  color?: string;
}) {
  const ref = useRef<Mesh>(null!);

  const mesh = useMemo(() => {
    const geometry = new BoxGeometry(width, 0, depth);
    const material = new MeshBasicMaterial({
      color,
      wireframe: true,
    });
    return new Mesh(geometry, material);
  }, [width, depth, color]);

  useFrame(() => {
    if (ref.current) {
      ref.current.position.copy(center);
    }
  });

  return <primitive ref={ref} object={mesh} />;
}