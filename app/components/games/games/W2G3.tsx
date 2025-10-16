import Scene from "../../util/Scene";
import GameMenu from "../interfaces/GameMenu";
import { useState } from "react";
import CameraController from "./W2G1/CameraController";
import { FugitiveLineModal } from "../../maps/interfaces/NpcLineModals";
import Fugitive from "./W2G3/Fugitive";

export default function W2G3({
  worldKey, gameKey, onGameEnd
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
}) {
  // 게임마다 다른 게임 상태 저장. 점수만 Game으로 올려줌.
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  // 마지막 round의 답을 클릭할 때 gameOver하면서 score
  function gameOver(score: number) {
    if (score >= 9) {
      onGameEnd(true);
    } else {
      onGameEnd(false)
    }
  }
  
  const [isOpen, setIsOpen] = useState(false);

  // 라운드마다 다른 대사와 답변을 렌더, 콜백으로 setScore

  function handleAnswerClick(point: number, round: number) {
    const newScore = score + point
    setScore(newScore);
    
    if (round === 3) {
      gameOver(newScore);
    } else {
      setRound(prev => prev+1);
    }
  }
  
  return (
    <main className="w-full h-full">
      {/* 게임 */}
      <Scene>
        <group
          onClick={() => setIsOpen(true)}
        >
          <Fugitive />
        </group>


        {/* 카메라, 컨트롤 */}
        <CameraController />

        {/* 조명, 색 */}
        <directionalLight intensity={1} position={[20,10,30]} color={'white'} />
        <directionalLight intensity={2} position={[0,10,0]} color={'orange'} castShadow/>
        <color attach="background" args={["gray"]} />
      </Scene>

      {isOpen &&
        <div className="absolute top-2/3 w-screen h-auto">
          <FugitiveLineModal
            name="도망자"
            round={round}
            handleAnswerClick={handleAnswerClick}
            setIsOpen={setIsOpen}
          />
        </div>
      }

      {/* 게임 인터페이스 */}
      <GameMenu
        worldKey={worldKey}
        gameKey={gameKey}
        score={score}
      />
    </main>
  )
}