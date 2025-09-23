'use client'

import { useGameStore } from "@/app/lib/state/gameState";
import PlaceHolder from "../models/PlaceHolder";

export default function GameIcon({
  label, worldKey, gameKey, position, rotation,
}: {
  label: string;
  worldKey: string;
  gameKey: string;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const completed = useGameStore((state) => state.worlds[worldKey].games[gameKey]);

  return (
    <group
      scale={1}
      position={position}
      rotation={rotation}
    >
      <PlaceHolder
        gameKey={gameKey}
        href={worldKey}
        label={label}
        completed={completed}
      />
    </group>
  )
}