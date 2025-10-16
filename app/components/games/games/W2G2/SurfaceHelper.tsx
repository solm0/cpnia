import { useMemo } from "react";
import { CircleGeometry, DoubleSide, Mesh, MeshBasicMaterial, Quaternion, Vector3 } from "three";

export function SurfaceHelper({
  center, normal, radius, color = 'orange',
}: {
  center: Vector3,
  normal: Vector3,
  radius: number;
  color?: string;
}) {
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
    m.position.copy(center);
    m.quaternion.copy(quaternion);
    return m;
  }, [center, normal, radius, color]);

  return <primitive object={mesh} />
}