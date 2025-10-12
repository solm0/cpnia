'use client'

import { Billboard, Text } from "@react-three/drei";
import Model from "../../util/Model";
import { useGameStore } from "@/app/lib/state/gameState";

export default function WorldPortal({
  src, label, worldKey, position, rotation, scale, onFocus, setFocusedWorld,
}: {
  src: string;
  label: string;
  worldKey: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
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
      <Billboard>
        <Text
          color="white"
          position={[0,3.3,0]}
          fontSize={0.4}
          anchorX="center"
          anchorY="middle"
        >
          {completed ? 'completed!' : 'not completed'}
        </Text>
        <Text
          position={[0, 4, 0]}
          color="white"
          fontSize={0.4}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </Billboard>
      <Model src={src} scale={scale}/>
    </group>
  )
}