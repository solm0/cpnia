'use client'

import { useRouter } from "next/navigation";
import CitizenshipScreen from "./CitizenshipScreen";
import { useState } from "react";
import DefaultSuccess from "./DefaultSuccess";
import DefaultFail from "./DefaultFail";

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

  // 성공화면/실패화면이 있는것만 특정 화면을 렌더하도록 if문으로 처리한다. 나머지는 디폴트 화면이다. 다 props는 똑같다.
  // 이 페이지에서 if (gameKey === ... && worldKey === ...) { <W2G1Success worldKey={} ... /> } else <DefaultSuccess worldKey={} ... />
  // 해서 각자의 페이지에서 2D만 하든가 영상을 보여주든가 threejs를 하든가... 간단하게 뭔갈 하면 됨.

  if (showCitizenshipScreen) {
    return <CitizenshipScreen worldKey={worldKey} />
  } else if (success) {
    // 성공화면
    if (showCitizenship) {
      return (
        <DefaultSuccess
          worldKey={worldKey}
          gameKey={gameKey}
          nextFunction={{
            label: "시민권을 획득했습니다!",
            onClick: () => setShowCitizenshipScreen(true)
          }}
        />
      )
    } else {
      return (
        <DefaultSuccess
          worldKey={worldKey}
          gameKey={gameKey}
          nextFunction={{
            label: "돌아가기",
            onClick: () => {router.push(`/${worldKey}`)}
          }}
        />
      )
    }
  }
  return (
    // 실패화면
    <DefaultFail
      worldKey={worldKey}
      gameKey={gameKey}
      nextFunction={{
        label: "월드로 돌아가기",
        onClick: () => {router.push(`/${worldKey}`)}
      }}
    />
  )
}