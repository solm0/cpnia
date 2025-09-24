'use client'

import Scene from "./components/util/Scene";
import { worldPortals } from "./lib/data/worldPortals";
import WorldPortal from "./components/home/interfaces/WorldPortal";
import HomeMenu from "./components/home/interfaces/HomeMenu";
import { useNpcConfigStore } from "@/app/lib/state/npcConfigState";
import { useEffect } from "react";

export default function Home() {
  const defaultNpcConfig = {
    formality: '하십시오체',
    verbosity: '투머치토커',
    warmth: '적대적인',
  }
  const setNpcConfig = useNpcConfigStore(state => state.setNpcConfig);

  useEffect(() => {
    const savedConfig = localStorage.getItem('npc-config')
    if (!savedConfig) {
      setNpcConfig(defaultNpcConfig);
    }
  }, []);

  return (
    <main className="relative w-full h-full">
      <div className="w-full h-full relative z-0">
        <Scene>
          {worldPortals.map(world => 
            <WorldPortal
              key={world.worldKey}
              label={world.label}
              worldKey={world.worldKey}
              position={world.position}
              rotation={world.rotation}
            />
          )}
        </Scene>
      </div>
      <div className="absolute top-0 left-0 w-full h-full z-[999] pointer-events-none">
        <HomeMenu />
      </div>
    </main>
  );
}
