'use client'

import Scene from "../../util/Scene"
import PlaceHolder from "../../util/PlaceHolder"
import { OrbitControls } from "@react-three/drei"
import Button from "../../util/Button"
import { useRouter, useSearchParams } from "next/navigation";

export default function DefaultSuccess() {
  const searchParam = useSearchParams();
  const [worldKey, gameKey] = searchParam.get('from')?.split('-') ?? [];
  const showCitizenship = searchParam.get('citizenship');
  const router = useRouter();

  return (
    <main className="w-full h-full bg-sky-900">
      <Scene>
        <PlaceHolder
          scale={1}
          position={[0, 3, 0]}
          rotation={[0, 0, 0]}
          label={`${worldKey} ${gameKey} 성공!`}
        />
        <OrbitControls minDistance={30} maxDistance={100} />
      </Scene>
      <div className="absolute top-2/3 w-screen h-auto flex justify-center">
        {showCitizenship && showCitizenship === 'true' ? (
          <Button
            onClick={() => router.push(`/citizenship?world=${worldKey}`)}
            label="새로운 시민권을 획득했습니다!"
            autoFocus={true}
          />
        ): (
          <Button
            onClick={() => router.push(`/${worldKey}`)}
            label="월드로 돌아가기"
          />
        )}
      </div>
    </main>
  )
}