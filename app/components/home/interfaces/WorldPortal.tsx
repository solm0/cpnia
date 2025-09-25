'use client'

import PlaceHolder from "../../util/PlaceHolder";
import { useGameStore } from "@/app/lib/state/gameState";

export default function WorldPortal({
  label, worldKey, position, rotation, onFocus, setFocusedWorld,
}: {
  label: string;
  worldKey: string;
  position: [number, number, number];
  rotation: [number, number, number];
  onFocus: (position?: [number, number, number], rotation?:[number, number, number], worldKey?: string) => void;
  setFocusedWorld: (focusedWorld: string) => void;
}) {
  const completed = useGameStore((state) => state.isWorldCompleted(worldKey));

  return (
    <group
      scale={1}
      position={position}
      rotation={rotation}
      onClick={() => {
        onFocus?.(position, rotation);
        setFocusedWorld(worldKey);
      }}
    >
      <PlaceHolder
        label={label}
        completed={completed}
      />
    </group>
  )
}