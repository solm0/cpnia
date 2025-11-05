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
  const card = useGLTF(`/models/citizenship/${worldKey}.gltf`).scene;

  return (
    <Suspense fallback={<Loader />}>
      <SmallScene>
        <primitive
          object={card}
          position={[0,0,0]}
          rotation={[degToRad(-10), degToRad(-30), degToRad(70)]}
          scale={20}
        />
        <OrbitControls
          enableZoom={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
        {isCompleted && <>
          <directionalLight intensity={3} position={[-10, 30, 10]} />
          <directionalLight intensity={3} position={[-10, 30, -30]} />
        </>}
      </SmallScene>
    </Suspense>
  )
}