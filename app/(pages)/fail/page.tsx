'use client'

import TimeFail from "@/app/components/fail/TimeFail";
import DefaultFail from "@/app/components/fail/DefaultFail";
import { useRouter, useSearchParams } from "next/navigation";

export default function FailPage() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const [worldKey, gameKey] = searchParam.get('from')?.split('-') ?? [];

  if (worldKey === 'time') {
    return <TimeFail gameKey={gameKey} />
  } else {
    return (
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
}