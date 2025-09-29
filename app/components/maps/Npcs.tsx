import MapNpc from "./MapNpc";
import { mapNpcs } from "@/app/lib/data/mapNpcs";
import ChatNpc from "./ChatNpc";
import { RigidBody } from "@react-three/rapier";
import { useState } from "react";
import { chatNpcProp } from "@/app/lib/data/chatNpcs";

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
          colliders={'cuboid'}
          type="fixed"
        >
          <MapNpc
            key={npc.name}
            name={npc.name}
            hoveredNpc={hoveredNpc}
            setHoveredNpc={setHoveredNpc}
            setActiveNpc={setActiveNpc}
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
        />
      </RigidBody>
    </>
  )
}