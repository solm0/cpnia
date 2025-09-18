import { useGameStore } from "../../lib/state/gameState";
import Scene from "../util/Scene";
import PlaceHolder from "../models/PlaceHolder";
import { Html } from "@react-three/drei";

export default function MiniGame({
  worldId, miniGameId, label
}: {
  worldId: string;
  miniGameId: string;
  label: string;
}) {

  // 미니게임을 종료할 때마다 isWorldCompleted 를 확인해서 됐으면 certificate 페이지로 가게 해야됨.
  const completed = useGameStore((state) => state.worlds[worldId].miniGames[miniGameId]);
  const setMiniGame = useGameStore((state) => state.setMiniGame);

  return (
    <Scene>
      <PlaceHolder
        scale={1}
        position={[0, 3, 0]}
        rotation={[0, 0, 0]}
        label={label ?? ''}
      />
      <Html>
        <button
          onClick={() => setMiniGame(worldId, miniGameId, true)}
          className="text-center -translate-x-1/2 text-gray-700 px-2 py-1 break-keep w-auto h-auto bg-gray-200 hover:bg-gray-300 transition-colors duration-300"
        >
          {completed ? 'completed' : 'not completed'}
        </button>
      </Html>
    </Scene>
  )
}