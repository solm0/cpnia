'use client'

import { useGameStore } from "@/app/lib/state/gameState";
import Label from "../../util/Label";
import { Billboard, Image } from "@react-three/drei";

export default function GamePortalLabel({
  label, worldKey, gameKey, locked, y = 5, position
}: {
  label?: string;
  worldKey?: string;
  gameKey?: string;
  locked: boolean;
  y?: number;
  position?: [number, number, number]; // CoinStair 전용
}) {
  const complete = useGameStore((state) => state.worlds[worldKey ?? '']?.games[gameKey ?? '']);
  const completed = worldKey && gameKey ? complete : null;

  const pos = position
    ? position
    : [0,y,0] as [number, number, number];

  let iconUrl;
  if (locked) {
    iconUrl = '/images/locked.png'
  } else if (!completed) {
    iconUrl = "/images/exclaim.png"
  } else {
    iconUrl = '/images/check.png'
  }

  return (
    <Billboard position={pos} scale={2}>
      <Image
        url={iconUrl}
        scale={[2,2]}
        transparent
      />
      {label && <Label text={label} position={[0, 2.5,0]}/>}
      {completed !== null && <Label text={completed ? 'completed!' : 'not completed'} position={[0, 2, 0]} />}
    </Billboard>
  )
}