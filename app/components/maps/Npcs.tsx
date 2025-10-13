import MapNpc from "./MapNpc";
import { mapNpcs } from "@/app/lib/data/positions/mapNpcs";
import ChatNpc from "./ChatNpc";
import { RigidBody } from "@react-three/rapier";
import { useState } from "react";
import { chatNpcProp } from "@/app/lib/data/positions/chatNpcs";
import { Billboard, Image } from "@react-three/drei";

export default function Npcs({
  worldKey, activeNpc, setActiveNpc, setIsChatOpen, chatNpc
}: {
  worldKey: string;
  activeNpc: string | null;
  setActiveNpc: (activeNpc: string | null) => void;
  setIsChatOpen: (isChatOpen: boolean) => void;
  chatNpc: chatNpcProp;
}) {
  const [hoveredNpc, setHoveredNpc] = useState<string | null>(null);

  return (
    <>
      {/* 맵 npc */}
      {mapNpcs[worldKey].map(npc => 
        <group
          key={npc.name}
        >
          <Billboard position={
            npc.name != '피자커팅기'
              ? [npc.position[0],npc.position[1]+7,npc.position[2]]
              : [npc.position[0]-4,npc.position[1]+25,npc.position[2]+1]
          }>
            <Image
              url={npc.name != '피자커팅기'
                ? "/images/threedots.png"
                : "/images/exclaim.png"
              }
              scale={
                npc.name != '피자커팅기'
                  ? [2,2]
                  : [4,4]
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
              model={npc.model}
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
      />
    </>
  )
}