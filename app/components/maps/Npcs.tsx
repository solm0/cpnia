import MapNpc from "./MapNpc";
import { mapNpcProp, mapNpcs } from "@/app/lib/data/positions/mapNpcs";
import ChatNpc from "./ChatNpc";
import { RigidBody } from "@react-three/rapier";
import { useMemo, useState } from "react";
import { chatNpcProp } from "@/app/lib/data/positions/chatNpcs";
import { Billboard, Image, useGLTF } from "@react-three/drei";
import { Object3D } from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

useGLTF.preload('/models/avatars/cutter.gltf');
useGLTF.preload('/models/avatars/time-npc.glb');

export default function Npcs({
  worldKey, activeNpc, setActiveNpc, setIsChatOpen, chatNpc,
  models,
}: {
  worldKey: string;
  activeNpc: string | null;
  setActiveNpc: (activeNpc: string | null) => void;
  setIsChatOpen: (isChatOpen: boolean) => void;
  chatNpc: chatNpcProp;
  models: Object3D[];
}) {
  const [hoveredNpc, setHoveredNpc] = useState<string | null>(null);
  const cutter = useGLTF('/models/avatars/cutter.gltf').scene;
  const timeNpc = useGLTF('/models/avatars/time-npc.glb').scene;
  const clonedTimeNpc = useMemo(() => clone(timeNpc), [timeNpc]);

  function chooseModel(npc:mapNpcProp, i: number) {
    let model = models[i];
    if (npc.type === 'special') {
      if (npc.name === '피자커팅기') model = cutter;
      else if (npc.name === '카드게임장에서 발견한 주민') model = timeNpc;
      else if (npc.name === '파친코 앞에서 발견한 주민') model = clonedTimeNpc;
    }
    return model;
  }

  console.log(mapNpcs[worldKey])

  return (
    <>
      {/* 맵 npc */}
      {mapNpcs[worldKey].map((npc, i) => 
        <group
          key={npc.name}
        >
          <Billboard position={
            npc.name != '피자커팅기'
              ? [npc.position[0],npc.position[1]+7,npc.position[2]]
              : [npc.position[0]-4,npc.position[1]+25,npc.position[2]+1]
          }>
            <Image
              url={npc.type != 'special'
                ? "/images/threedots.png"
                : "/images/exclaim.png"
              }
              scale={
                npc.scale
                  ? [2 * npc.scale, 2 * npc.scale]
                  : [2,2]
              }
              transparent
            />
          </Billboard>
          <RigidBody
            position={npc.position}
            rotation={npc.rotation}
            scale={npc.scale ?? 8}
            colliders={'cuboid'}
            type="fixed"
          >
            <MapNpc
              key={npc.name}
              name={npc.name}
              hoveredNpc={hoveredNpc}
              setHoveredNpc={setHoveredNpc}
              activeNpc={activeNpc}
              setActiveNpc={setActiveNpc}
              model={chooseModel(npc, i)}
              closeIsChatOpen={setIsChatOpen}
            />
          </RigidBody>
        </group>
      )}

      {/* 챗 npc */}
      <ChatNpc
        name={chatNpc.name}
        hoveredNpc={hoveredNpc}
        setHoveredNpc={setHoveredNpc}
        setIsChatOpen={setIsChatOpen}
        closeActiveNpc={setActiveNpc}
        model={models[3]}
      />
    </>
  )
}