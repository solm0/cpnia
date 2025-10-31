import { RigidBody } from "@react-three/rapier";
import { gamePortals } from "@/app/lib/data/positions/gamePortals";
import PlaceHolder from "../util/PlaceHolder";
import { useGameStore } from "@/app/lib/state/gameState";
import GamePortalLabel from "./interfaces/GamePortalLabel";
import GamePortal from "./interfaces/GamePortal";

export default function Portals({
  worldKey,
}: {
  worldKey: string;
}) {
  const visibleGamePortals = gamePortals[worldKey].filter(portal => portal.position != null && portal.rotation != null);

  const gameState = useGameStore(state => state.worlds[worldKey].games)

  let stage: string;
  if (gameState['game1'] === false) {
    stage = 'game1';
  } else if (gameState['game2'] === false) {
    stage = 'game2'
  } else if (gameState['game3'] === false) {
    stage = 'game3'
  } else {
    stage = 'unknown';
  }

  function isLocked(gameKey: string, stage:string) {
    return Number(gameKey.slice(-1)) > Number(stage.slice(-1))
  }

  return (
    <>
      {/* 게임 포탈 */}
      {visibleGamePortals.map((game) => 
        <RigidBody
          key={game.gameKey}
          position={game.position}
          rotation={game.rotation}
          type="fixed"
        >
          <GamePortalLabel
            label={game.label}
            worldKey={worldKey}
            gameKey={game.gameKey}
            locked={isLocked(game.gameKey, stage)}
            y={45}
          />

          {game.model ? (
            <GamePortal
              modelSrc={game.model}
              locked={isLocked(game.gameKey, stage)}
              worldKey={worldKey}
              gameKey={game.gameKey}
              scale={game.scale}
            />
          ): (
            <PlaceHolder />
          )}
        </RigidBody>
      )}
    </>
  )
}