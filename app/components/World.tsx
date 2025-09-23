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

  if (game) {
    return <Game worldKey={worldKey} gameKey={game} />
  } else {
    return <WorldHome worldKey={worldKey} />
  }
}