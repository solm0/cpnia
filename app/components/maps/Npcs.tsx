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
useGLTF.preload('/models/avatars/time-npc.gltf');

function NpcLabel({
  npc,
}: {
  npc: mapNpcProp;
}) {
  function chooseConfig(npc: mapNpcProp) {
    let pos = npc.labelPos
      ? npc.labelPos
      : [0, 1.5, 0] as [number, number, number];
    let scale = [0.5, 0.5] as [number, number];
    
    if (npc.name === '피자커팅기') {
      scale = [2,2];
    } else if (npc.name === '카드게임장에서 발견한 주민' || npc.name === '파친코 위에서 발견한 주민') {
      pos = [0, 1.5, 0];
      scale = [0.5, 0.5];
    }
    // console.log(npc.name, npc.position, pos, scale)

    return {pos, scale};
  }

  return (
    <Billboard position={chooseConfig(npc).pos}>
      <Image
        url={npc.type != 'special'
          ? "/images/threedots.png"
          : "/images/exclaim.png"
        }
        scale={chooseConfig(npc).scale}
        transparent
      />
    </Billboard>
  )
}

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
  const timeNpc = useGLTF('/models/avatars/time-npc.gltf').scene;
  const clonedTimeNpc = useMemo(() => clone(timeNpc), [timeNpc]);

  function chooseModel(npc:mapNpcProp, i: number) {
    let model = models[i];
    if (npc.type === 'special') {
      if (npc.name === '피자커팅기') model = cutter;
      else if (npc.name === '카드게임장에서 발견한 주민') model = timeNpc;
      else if (npc.name === '파친코 위에서 발견한 주민') model = clonedTimeNpc;
    }
    return model;
  }

  return (
    <>
      {/* 맵 npc */}
      {mapNpcs[worldKey].map((npc, i) => 
        <RigidBody
          key={npc.name}
          position={npc.position}
          rotation={npc.rotation}
          scale={npc.scale ?? 8}
          colliders={'cuboid'}
          type="fixed"
        >
          <MapNpc
            key={npc.name}
            worldKey={worldKey}
            name={npc.name}
            hoveredNpc={hoveredNpc}
            setHoveredNpc={setHoveredNpc}
            activeNpc={activeNpc}
            setActiveNpc={setActiveNpc}
            model={chooseModel(npc, i)}
            closeIsChatOpen={setIsChatOpen}
          />
          <NpcLabel npc={npc} />
        </RigidBody>
      )}

      {/* 챗 npc */}
      {/* <ChatNpc
        name={chatNpc.name}
        hoveredNpc={hoveredNpc}
        setHoveredNpc={setHoveredNpc}
        setIsChatOpen={setIsChatOpen}
        closeActiveNpc={setActiveNpc}
        model={models[3]}
      /> */}
    </>
  )
}