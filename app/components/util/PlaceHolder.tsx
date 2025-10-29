'use client'

import { useRouter } from "next/navigation";
import Label from "../util/Label";
import { useGLTF } from "@react-three/drei";
import Model from "./Model";
import { useMemo } from "react";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

useGLTF.preload('/models/placeholder.glb');

export default function PlaceHolder({
  scale, position, rotation, href, gameKey, label, completed = null, onClick
}: {
  scale?: number,
  position?: [number, number, number],
  rotation?: [number, number, number],
  href?: string;
  gameKey?: string;
  label?: string;
  completed?: boolean | null;
  onClick?: (param?: number | string) => void;
}) {
  const placeholderScene = useGLTF('/models/placeholder.glb').scene;
  const placeholder = useMemo(() => clone(placeholderScene), [placeholderScene]);
  
  const router = useRouter();

  const handleClick = () => {
    if (onClick) onClick();
    else if (href && gameKey) router.push(`/${href}?game=${gameKey}`);
    else if (href) router.push(`/${href}`);
  };

  return (
    <group
      scale={scale ?? 1}
      position={position ?? [0, 0, 0]}
      rotation={rotation ?? [0, 0, 0]}
      onClick={handleClick}
    >
      <Model scene={placeholder} />
      {label && <Label text={label} position={[0, 2.5, 0]} />}
      {completed !== null && <Label text={completed ? 'completed!' : 'not completed'} position={[0, 2, 0]} />}
    </group>
  );
}