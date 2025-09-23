'use client'

import { useRouter } from "next/navigation";
import PlaceHolder from "../../util/PlaceHolder";
import CitizenshipScreen from "./CitizenshipScreen";
import Button from "../../util/Button";
import { useState } from "react";
import Scene from "../../util/Scene";

export default function GameEndScreen({
  success, worldKey, gameKey, showCitizenship
}: {
  success: boolean;
  worldKey: string;
  gameKey: string;
  showCitizenship: boolean;
}) {
  const router = useRouter();
  const [showCitizenshipScreen, setShowCitizenshipScreen] = useState(false);

  if (showCitizenshipScreen) {
    return <CitizenshipScreen worldKey={worldKey} />
  } else if (success) {
    // 성공화면
    if (showCitizenship) {
      return (
        <main className="w-full h-full">
          <Scene>
            <PlaceHolder
              scale={1}
              position={[0, 3, 0]}
              rotation={[0, 0, 0]}
              label={`${gameKey} 성공!`}
            />
          </Scene>
          <div className="absolute top-2/3 w-screen h-auto flex justify-center">
            <Button
              onClick={() => setShowCitizenshipScreen(true)}
              label="시민권을 획득했습니다!"
            />
          </div>
        </main>
      )
    } else {
      return (
        <main className="w-full h-full">
          <Scene>
            <PlaceHolder
              scale={1}
              position={[0, 3, 0]}
              rotation={[0, 0, 0]}
              label={`${gameKey} 성공!`}
            />
          </Scene>
          <div className="absolute top-2/3 w-screen h-auto flex justify-center">
            <Button
              onClick={() => {router.push(`/${worldKey}`)}}
              label="월드로 돌아가기"
            />
          </div>
        </main>
      )
    }
  }
  return (
    // 실패화면
    <main className="w-full h-full">
      <Scene>
        <PlaceHolder
          scale={1}
          position={[0, 3, 0]}
          rotation={[0, 0, 0]}
          label={`${gameKey} 실패! 아직 멀었다네 이방인이여...`}
        />
      </Scene>
      <div className="absolute top-2/3 w-screen h-auto flex justify-center">
        <Button
          onClick={() => {router.push(`/${worldKey}`)}}
          label="월드로 돌아가기"
        />
      </div>
    </main>
  )
}