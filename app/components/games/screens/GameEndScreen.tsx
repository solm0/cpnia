'use client'

import { useRouter } from "next/navigation";
import PlaceHolder from "../../util/PlaceHolder";
import CitizenshipScreen from "./CitizenshipScreen";
import Button from "../../util/Button";
import { useState } from "react";
import Scene from "../../util/Scene";
import { OrbitControls } from "@react-three/drei";

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

  // worldKey, gameKey, nextFunction을 보낸다.
  // 디폴트 성공(시민권O,X), 디폴트 실패 화면을 만든다.
  // 성공화면/실패화면이 있는것만 특정 화면을 렌더하도록 if문으로 처리한다. 나머지는 디폴트 화면이다. 다 props는 똑같다.
  // 이 페이지에서 if (gameKey === ... && worldKey === ...) { <W2G1Success worldKey={} ... /> } else <DefaultSuccess worldKey={} ... />
  // 해서 각자의 페이지에서 2D만 하든가 영상을 보여주든가 threejs를 하든가... 간단하게 뭔갈 하면 됨.

  if (showCitizenshipScreen) {
    return <CitizenshipScreen worldKey={worldKey} />
  } else if (success) {
    // 성공화면
    if (showCitizenship) {
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
            <Button
              onClick={() => setShowCitizenshipScreen(true)}
              label="시민권을 획득했습니다!"
            />
          </div>
        </main>
      )
    } else {
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
      <div className="absolute top-2/3 w-screen h-auto flex justify-center">
        <Button
          onClick={() => {router.push(`/${worldKey}`)}}
          label="월드로 돌아가기"
        />
      </div>
    </main>
  )
}