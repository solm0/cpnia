'use client'

import { Billboard, useGLTF } from "@react-three/drei";
import Model from "../../util/Model";
import { Group, Vector3 } from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function WorldPortal({
  src, worldKey, position, rotation, scale, rotationAxis, rotationSpeed, onFocus, setFocusedWorld, id
}: {
  src: string;
  worldKey: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  rotationAxis: [number, number, number];
  rotationSpeed: number;
  onFocus: (num: number, isMove: boolean) => void;
  setFocusedWorld: (focusedWorld: string) => void;
  id: number;
}) {
  const ref = useRef<Group | null>(null);
  const icon = useGLTF(src).scene

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
        onFocus?.(id, false);
        setFocusedWorld(worldKey);
      }}
    >
      <Billboard>
       
      </Billboard>
      <Model
        scene={icon}
        scale={scale}
      />
    </group>
  )
}