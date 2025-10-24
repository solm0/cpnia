import { RefObject, useState } from "react";
import { Line } from "@react-three/drei";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { PlayerData } from "../W3G2";

export function LineHelper({
  middlePos, playerRef,
}: {
  middlePos: Vector3;
  playerRef: RefObject<PlayerData>;
}) {
  const radius = 10;
  const [points, setPoints] = useState<Vector3[]>([
    middlePos,
    new Vector3(0,0, radius),
  ]);

  useFrame(() => {
    if (!playerRef.current) return;

    const playerDir = new Vector3(0, 0, -1).applyQuaternion(playerRef.current.rotation)

    const posOnEdge = middlePos.clone().add(
      playerDir.clone().setY(0).normalize().multiplyScalar(radius)
    );

    setPoints([middlePos.clone(), posOnEdge]);
  });

  return <Line points={points} color="brown" lineWidth={2} />;
}