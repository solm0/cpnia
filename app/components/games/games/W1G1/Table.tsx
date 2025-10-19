import { RefObject, useEffect } from "react";
import { gameRefProp } from "../W1G1";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export default function Table({
  hasPicked, gameRef, turn, currentNum
}: {
  hasPicked: boolean;
  gameRef: RefObject<gameRefProp[]>;
  turn: RefObject<number>;
  currentNum: RefObject<number | null>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0,5,10);
    camera.rotation.set(0,0,0);
    camera.lookAt(0, 5, 0);
  }, [camera]);

  const center = [-5,0,0] // ui를 위해 -x로 좀더 감

  return (
    <>
      
      {/* npc */}

      {/* 테이블 */}

      {/* ?? */}
      
      {/* Pick에서 setHasPicked */}
      <OrbitControls />
    </>
  )
}