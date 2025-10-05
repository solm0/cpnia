import { RigidBody } from "@react-three/rapier";
import { gamePortals } from "@/app/lib/data/positions/gamePortals";
import GamePortalLayout from "./interfaces/GamePortalLayout";
import PlaceHolder from "../util/PlaceHolder";
import { useGameStore } from "@/app/lib/state/gameState";

export default function Portals({
  worldKey,
}: {
  worldKey: string;
}) {
  const visibleGamePortals = gamePortals[worldKey].filter(portal => portal.position != null && portal.rotation != null);

  const gameState = useGameStore(state => state.worlds[worldKey].games)

  let stage;
  if (gameState['game1'] === false) {
    stage = 'game1';
  } else if (gameState['game2'] === false) {
    stage = 'game2'
  } else if (gameState['game3'] === false) {
    stage = 'game3'
  } else {
    stage = 'unknown';
  }
  
  return (
    <>
      {/* 게임 포탈 */}
      {visibleGamePortals.map((game, idx) => 
        <RigidBody
          key={game.gameKey}
          position={game.position}
          rotation={game.rotation}
          type="fixed"
        >
          <GamePortalLayout
            label={game.label}
            worldKey={worldKey}
            gameKey={game.gameKey}
            locked={Number(game.gameKey.slice(-1)) > Number(stage.slice(-1))}
          >
            <PlaceHolder />
          </GamePortalLayout>
        </RigidBody>
      )}
    </>
  )
}