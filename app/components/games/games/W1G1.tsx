import Scene from "../../util/Scene";
import GameMenu from "../interfaces/GameMenu";
import { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { Object3D } from "three";
import Table from "./W1G1/Table";
import Ui from "./W1G1/Ui";

export interface gameRefProp {
  card: number | null,
  leftChips: number,
  betChips: number
}

export default function W1G1({
  worldKey, gameKey, onGameEnd
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
}) {
  // 모델 가져오기
  const cards: Record<number, Object3D> = {
    2: useGLTF('/models/card-2.gltf').scene,
    3: useGLTF('/models/card-3.gltf').scene,
    4: useGLTF('/models/card-4.gltf').scene,
    5: useGLTF('/models/card-5.gltf').scene,
    6: useGLTF('/models/card-6.gltf').scene,
    7: useGLTF('/models/card-7.gltf').scene,
    8: useGLTF('/models/card-8.gltf').scene,
    9: useGLTF('/models/card-9.gltf').scene,
    10: useGLTF('/models/card-10.gltf').scene,
  }
  const coin = useGLTF('/models/coin.gltf').scene;

  // 게임 진행상황
  const gameRef = useRef<gameRefProp[]>([
    // 0 === turn%2 => 플레이어
    {
      card: null,
      leftChips: 20,
      betChips: 0,
    },
    // 1 === turn%1 => npc
    {
      card: null,
      leftChips: 20,
      betChips: 0,
    }
  ]);
  const turn = useRef(0);
  const lastBetChipNum = useRef(1);
  const currentNum = useRef(lastBetChipNum.current); // 매 턴마다 초기화해야됨

  // 씬 전환 Pick -> Table
  const [hasPicked, setHasPicked] = useState(false);

  // 씬 설정
  // const { camera } = useThree();
  // useEffect(() => {
  //   camera.position.set(0,5,10);
  //   camera.rotation.set(0,0,0);
  //   camera.lookAt(0, 5, 0);
  // }, [camera]);

  const center = [-5,0,0] // ui를 위해 -x로 좀더 감


  function pickCard() {
    const keys = Object.keys(cards).map(Number);
    const [a, b] = keys.sort(() => 0.5 - Math.random()).slice(0, 2);
    gameRef.current[0].card = a;
    gameRef.current[1].card = b;
    setHasPicked(true);
  }

  return (
    <main className="w-full h-full">
      {/* 게임 */}
      <Scene>
        <Table
          hasPicked={hasPicked}
          gameRef={gameRef}
          turn={turn}
          currentNum={currentNum}
        />
      </Scene>

      {/* 게임 인터페이스 */}
      <Ui
        hasPicked={hasPicked}
        pickCard={pickCard}
        gameRef={gameRef}
        turn={turn}
        lastBetChipNum={lastBetChipNum}
        currentNum={currentNum}
      />
      <GameMenu
        worldKey={worldKey}
        gameKey={gameKey}
      />
    </main>
  )
}