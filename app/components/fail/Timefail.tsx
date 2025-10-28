'use client'

import { Html, useGLTF } from "@react-three/drei";
import Scene from "../util/Scene";
import { EffectComposer, Vignette } from "@react-three/postprocessing";
import Button from "../util/Button";
import { useRouter } from "next/navigation";

export default function TimeFail({
  gameKey,
}: {
  gameKey: string;
}) {
  const gandalf = useGLTF('/models/avatars/gandalf.gltf').scene;
  const router = useRouter();
  const worldKey = 'time'

  return (
    <main className="w-full h-full">
      <Scene>
        <primitive
          object={gandalf}
          position={[0,0,0]}
          scale={2}
        />
        <Html className="w-96 left-1/2 -translate-x-1/2 mt-20 flex flex-col gap-4 items-center break-keep">
          <div>시간을 다 잃었구만. 불쌍한 것. 내 시간을 좀 나눠주겠네. 다음번엔 조심하게.</div>
          <Button
            worldKey={worldKey}
            autoFocus={true}
            label="다시 하기"
            onClick={() => router.push(`/${worldKey}?game=${gameKey}`)}
          />
          <Button
            worldKey={worldKey}
            label="월드로 돌아가기"
            onClick={() => router.push(`/${worldKey}`)}
          />
        </Html>

        <directionalLight intensity={10} />
        <color attach="background" args={["yellow"]} />
        <EffectComposer>
          <Vignette eskil={false} offset={0.1} darkness={1} />
        </EffectComposer>
      </Scene>
    </main>
  )
}