import PlaceHolder from "@/app/components/models/PlaceHolder";
import Scene from "@/app/components/util/Scene"
import { useGameStore } from "@/app/lib/state/gameState";
import EntropyMap from "./EntropyMap";
import TimeMap from "./TimeMap";
import SacrificeMap from "./SacrificeMap";
import { gameModels } from "@/app/lib/data/gameModels";

function GameModel({
  label, worldKey, gameKey, position, rotation,
}: {
  label: string;
  worldKey: string;
  gameKey: string;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const completed = useGameStore((state) => state.worlds[worldKey].games[gameKey]);

  return (
    <group
      scale={1}
      position={position}
      rotation={rotation}
    >
      <PlaceHolder
        game={gameKey}
        href={worldKey}
        label={label}
        completed={completed}
      />
    </group>
  )
}

export default function WorldHome({
  worldKey,
}: {
  worldKey: string;
}) {
  let map: React.ReactNode;

  switch(worldKey) {
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
      <PlaceHolder label="no worldKey" />
  }
  return (
    <Scene>
      {/* 공통 부분: 미니게임으로 들어가는 포탈 3개 */}
      {gameModels[worldKey].map(game => 
        <GameModel
          key={game.id}
          label={game.label}
          worldKey={worldKey}
          gameKey={game.id}
          position={game.position}
          rotation={game.rotation}
        />
      )}

      {/* 개별 부분: 맵 */}
      {map}
    </Scene>
  )
}