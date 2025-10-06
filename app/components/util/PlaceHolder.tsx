'use client'

import { useLoader } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import Label from "../util/Label";
import { Mesh } from "three";

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
  const gltf = useLoader(GLTFLoader, '/models/placeholder.glb');

  // Clone the scene once and set shadows
  const clonedScene = useMemo(() => {
    const scene = clone(gltf.scene);
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return scene;
  }, [gltf.scene]);

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
      <primitive object={clonedScene} />
      {label && <Label text={label} position={[0, 2.5, 0]} />}
      {completed !== null && <Label text={completed ? 'completed!' : 'not completed'} position={[0, 2, 0]} />}
    </group>
  );
}