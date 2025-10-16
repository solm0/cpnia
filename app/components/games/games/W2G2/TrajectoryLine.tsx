import { RefObject, useState } from "react";
import { Line } from "@react-three/drei";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

export function TrajectoryLine({
  pullPos,
  restPos,
  gravity = new Vector3(0, -9.8, 0),
  speedFactor = 6,
  maxTime = 3,
  deltaT = 0.05,
  color = "limegreen",
}: {
  pullPos: RefObject<Vector3>;
  restPos: Vector3;
  gravity?: Vector3;
  speedFactor?: number;
  maxTime?: number;
  deltaT?: number;
  color?: string;
}) {
  const [points, setPoints] = useState<Vector3[]>([
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 0),
  ]);

  useFrame(() => {
    if (!pullPos.current) return;

    const start = pullPos.current.clone();
    const velocity = restPos.clone().sub(pullPos.current).multiplyScalar(speedFactor);
    const newPath: Vector3[] = [];

    for (let t = 0; t < maxTime; t += deltaT) {
      const pos = start
        .clone()
        .add(velocity.clone().multiplyScalar(t))
        .add(gravity.clone().multiplyScalar(0.5 * t * t));
      newPath.push(pos);
    }

    // Avoid unnecessary re-renders if unchanged length
    if (newPath.length > 1 && newPath.every(p => Number.isFinite(p.x))) {
      setPoints(newPath);
    }
  });

  return <Line points={points} color={color} lineWidth={1} />;
}