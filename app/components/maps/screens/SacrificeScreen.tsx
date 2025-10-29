import Model from "../../util/Model";
import Scene from "@/app/components/util/Scene"
import Portals from "../Portals";
import { useState } from "react";
import { SacrificeNpcLineModal } from "../interfaces/NpcLineModals";
import Npcs from "../Npcs";
import { chatNpcs } from "@/app/lib/data/positions/chatNpcs";
import ChatNpcScreen from "../interfaces/chatnpc/ChatNpcScreen";
import Player from "../player/Player";
import { SacrificeLights } from "../Lights";
import { Physics, RigidBody } from '@react-three/rapier'
import NpcLineModalMain from "../NpcLineModalMain";
import { SacrificeEffects } from "../Effects";
import GlobalMenu from "../interfaces/GlobalMenu";
import Fire from "../Fire";
import { stagePositions } from "@/app/lib/data/positions/stagePositions";
import { useGLTF } from "@react-three/drei";
import { Object3D } from "three";

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

  const chatNpc = chatNpcs[worldKey];
  const [isChatOpen, setIsChatOpen] = useState(false);

  const gltfMap: Object3D[] = [
    useGLTF("/models/avatars/pepperoni.gltf").scene,
    useGLTF("/models/avatars/mushroom.gltf").scene,
    useGLTF("/models/avatars/cheese.gltf").scene,
    useGLTF("/models/avatars/yellowpap.gltf").scene,
  ];

  const kitchen = useGLTF("/models/kitchen.gltf").scene;
  const shop = useGLTF("/models/shop.gltf").scene

  return (
    <main className="w-full h-full">
      <Scene>
        <Physics gravity={[0,-9,0]}>
          
          {/* 빛 */}
          <SacrificeLights/>

          {/* 지형 */}
          <Model
            scene={kitchen}
            scale={4.5}
            position={[
              stagePositions.shop.x,
              stagePositions.shop.y,
              stagePositions.shop.z
            ]}
            rotation={[0,0,0]}
          />
          <Model
            scene={shop}
            scale={4.5}
            position={[
              stagePositions.shop.x,
              stagePositions.shop.y,
              stagePositions.shop.z
            ]}
            rotation={[0,0,0]}
          />

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
          <Player worldKey={worldKey} avatar={avatar} />
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