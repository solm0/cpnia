// 카메라 무빙... 맵... 모델.소품.오디오.조명.npc.아바타

import PlayerWithAvatar from "../models/PlayerWithAvatar";
import Model from "../models/Model";
import { useEffect, useRef } from "react";
import * as THREE from 'three'

export default function SacrificeMap() {

  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const directionalTargetRef = useRef<THREE.Object3D>(null);

  useEffect(() => {
    if (directionalLightRef.current && directionalTargetRef.current) {
      directionalLightRef.current.target = directionalTargetRef.current;
      directionalLightRef.current.castShadow = true;

      // Shadow settings
      directionalLightRef.current.shadow.mapSize.width = 2048;
      directionalLightRef.current.shadow.mapSize.height = 2048;
      directionalLightRef.current.shadow.camera.near = 1;
      directionalLightRef.current.shadow.camera.far = 200;
      directionalLightRef.current.shadow.camera.left = -50;
      directionalLightRef.current.shadow.camera.right = 50;
      directionalLightRef.current.shadow.camera.top = 50;
      directionalLightRef.current.shadow.camera.bottom = -50;
    }
  }, []);

  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight
        ref={directionalLightRef}
        intensity={2}
        position={[50, 50, 50]} // not directly above, set an angle
        color={0xffffff}
        castShadow
      />
      <group ref={directionalTargetRef} position={[0, 0, 0]} />

      <Model
        src="/models/sacrifice-map.glb"
        scale={5}
        position={[-100,-129,200]}
        rotation={[0,0,0]}
      />

      {/* 아바타 */}
      <PlayerWithAvatar />
    </>
  )
}