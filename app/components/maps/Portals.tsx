import { RigidBody } from "@react-three/rapier";
import { gamePortals } from "@/app/lib/data/positions/gamePortals";
import GamePortalLayout from "./interfaces/GamePortalLayout";
import PlaceHolder from "../util/PlaceHolder";

export default function Portals({
  worldKey,
}: {
  worldKey: string;
}) {
  const visibleGamePortals = gamePortals[worldKey].filter(portal => portal.position != null && portal.rotation != null);
  
  return (
    <>
      {/* 게임 포탈 */}
      {visibleGamePortals.map(game => 
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
          >
            <PlaceHolder />
          </GamePortalLayout>
        </RigidBody>
      )}
    </>
  )
}