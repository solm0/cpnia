import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useLoader } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import SmallScene from "../../util/SmallScene";
import { Loader, OrbitControls } from "@react-three/drei";
import { MathUtils } from "three";

export default function CardModel({
  worldKey, isCompleted
}: {
  worldKey: string;
  isCompleted: boolean;
}) {
  // worldKey에 따라 맞는 카드 src
  // isCompleted 이면 빈 카드 src

  const gltf = useLoader(GLTFLoader, '/models/citizenship-card.glb');
  const clonedScene = useMemo(() => clone(gltf.scene), [gltf.scene]);

  return (
    <div className="w-[23rem] h-[35rem]">
      <Suspense fallback={<Loader />}>
        <SmallScene>
          <ambientLight />
          <primitive
            object={clonedScene}
            position={[0,0,0]}
            rotation={[MathUtils.degToRad(90), MathUtils.degToRad(30), MathUtils.degToRad(60)]}
          />
          <OrbitControls
            enableZoom={false}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
          />
        </SmallScene>
      </Suspense>
    </div>
  )
}