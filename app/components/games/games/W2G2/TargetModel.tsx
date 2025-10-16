import { useMemo } from "react";
import { CircleGeometry, DoubleSide, Mesh, MeshStandardMaterial, Quaternion, Vector3 } from "three";

export function TargetModel({
  center, normal, radius,
  opacity = 0.5,
  color = 'green',
}: {
  center: Vector3,
  normal: Vector3,
  radius: number;
  opacity?: number;
  color?: string;
}) {
  const mesh = useMemo(() => {
    const geometry = new CircleGeometry(radius, 64);
    const material = new MeshStandardMaterial({
      color,
      transparent: true,
      opacity,
      side: DoubleSide,
    });

    const m = new Mesh(geometry, material);
    const quaternion = new Quaternion().setFromUnitVectors(
      new Vector3(0, 0, 1),
      normal
    );
    m.position.copy(center);
    m.quaternion.copy(quaternion);
    return m;
  }, [center, normal, radius, color, opacity]);

  return <primitive object={mesh} />;
}