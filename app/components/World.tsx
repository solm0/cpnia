'use client'

import { useSearchParams } from "next/navigation";
import Game from "./games/Game";
import WorldScreen from "./maps/WorldScreen";

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
    return <WorldScreen worldKey={worldKey} />
  }
}