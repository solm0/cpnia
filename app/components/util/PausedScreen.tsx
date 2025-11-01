import FullScreenModal from "./FullScreenModal";
import Button from "./Button";
import { useGameStore } from "@/app/lib/state/gameState";
import { useState } from "react";
import { worldPortals } from "@/app/lib/data/positions/worldPortals";
import { useRouter } from "next/navigation";
import { Pause } from "lucide-react";

export default function PausedScreen({
  worldKey, isInMap = false,
}: {
  worldKey: string;
  isInMap: boolean;
}) {
  const worldName = worldPortals.find(world => world.worldKey === worldKey)?.worldName
  const [isPaused, setIsPaused] = useState(false);
  const router= useRouter();
  const reset = useGameStore(state => state.reset);

  return (
    isPaused ? (
      <FullScreenModal>
        <div className="relative w-auto h-full flex flex-col items-center justify-center gap-2">
          {isInMap &&
            <Button
              label={`${worldName} 진행도 리셋하기`}
              onClick={reset}
              worldKey={worldKey}
              id={'tempId'}
            />
          }
          {isInMap ? (
            // 홈으로 가기
            <Button
              label={`${worldName} 나가기`}
              onClick={() => router.push('/')}
              worldKey={worldKey}
              id={'tempId'}
            />
          ): (
            // 맵으로 가기
            <Button
              label={`게임 중단`}
              onClick={() => router.push(`/${worldKey}`)}
              worldKey={worldKey}
              id={'tempId'}
            />
          )}
          <Button
            label='계속하기'
            onClick={() => setIsPaused(false)}
            worldKey={worldKey}
            id={'tempId'}
          />
        </div>
      </FullScreenModal>
    ) : (
      <div className="fixed right-8 top-8 flex flex-col gap-2 w-auto items-center hover:opacity-50 transition-opacity">
        <button
          onClick={() => setIsPaused(true)}
          className="pointer-events-auto"
          id={'tempId'}
        >
          <Pause className="w-7 h-7 text-white" />
        </button>
      </div>
    )
  )
}