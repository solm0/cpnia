'use client'

import Scene from "./components/util/Scene";
import PlaceHolder from "./components/models/PlaceHolder";
import Title from "./components/Title";
import { useGameStore } from "./lib/state/gameState";
import { worldModels } from "./lib/data/worldModels";

// localstorage에 넣기

function WorldModel({
  label, worldKey, position, rotation,
}: {
  label: string;
  worldKey: string;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  console.log(worldKey)
  const completed = useGameStore((state) => state.isWorldCompleted(worldKey));

  return (
    <group
      scale={1}
      position={position}
      rotation={rotation}
    >
      <PlaceHolder
        href={worldKey}
        label={label}
        completed={completed}
      />
    </group>
  )
}

export default function Home() {
  return (
    <main className="flex flex-col w-full h-full">
      <Scene>
        <Title label="Cpland" />

        {/* Models */}
        {worldModels.map(world => 
          <WorldModel
            key={world.id}
            label={world.label}
            worldKey={world.id}
            position={world.position}
            rotation={world.rotation}
          />
        )}
      </Scene>
    </main>
  );
}
