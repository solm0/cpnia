import MapNpc from "./MapNpc";
import { mapNpcs } from "@/app/lib/data/positions/mapNpcs";
import ChatNpc from "./ChatNpc";
import { RigidBody } from "@react-three/rapier";
import { useState } from "react";
import { chatNpcProp } from "@/app/lib/data/positions/chatNpcs";
import { Billboard, Image } from "@react-three/drei";

export default function Npcs({
  worldKey, setActiveNpc, setIsChatOpen, chatNpc
}: {
  worldKey: string;
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
              setActiveNpc={setActiveNpc}
              model={npc.model}
              closeIsChatOpen={setIsChatOpen}
            />
          </RigidBody>
        </group>
      )}

      {/* 챗 npc */}
      <group>
        <Billboard position={[chatNpc.position[0],chatNpc.position[1]+7,chatNpc.position[2]]}>
          <Image
            url="/images/exclaim.png"
            scale={[2,2]}
            transparent
          />
        </Billboard>
        <RigidBody
          position={chatNpc.position}
          rotation={chatNpc.rotation}
          colliders={'cuboid'}
          type="fixed"
        >
          <ChatNpc
            name={chatNpc.name}
            hoveredNpc={hoveredNpc}
            setHoveredNpc={setHoveredNpc}
            setIsChatOpen={setIsChatOpen}
            closeActiveNpc={setActiveNpc}
          />
        </RigidBody>
      </group>
    </>
  )
}