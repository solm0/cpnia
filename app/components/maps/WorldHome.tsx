import PlaceHolder from "@/app/components/models/PlaceHolder";
import Scene from "@/app/components/util/Scene"
import { useGameStore } from "@/app/lib/state/gameState";
import { miniGameModels } from "@/app/lib/data/minigameModels";
import EntropyMap from "./EntropyMap";
import TimeMap from "./TimeMap";
import SacrificeMap from "./SacrificeMap";

function MinigameModel({
  label, worldId, miniGameId, position, rotation,
}: {
  label: string;
  worldId: string;
  miniGameId: string;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const completed = useGameStore((state) => state.worlds[worldId].miniGames[miniGameId]);

  return (
    <group
      scale={1}
      position={position}
      rotation={rotation}
    >
      <PlaceHolder
        minigame={miniGameId}
        href={worldId}
        label={label}
        completed={completed}
      />
    </group>
  )
}

export default function WorldHome({
  worldId,
}: {
  worldId: string;
}) {
  let map: React.ReactNode;

  switch(worldId) {
    case 'time':
      map = <TimeMap />;
      break;
    case 'sacrifice':
      map = <SacrificeMap />;
      break;
    case 'entropy':
      map = <EntropyMap />;
      break;
    default:
      <PlaceHolder label="no worldId" />
  }
  return (
    <Scene>
      {/* 공통 부분: 미니게임으로 들어가는 포탈 3개 */}
      {miniGameModels[worldId].map(minigame => 
        <MinigameModel
          key={minigame.id}
          label={minigame.label}
          worldId={worldId}
          miniGameId={minigame.id}
          position={minigame.position}
          rotation={minigame.rotation}
        />
      )}

      {/* 개별 부분: 맵 */}
      {map}
    </Scene>
  )
}