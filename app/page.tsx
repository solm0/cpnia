'use client'

import Scene from "./components/util/Scene";
import { worldIcons } from "./lib/data/worldIcons";
import WorldIcon from "./components/interfaces/WorldIcon";
import HomeMenu from "./components/interfaces/HomeMenu";


export default function Home() {
  return (
    <main className="relative w-full h-full">
      <div className="w-full h-full relative z-0">
        <Scene>
          {/* Icons */}
          {worldIcons.map(world => 
            <WorldIcon
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
