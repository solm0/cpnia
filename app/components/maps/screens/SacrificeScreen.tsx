import Model from "../../util/Model";
import Scene from "@/app/components/util/Scene"
import Portals from "../Portals";
import { useMemo, useState } from "react";
import { SacrificeNpcLineModal } from "../interfaces/NpcLineModals";
import Npcs from "../Npcs";
import { chatNpcs } from "@/app/lib/data/positions/chatNpcs";
import ChatNpcScreen from "../interfaces/chatnpc/ChatNpcScreen";
import Player from "../sacrifice/Player";
import { SacrificeLights } from "../Lights";
import { Physics } from '@react-three/rapier'
import NpcLineModalMain from "../NpcLineModalMain";
import { SacrificeEffects } from "../Effects";
import GlobalMenu from "../interfaces/GlobalMenu";
import Fire from "../sacrifice/Fire";
import { useGLTF } from "@react-three/drei";
import { Object3D, Vector3 } from "three";
import Glass from "../sacrifice/Glass";
import PizzaLine from "../sacrifice/PizzaLine";
import Crowd from "../../games/games/W2G2/Crowd";
import PizzaCrowd from "../sacrifice/PizzaCrowd";

useGLTF.preload("/models/animations/idle.glb");
useGLTF.preload("/models/animations/walk.glb");
useGLTF.preload("/models/animations/jump.glb");
useGLTF.preload("/models/animations/arm.glb");
useGLTF.preload("/models/avatars/pepperoni.gltf")
useGLTF.preload("/models/avatars/mushroom.gltf")
useGLTF.preload("/models/avatars/cheese.gltf")
useGLTF.preload("/models/avatars/yellowpap.gltf")
useGLTF.preload("/models/avatars/onion.glb")
useGLTF.preload("/models/avatars/redpap.gltf")
useGLTF.preload("/models/avatars/olive.gltf")

useGLTF.preload("/models/avatars/gandalf.gltf")

export default function SacrificeScreen({
  avatar,
}: {
  avatar: Object3D;
}) {
  const worldKey = 'sacrifice';
  const [activeNpc, setActiveNpc] = useState<string | null>(null);
  const stagePosition ={ x:-200, y: -137.5, z: 350, scale: 1 }

  const chatNpc = chatNpcs[worldKey];
  const [isChatOpen, setIsChatOpen] = useState(false);

  const gltfMap: Object3D[] = [
    useGLTF("/models/avatars/pepperoni.gltf").scene,
    useGLTF("/models/avatars/mushroom.gltf").scene,
    useGLTF("/models/avatars/cheese.gltf").scene,
    useGLTF("/models/avatars/yellowpap.gltf").scene,
    useGLTF("/models/avatars/onion.glb").scene,
    useGLTF("/models/avatars/redpap.gltf").scene,
    useGLTF("/models/avatars/olive.gltf").scene,
  ];

  const clonedGltfMap = useMemo(() => {
    return gltfMap.map((model: Object3D) => model.clone(true));
  }, [gltfMap]);

  const gltfMapPizza: Record<string, Object3D> = {
    pepperoni: useGLTF("/models/avatars/pepperoni.gltf").scene,
    mushroom: useGLTF("/models/avatars/mushroom.gltf").scene,
    cheese: useGLTF("/models/avatars/cheese.gltf").scene,
    onion: useGLTF("/models/avatars/onion.glb").scene,
    redpap: useGLTF("/models/avatars/redpap.gltf").scene,
    yellowpap: useGLTF("/models/avatars/yellowpap.gltf").scene,
    olive: useGLTF("/models/avatars/olive.gltf").scene,
  };

  const kitchen = useGLTF("/models/kitchen.glb").scene;
  const shop = useGLTF("/models/shop.gltf").scene

  const config: {playerPos: Vector3, playerRot: Vector3, camYRot: number} = {
    playerPos: new Vector3(
      stagePosition.x + 400 * stagePosition.scale,
      stagePosition.y + 39.5 * stagePosition.scale,
      stagePosition.z - 380 * stagePosition.scale
    ),
    playerRot: new Vector3(0, -Math.PI, 0),
    camYRot: 105
  }

  const center = new Vector3(0,0,0)

  const doorPos = new Vector3(
    center.x + 125 * stagePosition.scale,
    0,
    center.z + 19 * stagePosition.scale
  );
  const pizzaPos = new Vector3(
    center.x + 220 * stagePosition.scale,
    0,
    center.z - 100 * stagePosition.scale
  );

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
              stagePosition.x * stagePosition.scale,
              stagePosition.y * stagePosition.scale,
              stagePosition.z * stagePosition.scale
            ]}
            rotation={[0,0,0]}
          />
          <Model
            scene={shop}
            scale={4.5}
            position={[
              stagePosition.x * stagePosition.scale,
              stagePosition.y * stagePosition.scale,
              stagePosition.z * stagePosition.scale
            ]}
            rotation={[0,0,0]}
          />

          {/* 불, 진열대, 주민 줄, 피자 위 주민들 */}
          <Fire />
          <Glass />
          <PizzaLine
            doorPos={doorPos}
            pizzaPos={pizzaPos}
            gltfMap={clonedGltfMap}
          />
          <PizzaCrowd
            gltfMap={gltfMapPizza}
            center={[
              center.x + 73,
              center.y + 25.55, 
              center.z
            ]}
            radius={30}
          />

          {/* 포탈들 */}
          <Portals worldKey={worldKey} />

          {/* npc들 */}
          <Npcs
            worldKey={worldKey}
            activeNpc={activeNpc}
            setActiveNpc={setActiveNpc}
            setIsChatOpen={setIsChatOpen}
            chatNpc={chatNpc}
            models={gltfMap.slice(0,4)}
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