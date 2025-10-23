import { Suspense } from "react";
import SmallScene from "../../util/SmallScene";
import { Loader, OrbitControls, useGLTF } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

export default function CardModel({
  worldKey, isCompleted
}: {
  worldKey: string;
  isCompleted: boolean;
}) {
  const unknown = useGLTF('/models/citizenship/unknown.glb').scene.clone();
  const card = useGLTF(`/models/citizenship/${worldKey}.glb`);

  return (
    <Suspense fallback={<Loader />}>
      <SmallScene>
        <primitive
          object={isCompleted ? card : unknown}
          position={[0,0,0]}
          rotation={[degToRad(90), degToRad(30), degToRad(60)]}
        />
        <OrbitControls
          enableZoom={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </SmallScene>
    </Suspense>
  )
}