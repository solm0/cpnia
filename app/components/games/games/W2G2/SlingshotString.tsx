import { RefObject, useState } from "react";
import { Line } from "@react-three/drei";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

export function SlingshotString({
  leftAnchor,
  rightAnchor,
  pullPos
}: {
  leftAnchor: Vector3,
  rightAnchor: Vector3,
  pullPos: RefObject<Vector3>,
}) {
  const [points, setPoints] = useState<Vector3[]>([
    leftAnchor.clone(),
    pullPos.current?.clone() ?? leftAnchor.clone(),
    rightAnchor.clone(),
  ]);

  useFrame(() => {
    if (pullPos.current) {
      // create a new array every frame so Line sees it as a new reference
      setPoints([
        leftAnchor.clone(),
        new Vector3(
          pullPos.current.clone().x,
          pullPos.current.clone().y + 1,
          pullPos.current.clone().z
        ),
        rightAnchor.clone()
      ]);
    }
  });

  return <Line points={points} color="brown" lineWidth={2} />;
}