import MapNpc from "./MapNpc";
import { mapNpcs } from "@/app/lib/data/positions/mapNpcs";
import ChatNpc from "./ChatNpc";
import { RigidBody } from "@react-three/rapier";
import { useState } from "react";
import { chatNpcProp } from "@/app/lib/data/positions/chatNpcs";

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
            name={npc.name}
            hoveredNpc={hoveredNpc}
            setHoveredNpc={setHoveredNpc}
            setActiveNpc={setActiveNpc}
            model={npc.model}
            closeIsChatOpen={setIsChatOpen}
          />
        </RigidBody>
      )}

      {/* 챗 npc */}
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
    </>
  )
}