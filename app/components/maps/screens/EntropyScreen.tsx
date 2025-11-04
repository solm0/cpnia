import Scene from "../../util/Scene";
import { EntropyLights } from "../Lights";
import { useEffect, useMemo, useRef, useState } from "react";
import { EntropyNpcLineModal } from "../interfaces/NpcLineModals";
import { chatNpcs } from "@/app/lib/data/positions/chatNpcs";
import ChatNpcScreen from "../interfaces/chatnpc/ChatNpcScreen";
import Portals from "../Portals";
import { Physics } from "@react-three/rapier";
import Npcs from "../Npcs";
import { EntropyEffects } from "../Effects";
import GlobalMenu from "../interfaces/GlobalMenu";
import Model from "../../util/Model";
import PlayerEntropy from "../entropy/PlayerEntropy";
import { AnimationMixer, LoopRepeat, Object3D } from "three";
import { useGLTF } from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { useFrame } from "@react-three/fiber";
import ExplodingModel from "../entropy/ExplodingModel";

useGLTF.preload("/models/entropy.glb");
useGLTF.preload("/models/entropy-2.glb");

export function Map({
  stage
}: {
  stage: number
}) {
  const gate = useGLTF('/models/gate.glb').scene;
  const mixer = useRef<AnimationMixer | null>(null);

  const map1 = useGLTF("/models/entropy-1.glb");
  const map2 = useGLTF("/models/entropy-2-output.glb");

  useEffect(() => {
    mixer.current = new AnimationMixer(stage === 0 ? map1.scene : map2.scene);
    return () => {
      mixer.current?.stopAllAction();
    };
  }, [map1, map2, stage]);

  useEffect(() => {
    if (!mixer.current) return;
    const anim = stage === 0 ? map1.animations[0] : map2.animations[0];
    if (!anim) return;
  
    const action = mixer.current.clipAction(anim);
    action.play();
  
  }, [map1, map2]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  })


  if (stage === 0) {

    return (
      <>
        {/* 지형 */}
        <Model
          scene={map1.scene}
          scale={50}
        />
        <primitive
          object={gate}
          position={[0,0,0]}
          scale={100}
        />
      </>
    )
  } else if (stage === 1) {
    

    return (
      <>
        {/* 지형 */}
        <Model
          scene={map2.scene}
          scale={50}
        />
        <primitive
          object={gate}
          position={[0,0,0]}
          scale={100}
        />
      </>
    )
  } else {
    return (
      <ExplodingModel exploded={true} />
    )
  }
}

export default function EntropyScreen({
  avatar,
}: {
  avatar: Object3D;
}) {
  const worldKey = 'entropy'
  const npcModelScene = useGLTF('/models/avatars/entropy-npc.gltf').scene;
  const npcModel = useMemo(() => {
    return Array.from({ length: 4 }, () => clone(npcModelScene));
  }, [npcModelScene]);

  const [activeNpc, setActiveNpc] = useState<string | null>(null);

  const chatNpc = chatNpcs[worldKey];
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <main className="w-full h-full">
      {/* 월드 씬 */}
      <Scene>
        <Physics gravity={[0,-9,0]}>

          {/* 빛 */}
          <EntropyLights />

          <Map stage={1} />

          {/* 포탈들 */}
          <Portals worldKey={worldKey} />

          {/* npc들 */}
          <Npcs
            worldKey={worldKey}
            activeNpc={activeNpc}
            setActiveNpc={setActiveNpc}
            setIsChatOpen={setIsChatOpen}
            chatNpc={chatNpc}
            models={npcModel}
          />

          {/* 플레이어 */}
          <PlayerEntropy worldKey={worldKey} avatar={avatar} />
        </Physics>

        {/* 효과 */}
        <EntropyEffects />
        <directionalLight intensity={10} position={[10,80,10]} castShadow receiveShadow  />
        <directionalLight intensity={10} position={[-10,80,-10]} castShadow receiveShadow />
        <directionalLight intensity={10} color={'blue'} position={[10,80,50]} castShadow receiveShadow />
      </Scene>
      
      {/* --- 월드 인터페이스 --- */}
      
      <GlobalMenu worldKey={worldKey} />
      
      {/* 맵 npc 인터페이스 */}
      <div className="absolute top-2/3 w-screen h-auto flex justify-center">
        {activeNpc &&
          <EntropyNpcLineModal
            worldKey={worldKey}
            name={activeNpc}
            setActiveNpc={setActiveNpc}
          />
        }
      </div>

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