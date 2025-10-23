import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils, Object3D } from "three";

export default function CardTurn({
  object, cardTurned,
}: {
  object: Object3D;
  cardTurned: boolean;
}) {
  const ref = useRef<Object3D>(null);
  const cardRotProg = useRef(0);

  useFrame(() => {
    if (!ref.current) return;
    if (cardTurned) {
      cardRotProg.current = Math.min(cardRotProg.current + 0.02, 1);
      ref.current.rotation.z = MathUtils.lerp(0, Math.PI, cardRotProg.current);
    }
  });

  return (
    <primitive
      ref={ref}
      object={object}
      position={[0,0,0]}
      rotation={[-Math.PI/2,Math.PI,0]}
      scale={0.1}
    />
  )
}