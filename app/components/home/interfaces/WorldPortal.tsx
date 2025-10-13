'use client'

import { Billboard, Text } from "@react-three/drei";
import Model from "../../util/Model";
import { useGameStore } from "@/app/lib/state/gameState";
import { Group, Vector3 } from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function WorldPortal({
  src, label, worldKey, position, rotation, scale, rotationAxis, rotationSpeed, onFocus, setFocusedWorld,
}: {
  src: string;
  label: string;
  worldKey: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  rotationAxis: [number, number, number];
  rotationSpeed: number;
  onFocus: (position?: [number, number, number], rotation?:[number, number, number], worldKey?: string) => void;
  setFocusedWorld: (focusedWorld: string) => void;
}) {
  const completed = useGameStore((state) => state.isWorldCompleted(worldKey));
  const ref = useRef<Group | null>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotateOnAxis(
      new Vector3(...rotationAxis),
      rotationSpeed * delta
    );
  });

  return (
    <group
      scale={1}
      ref={ref}
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