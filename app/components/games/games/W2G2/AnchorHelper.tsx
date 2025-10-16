import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { SphereGeometry, Mesh, MeshStandardMaterial, Vector3 } from "three";

export function AnchorHelper({
  leftAnchor,
  rightAnchor,
  color = "red",
  size = 0.5
}: {
  leftAnchor: [number, number, number],
  rightAnchor: [number, number, number],
  color?: string,
  size?: number
}) {
  // Helper function to create a mesh at a position
  const createSphere = (pos: [number, number, number]) => {
    const geometry = new SphereGeometry(size, 16, 16);
    const material = new MeshStandardMaterial({ color });
    const mesh = new Mesh(geometry, material);
    mesh.position.set(pos[0], pos[1], pos[2]);
    return mesh;
  }

  return (
    <>
      <primitive object={createSphere(leftAnchor)} />
      <primitive object={createSphere(rightAnchor)} />
    </>
  );
}

export function PosHelper({
  pos,
  color = "red",
  size = 0.5
}: {
  pos: Vector3,
  color?: string,
  size?: number
}) {
  const ref = useRef<Mesh>(null!);

  // Create mesh only once
  const sphere = useMemo(() => {
    const geometry = new SphereGeometry(size, 16, 16);
    const material = new MeshStandardMaterial({ color });
    const mesh = new Mesh(geometry, material);
    mesh.position.copy(pos);
    return mesh;
  }, [color, size]);

  // Update position every frame
  useFrame(() => {
    if (ref.current) {
      ref.current.position.copy(pos);
    }
  });

  return <primitive ref={ref} object={sphere} />;
}