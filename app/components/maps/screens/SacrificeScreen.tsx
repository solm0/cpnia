import Model from "../../util/Model";
import Scene from "@/app/components/util/Scene"
import Portals from "../Portals";
import { useState } from "react";
import { SacrificeNpcLineModal } from "../interfaces/NpcLineModals";
import Npcs from "../Npcs";
import { chatNpcs } from "@/app/lib/data/positions/chatNpcs";
import ChatNpcScreen from "../interfaces/chatnpc/ChatNpcScreen";
import Player from "../sacrifice/Player";
import { SacrificeLights } from "../Lights";
import { Physics, RigidBody } from '@react-three/rapier'
import NpcLineModalMain from "../NpcLineModalMain";
import { SacrificeEffects } from "../Effects";
import GlobalMenu from "../interfaces/GlobalMenu";
import Fire from "../sacrifice/Fire";
import { useGLTF } from "@react-three/drei";
import { Object3D, Vector3 } from "three";
import Glass from "../sacrifice/Glass";

useGLTF.preload("/models/animations/idle.glb");
useGLTF.preload("/models/animations/walk.glb");
useGLTF.preload("/models/animations/jump.glb");
useGLTF.preload("/models/animations/arm.glb");

export default function SacrificeScreen({
  avatar,
}: {
  avatar: Object3D;
}) {
  const worldKey = 'sacrifice';
  const [activeNpc, setActiveNpc] = useState<string | null>(null);
  const stagePosition ={ x:-200, y: -137.5, z: 350 }

  const chatNpc = chatNpcs[worldKey];
  const [isChatOpen, setIsChatOpen] = useState(false);

  const gltfMap: Object3D[] = [
    useGLTF("/models/avatars/pepperoni.gltf").scene,
    useGLTF("/models/avatars/mushroom.gltf").scene,
    useGLTF("/models/avatars/cheese.gltf").scene,
    useGLTF("/models/avatars/yellowpap.gltf").scene,
  ];

  const kitchen = useGLTF("/models/kitchen.glb").scene;
  const shop = useGLTF("/models/shop.gltf").scene

  const config: {playerPos: Vector3, playerRot: Vector3} = {
    playerPos: new Vector3(
      80,
      -97,
      85
    ),
    playerRot: new Vector3(0, Math.PI, 0),
  }

  return (
    <main className="w-full h-full">
      <Scene
        near={0.1}
        far={7000}
        fov={50}
      >
        <Physics gravity={[0,-9,0]}>
          
          {/* 빛 */}
          <SacrificeLights/>

          {/* 지형 */}
          <Model
            scene={kitchen}
            scale={4.5}
            position={[
              stagePosition.x,
              stagePosition.y,
              stagePosition.z
            ]}
            rotation={[0,0,0]}
          />
          <Model
            scene={shop}
            scale={4.5}
            position={[
              stagePosition.x,
              stagePosition.y,
              stagePosition.z
            ]}
            rotation={[0,0,0]}
          />
          <Glass />

          <RigidBody type="fixed">
            <mesh receiveShadow castShadow position={[120, -6.5, -6]} >
              <boxGeometry args={[233, 2, 85]} /> {/* give it a thin height */}
              <meshStandardMaterial transparent opacity={0} />
            </mesh>
          </RigidBody>

          {/* 포탈들 */}
          <Portals worldKey={worldKey} />

          {/* 기타 모델들 */}
          <Fire />

          {/* npc들 */}
          <Npcs
            worldKey={worldKey}
            activeNpc={activeNpc}
            setActiveNpc={setActiveNpc}
            setIsChatOpen={setIsChatOpen}
            chatNpc={chatNpc}
            models={gltfMap}
          />

          {/* 플레이어 */}
          <Player
            worldKey={worldKey}
            avatar={avatar}
            config={config}
          />
        </Physics>
        
        {/* 효과 */}
        <SacrificeEffects />
      </Scene>

      {/* --- 월드 인터페이스 --- */}

      <GlobalMenu worldKey={worldKey} />

      {/* 맵 npc 인터페이스 */}
      {activeNpc &&
        <div className="absolute top-2/3 w-screen h-auto">
          {activeNpc !== '피자커팅기' ? (
            <SacrificeNpcLineModal
              worldKey={worldKey}
              name={activeNpc ?? 'npc없음'}
              setActiveNpc={setActiveNpc}
            />
          ): (
            <NpcLineModalMain
              name={activeNpc ?? '피자커팅기'}
              setActiveNpc={setActiveNpc}
              worldKey={worldKey}
            />
          )}
        </div>
      }

      {/* 챗 npc 인터페이스 */}
      <ChatNpcScreen
        npcData={chatNpc}
        worldKey={worldKey}
        setIsChatOpen={setIsChatOpen}
        isChatOpen={isChatOpen}
      />
    </main>
  )
}