'use client'

import { useGameStore } from "@/app/lib/state/gameState";
import Label from "../../util/Label";
import { useRouter } from "next/navigation";
import { Billboard, Image } from "@react-three/drei";

export default function GamePortalLayout({
  label, worldKey, gameKey, children, locked
}: {
  label: string;
  worldKey: string;
  gameKey: string;
  children: React.ReactNode;
  locked: boolean;
}) {
  const router = useRouter();
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
    <group
      scale={1}
      onClick={() => {
        if (!locked) { router.push(`/${worldKey}?game=${gameKey}`) }
      }}
    >
      <Billboard position={[0,4,0]}>
        <Image
          url={iconUrl}
          scale={[2,2]}
          transparent
        />
        <Label text={label ?? null} position={[0, 2.5,0]}/>
        <Label text={completed ? 'completed!' : 'not completed'} position={[0, 2, 0]} />
      </Billboard>
      {children}
    </group>
  )
}