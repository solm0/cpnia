import PlaceHolder from "@/app/components/models/PlaceHolder";
import Scene from "@/app/components/util/Scene"
import EntropyMap from "./EntropyMap";
import TimeMap from "./TimeMap";
import SacrificeMap from "./SacrificeMap";
import { gameIcons } from "@/app/lib/data/gameIcons";
import GameIcon from "../interfaces/GameIcon";
import Button from "../util/Button";
import { useRouter } from "next/navigation";
import { Html } from "@react-three/drei";

export default function WorldHome({
  worldKey,
}: {
  worldKey: string;
}) {
  const router = useRouter();

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
      {gameIcons[worldKey].map(game => 
        <GameIcon
          key={game.id}
          label={game.label}
          worldKey={worldKey}
          gameKey={game.id}
          position={game.position}
          rotation={game.rotation}
        />
      )}
      <Html>
        <Button
          onClick={() => router.push('/')}
          label="첫화면으로"
        />
      </Html>

      {/* 개별 부분: 맵 */}
      {map}
    </Scene>
  )
}