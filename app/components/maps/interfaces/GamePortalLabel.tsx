'use client'

import { useGameStore } from "@/app/lib/state/gameState";
import Label from "../../util/Label";
import { Billboard, Image } from "@react-three/drei";

export default function GamePortalLabel({
  label, worldKey, gameKey, locked, y = 5
}: {
  label: string;
  worldKey: string;
  gameKey: string;
  locked: boolean;
  y?: number;
}) {
  const completed = useGameStore((state) => state.worlds[worldKey].games[gameKey]);

  let iconUrl;
  if (locked) {
    iconUrl = '/images/locked.png'
  } else if (!completed) {
    iconUrl = "/images/exclaim.png"
  } else {
    iconUrl = '/images/check.png'
  }

  return (
    <Billboard position={[0,y,0]} scale={5}>
      <Image
        url={iconUrl}
        scale={[2,2]}
        transparent
      />
      <Label text={label ?? null} position={[0, 2.5,0]}/>
      <Label text={completed ? 'completed!' : 'not completed'} position={[0, 2, 0]} />
    </Billboard>
  )
}