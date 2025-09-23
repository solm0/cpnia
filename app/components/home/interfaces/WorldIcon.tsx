'use client'

import PlaceHolder from "../../util/PlaceHolder";
import { useGameStore } from "@/app/lib/state/gameState";

export default function WorldIcon({
  label, worldKey, position, rotation,
}: {
  label: string;
  worldKey: string;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const completed = useGameStore((state) => state.isWorldCompleted(worldKey));

  return (
    <group
      scale={1}
      position={position}
      rotation={rotation}
    >
      <PlaceHolder
        href={worldKey}
        label={label}
        completed={completed}
      />
    </group>
  )
}