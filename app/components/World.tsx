'use client'

import { useSearchParams } from "next/navigation";
import Game from "./games/Game";
import WorldScreen from "./maps/screens/WorldScreen";
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";

export default function World({
  worldKey
}: {
  worldKey: string;
}) {
  const searchParam = useSearchParams();
  const game = searchParam.get('game');
  const avatarScene = useGLTF("/models/avatars/default.gltf").scene;
  const avatar = useMemo(() => avatarScene.clone(), [avatarScene]);

  if (game) {
    return <Game worldKey={worldKey} gameKey={game} avatar={avatar} />
  } else {
    return <WorldScreen worldKey={worldKey} avatar={avatar} />
  }
}