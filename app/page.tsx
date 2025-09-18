'use client'

import Scene from "./components/util/Scene";
import PlaceHolder from "./components/models/PlaceHolder";
import Title from "./components/Title";
import { useGameStore } from "./lib/state/gameState";
import { worldModels } from "./lib/data/worldModels";

// localstorage에 넣기

function WorldModel({
  label, id, position, rotation,
}: {
  label: string;
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const completed = useGameStore((state) => state.isWorldCompleted(id));

  return (
    <group
      scale={1}
      position={position}
      rotation={rotation}
    >
      <PlaceHolder
        href={id}
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
            id={world.id}
            position={world.position}
            rotation={world.rotation}
          />
        )}
      </Scene>
    </main>
  );
}
