import Scene from "../../util/Scene";
import GameMenu from "../interfaces/GameMenu";
import { useRef, useState } from "react";
import { FugitiveLineModal } from "../../maps/interfaces/NpcLineModals";
import { Object3D } from "three";
import { useGLTF } from "@react-three/drei";
import AudioPlayer from "../../util/AudioPlayer";
import { GameScene } from "./W2G3/GameScene";

useGLTF.preload('/models/w2g3map.gltf');
export default function W2G3({
  worldKey, gameKey, onGameEnd, avatar
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
  avatar: Object3D;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
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
        <GameScene setIsOpen={setIsOpen} avatar={avatar} />
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

      <AudioPlayer src={`/audio/sacrifice_bg.mp3`} audioRef={audioRef} />
    </main>
  )
}