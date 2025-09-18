'use client'

import { useSearchParams } from "next/navigation";
import Game from "./games/Game";
import WorldHome from "./maps/WorldHome";

export default function World({
  worldKey
}: {
  worldKey: string;
}) {
  const searchParam = useSearchParams();
  const game = searchParam.get('game');

  return (
    <main className="w-full h-full">
      {game ? (
        <Game worldKey={worldKey} gameKey={game} />
      ): (
        <WorldHome worldKey={worldKey} />
      )}
    </main>
  )
}