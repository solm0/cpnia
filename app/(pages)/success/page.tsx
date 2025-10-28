'use client'

import DefaultSuccess from "@/app/components/games/screens/DefaultSuccess";
import { useRouter, useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const [worldKey, gameKey] = searchParam.get('from')?.split('-') ?? [];
  const showCitizenship = searchParam.get('citizenship');

  if (showCitizenship && showCitizenship === 'true') {
    return (
      <DefaultSuccess
        worldKey={worldKey}
        gameKey={gameKey}
        nextFunction={{
          label: "새로운 시민권을 획득했습니다!",
          onClick: () => router.push(`/citizenship?world=${worldKey}`)
        }}
      />
    )
  } else {
    return (
      <DefaultSuccess
        worldKey={worldKey}
        gameKey={gameKey}
        nextFunction={{
          label: "월드로 돌아가기",
          onClick: () => {router.push(`/${worldKey}`)}
        }}
      />
    )
  }
}