import { Suspense } from "react";
import SmallScene from "../../util/SmallScene";
import { Loader, OrbitControls, useGLTF } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

export default function CardModel({
  worldKey, isCompleted = true,
}: {
  worldKey: string | null;
  isCompleted?: boolean;
}) {
  const card = useGLTF(`/models/citizenship/${worldKey}.glb`).scene;

  return (
    <Suspense fallback={<Loader />}>
      <SmallScene>
        <primitive
          object={card}
          position={[0,0,0]}
          rotation={[degToRad(90), degToRad(30), degToRad(60)]}
        />
        <OrbitControls
          enableZoom={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
        {isCompleted && <>
          <directionalLight intensity={3} position={[0, 50, 0]} />
          <directionalLight intensity={3} position={[0, 10, -10]} />
        </>}
      </SmallScene>
    </Suspense>
  )
}