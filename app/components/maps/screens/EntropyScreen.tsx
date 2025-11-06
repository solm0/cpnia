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
import { AnimationMixer, Object3D, Vector3 } from "three";
import { useGLTF } from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { useFrame } from "@react-three/fiber";
import ExplodingModel from "../entropy/ExplodingModel";
import Player from "../entropy/Player";
import { Boundary } from "../player/clampToBoundary";
import { BoxHelper } from "../../games/games/W1G1/BoxHelper";

useGLTF.preload("/models/entropy-1.glb");
useGLTF.preload("/models/entropy-2.glb");
useGLTF.preload('/models/gate.glb');

export function Map({
  stage, position, scale
}: {
  stage: number;
  position: Vector3;
  scale: number;
}) {
  const gate = useGLTF('/models/gate.glb');
  const map1 = useGLTF("/models/entropy-1.glb");
  const map2 = useGLTF("/models/entropy-2.glb");
  const mapMixer = useRef<AnimationMixer | null>(null);
  const gateMixer = useRef<AnimationMixer | null>(null);

  useEffect(() => {
    mapMixer.current = new AnimationMixer(stage === 0 ? map1.scene : map2.scene);
    gateMixer.current = new AnimationMixer(gate.scene);
    return () => {
      mapMixer.current?.stopAllAction();
    };
  }, [map1, map2, stage]);

  useEffect(() => {
    if (!mapMixer.current || !gateMixer.current) return;
    const mapAnim = stage === 0 ? map1.animations[0] : map2.animations[0];
    const gateAnim = gate.animations[0];
    if (!mapAnim || !gateAnim) return;
  
    const mapAction = mapMixer.current.clipAction(mapAnim);
    const gateAction = gateMixer.current.clipAction(gateAnim);

    mapAction.play();
    gateAction.play();
  
  }, [map1, map2, gate]);

  useFrame((_, delta) => {
    mapMixer.current?.update(delta);
    gateMixer.current?.update(delta)
  })

  if (stage === 0 || stage === 1) {
    return (
      <>
        {/* 지형 */}
        <Model
          scene={
            stage === 0
             ? map1.scene
             : map2.scene
          }
          scale={50 * scale}
          position={[
            position.x,
            position.y,
            position.z
          ]}
          rotation={[0, -Math.PI/2, 0]}
        />
        <primitive
          object={gate.scene}
          position={[
            position.x + 154 * scale,
            position.y + 20 * scale,
            position.z + 71 * scale
          ]}
          scale={100 * scale}
          rotation={[0, Math.PI/2, 0]}
        />
      </>
    )
  } else {
    return (
      <ExplodingModel exploded={true} />
    )
  }
}

export const center = new Vector3(0,100,0);
export const mapScale = 1;

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

  const mapPos = new Vector3(
    center.x,
    center.y,
    center.z
  );

  const rectArea: Boundary[] = [
    { type: "rect", center: [center.x, center.z], size: [280, 260] }
  ];

  return (
    <main className="w-full h-full">
      {/* 월드 씬 */}
      <Scene>
        <Physics>

          <Map 
            stage={0}
            position={mapPos}
            scale={mapScale}
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
            models={npcModel}
          />

          {/* 플레이어 */}
          <Player
            worldKey={worldKey}
            avatar={avatar}
            rectArea={rectArea}
            center={center}
          />
          <BoxHelper
            center={new Vector3(rectArea[0].center[0], center.y, rectArea[0].center[1])}
            width={rectArea[0]?.size?.[0] ?? 0}
            depth={rectArea[0]?.size?.[1] ?? 0}
          />
        </Physics>

        {/* 효과 */}
        <EntropyEffects />
        <EntropyLights />
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