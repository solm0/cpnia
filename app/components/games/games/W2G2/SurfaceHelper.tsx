import { useMemo, useRef } from "react";
import { CircleGeometry, DoubleSide, Mesh, MeshBasicMaterial, Quaternion, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

export function SurfaceHelper({
  center, normal, radius, color = 'orange',
}: {
  center: Vector3,
  normal: Vector3,
  radius: number;
  color?: string;
}) {
  const ref = useRef<Mesh>(null!);

  // create mesh once
  const mesh = useMemo(() => {
    const geometry = new CircleGeometry(radius, 64);
    const material = new MeshBasicMaterial({
      color,
      wireframe: true,
      side: DoubleSide,
    });

    const quaternion = new Quaternion().setFromUnitVectors(
      new Vector3(0, 0, 1),
      normal
    );

    const m = new Mesh(geometry, material);
    m.quaternion.copy(quaternion);
    return m;
  }, [normal, radius, color]);

  // update position each frame
  useFrame(() => {
    if (ref.current) {
      ref.current.position.copy(center);
    }
  });

  return <primitive ref={ref} object={mesh} />;
}