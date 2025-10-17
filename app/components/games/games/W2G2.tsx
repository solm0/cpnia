import Scene from "../../util/Scene";
import GameMenu from "../interfaces/GameMenu";
import { useGLTF } from "@react-three/drei";
import { Suspense, useState } from "react";
import ShootingRange from "./W2G2/ShootingRange";
import Crowd from "./W2G2/Crowd";
import { Object3D } from "three";

export default function W2G2({
  worldKey, gameKey, onGameEnd
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
}) {
  const [round, setRound] = useState(1);

  function onRoundEnd(success: boolean) {
    if (success) {
      if (round === 12) {
        onGameEnd(true);
      } else {
        setRound(prev => prev + 1);
      }
    } else {
      onGameEnd(false);
    }
  }

  const gltfMap: Record<string, Object3D> = {
    pepperoni: useGLTF("/models/avatars/pepperoni.gltf").scene,
    mushroom: useGLTF("/models/avatars/mushroom.gltf").scene,
    cheese: useGLTF("/models/avatars/cheese.gltf").scene,
    onion: useGLTF("/models/avatars/onion.gltf").scene,
    redpap: useGLTF("/models/avatars/redpap.gltf").scene,
    yellowpap: useGLTF("/models/avatars/yellowpap.gltf").scene,
    olive: useGLTF("/models/avatars/olive.gltf").scene,
  };

  let obj = Object.entries(gltfMap)[0];
  let pizzaMoveSpeed = 1;

  for (let i = 1; i < 12; i++) {
    if (i === round) {
      obj = Object.entries(gltfMap)[i % 4];
      pizzaMoveSpeed = 1 + Math.ceil(i/3);
    }
  }
  
  return (
    <main className="w-full h-full">
      {/* 게임 */}
      <Scene
        position={[0,0,5]} // 카메라도 나중에 새총 y에 대해
        rotation={[0,0,0]}
      >
        <Suspense>
          <ShootingRange
            onRoundEnd={onRoundEnd}
            prey={obj}
            pizzaMoveSpeed={pizzaMoveSpeed}
          />

          {/* 구경꾼 */}
          <Crowd gltfMap={gltfMap} />
        </Suspense>
      </Scene>

      {/* 게임 인터페이스 */}
      <GameMenu
        worldKey={worldKey}
        gameKey={gameKey}
        score={round}
      />
    </main>
  )
}