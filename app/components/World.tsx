'use client'

import { useSearchParams } from "next/navigation";
import MiniGame from "./games/MiniGame";
import WorldHome from "./maps/WorldHome";

export default function World({
  worldId
}: {
  worldId: string;
}) {
  const searchParam = useSearchParams();
  const miniGame = searchParam.get('game');

  return (
    <main className="w-full h-full">
      {miniGame ? (
        <MiniGame worldId={worldId} miniGameId={miniGame} label={`${miniGame} 시작`} />
      ): (
        <WorldHome worldId={worldId} />
      )}
    </main>
  )
}