'use client'

import { useLoader } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import Label from "../util/Label";
import Completed from "../util/Completed";

export default function PlaceHolder({
  scale, position, rotation, href, game, label, completed = null
}: {
  scale?: number,
  position?: [number, number, number],
  rotation?: [number, number, number],
  href?: string;
  game?: string;
  label?: string;
  completed?: boolean | null;
}) {
  const gltf = useLoader(GLTFLoader, '/models/placeholder.glb');
  const clonedScene = useMemo(() => clone(gltf.scene), [gltf.scene]);
  const router = useRouter();

  if (game) {
    function handleClick() {
      router.push(`/${href}?game=${game}`);
    }

    return (
      <group
        scale={scale ?? 1}
        position={position ?? [0, 0, 0]}
        rotation={rotation ?? [0, 0, 0]}
        onClick={handleClick}
      >
        <primitive object={clonedScene} />
        <Label text={label ?? null} />
        {(completed !== null) && <Completed completed={completed} />}
      </group>
    )
  } else {
    return (
      <group
        scale={scale ?? 1}
        position={position ?? [0, 0, 0]}
        rotation={rotation ?? [0, 0, 0]}
        onClick={() => router.push(`/${href}`)}
      >
        <primitive object={clonedScene} />
        <Label text={label ?? null} />
        {(completed !== null) && <Completed completed={completed} />}
      </group>
    )
  }
}