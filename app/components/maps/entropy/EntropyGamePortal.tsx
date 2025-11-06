import { RigidBody } from "@react-three/rapier";
import { gamePortals } from "@/app/lib/data/positions/gamePortals";
import PlaceHolder from "../../util/PlaceHolder";
import { useGameStore } from "@/app/lib/state/gameState";
import GamePortalLabel from "../interfaces/GamePortalLabel";
import GamePortal from "../interfaces/GamePortal";

export default function EntropyGamePortal({
  worldKey,
}: {
  worldKey: string;
}) {
  const visibleGamePortals = gamePortals[worldKey].filter(portal => portal.position != null && portal.rotation != null);

  // function isLocked(gameKey: string, stage:string) {
  //   return Number(gameKey.slice(-1)) > Number(stage.slice(-1))
  // }

  console.log(visibleGamePortals[0])

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
            // locked={isLocked(game.gameKey, stage)}
            locked={false}
            y={game.labelYPos}
          />

          {game.model ? (
            <GamePortal
              modelSrc={game.model}
              // locked={isLocked(game.gameKey, stage)}
              locked={false}
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