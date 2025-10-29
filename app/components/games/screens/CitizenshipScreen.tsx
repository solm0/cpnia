'use client'

import Button from "../../util/Button";
import { useRouter, useSearchParams } from "next/navigation";
import CardModel from "../../home/interfaces/CardModel";
import { worldPortals } from "@/app/lib/data/positions/worldPortals";

export default function CitizenshipScreen() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const worldKey = searchParam.get('world');
  const worldName = worldPortals.find(world => world.worldKey === worldKey)?.worldName;

  return (
    <main className="w-full h-full bg-sky-900 flex flex-col items-center">
      <div className="w-[23rem] h-[35rem]">
        <CardModel worldKey={worldKey} />
      </div>
      
      <div className="w-[30rem] h-96 flex flex-col gap-8 justify-center font-bold break-keep">
        <p>{`${worldName} 사회에 성공적으로 동화되셨군요? 당신도 이제 ${worldName}의 시민입니다. 시민권을 발급해 드리겠습니다. 축하합니다.`}</p>
        <Button
          onClick={() => router.push(`/`)}
          label="홈으로"
        />
      </div>
    </main>
  )
}