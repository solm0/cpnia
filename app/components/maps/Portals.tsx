import { RigidBody } from "@react-three/rapier";
import { gamePortals } from "@/app/lib/data/gamePortals";
import GamePortalLayout from "./interfaces/GamePortalLayout";
import HomePortalLayout from "./interfaces/HomePortalLayout";
import PlaceHolder from "../util/PlaceHolder";

export default function Portals({
  worldKey,
}: {
  worldKey: string;
}) {
  return (
    <>
      {/* 게임 포탈 */}
      {gamePortals[worldKey].map(game => 
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

      {/* 홈 포탈 */}
      <RigidBody
        position={[15,0,-5]}
        rotation={[0,0,0]}
        type="fixed"
      >
        <HomePortalLayout label="첫화면으로">
          <PlaceHolder />
        </HomePortalLayout>
      </RigidBody>
    </>
  )
}