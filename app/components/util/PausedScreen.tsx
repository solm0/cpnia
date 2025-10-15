import FullScreenModal from "./FullScreenModal";
import Button from "./Button";
import { useGameStore } from "@/app/lib/state/gameState";

import { useEffect, useState } from "react";
import { worldPortals } from "@/app/lib/data/positions/worldPortals";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";
import { useRouter } from "next/navigation";

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

  const pressedKeys = useKeyboardControls();
  const gamepad = useGamepadControls();

  // 일시정지
  useEffect(() => {
    function checkPause() {
      if (pressedKeys.current.has("KeyQ") || (gamepad?.current?.buttons[9])) {
        setIsPaused(true);
      }
    }
  
    const interval = setInterval(checkPause, 50); // check every 50ms
    return () => clearInterval(interval);
  }, [pressedKeys, gamepad]);

  return (
    isPaused ?
      <FullScreenModal>
        <div className="relative w-auto h-full flex flex-col items-center justify-center gap-2">
          {isInMap &&
            <Button
              label={`${worldName} 진행도 리셋하기`}
              onClick={reset}
              worldKey={worldKey}
            />
          }
          {isInMap ? (
            // 홈으로 가기
            <Button
              label={`${worldName} 나가기`}
              onClick={() => router.push('/')}
              worldKey={worldKey}
            />
          ): (
            // 맵으로 가기
            <Button
              label={`게임 중단`}
              onClick={() => router.push(`/${worldKey}`)}
              worldKey={worldKey}
            />
          )}
          <Button
            label='계속하기'
            onClick={() => setIsPaused(false)}
            worldKey={worldKey}
          />
        </div>
      </FullScreenModal>
    : null
  )
}