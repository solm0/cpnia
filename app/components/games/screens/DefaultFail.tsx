'use client'

import Scene from "../../util/Scene"
import PlaceHolder from "../../util/PlaceHolder"
import { OrbitControls } from "@react-three/drei"
import Button from "../../util/Button"
import { useRouter, useSearchParams } from "next/navigation";
import TimeFail from "./Timefail";
import { useGameEndStore } from "@/app/lib/state/gameEndState"

export default function DefaultFail() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const [worldKey, gameKey] = searchParam.get('from')?.split('-') ?? [];
  const setGameEnded = useGameEndStore(state => state.setGameEnded);

  if (worldKey === 'time') {
    return <TimeFail gameKey={gameKey} />
  } else {
    return (
      <main className="w-full h-full bg-sky-900">
        <Scene>
          <PlaceHolder
            scale={1}
            position={[0, 3, 0]}
            rotation={[0, 0, 0]}
            label={`${worldKey} ${gameKey} 실패! 아직 멀었다네 이방인이여...`}
          />
          <OrbitControls minDistance={30} maxDistance={100} />
        </Scene>
        <div className="absolute top-2/3 w-screen h-auto flex flex-col justify-center gap-4">
          <Button
            onClick={() => {
              router.push(`/${worldKey}?game=${gameKey}`);
              setGameEnded(false);
            }}
            label='다시 하기'
            id={'tempId'}
          />
          <Button
            onClick={() => {
              router.push(`/${worldKey}`);
              setGameEnded(false);
            }}
            label="월드로 돌아가기"
            id={'tempId'}
          />
        </div>
      </main>
    )
  }
}