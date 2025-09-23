'use client'

import { useGameStore } from "@/app/lib/state/gameState";
import Label from "../../util/Label";
import { useRouter } from "next/navigation";

export default function GamePortalLayout({
  label, worldKey, gameKey, position, rotation, children
}: {
  label: string;
  worldKey: string;
  gameKey: string;
  position: [number, number, number];
  rotation: [number, number, number];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const completed = useGameStore((state) => state.worlds[worldKey].games[gameKey]);

  // 발광 애니메이션
  
  return (
    <group
      scale={1}
      position={position}
      rotation={rotation}
      onClick={() => router.push(`/${worldKey}?game=${gameKey}`)}
    >
      <Label text={label ?? null} position={[0, 2.5,0]}/>
      <Label text={completed ? 'completed!' : 'not completed'} position={[0, 2, 0]} />
      {children}
    </group>
  )
}