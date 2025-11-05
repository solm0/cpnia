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
      <div className="w-[30rem] h-[40rem] z-10">
        <CardModel worldKey={worldKey} />
      </div>

      <div className="absolute w-[15rem] h-30 rotate-30 bg-black opacity-50 blur-xl top-120 rounded-full"></div>
      
      <div className="w-[30rem] h-auto flex flex-col gap-16 justify-center font-bold break-keep items-center">
        <div className="flex flex-col gap-4 items-center text-white">
          <p>{`${worldName} 사회에 성공적으로 동화되셨군요?`}</p>
          <p>{`당신도 이제 ${worldName}의 시민입니다.`}</p>
          <p>시민권을 발급해 드리겠습니다. 축하합니다.</p>
        </div>
        <Button
          onClick={() => router.push(`/`)}
          label="홈으로"
          id='5-1'
        />
      </div>
    </main>
  )
}