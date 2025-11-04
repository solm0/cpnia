import Scene from "../../util/Scene";
import GameMenu from "../interfaces/GameMenu";
import { useRef, useState } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Object3D } from "three";
import Table from "./W1G1/Table";
import Ui from "./W1G1/Ui";
import AudioPlayer from "../../util/AudioPlayer";
import Model from "../../util/Model";
import { degToRad } from "three/src/math/MathUtils.js";
import { Bloom, DepthOfField, EffectComposer } from "@react-three/postprocessing";

export interface gameRefProp {
  card: number | null,
  leftChips: number,
  betChips: number
}

export default function W1G1({
  worldKey, gameKey, onGameEnd, avatar
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
  avatar: Object3D;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
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
  const card = useGLTF("/models/card.glb").scene;

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
  const minNum = useRef<number>(0);
  const currentNum = useRef<number | null>(null);

  // 씬 전환 Pick -> Table
  const [hasPicked, setHasPicked] = useState(false);

  function pickCard() {
    const keys = Object.keys(cards).map(Number);
    const [a, b] = keys.sort(() => 0.5 - Math.random()).slice(0, 2);
    gameRef.current[0].card = a;
    gameRef.current[1].card = b;
    setHasPicked(true);
    motionPhase.current = 'pick'
  }

  // npc의 베팅
  const npcWaitSec = 3000;

  // W1G1에서 npc의 생각 끝에, Ui에서 플레이어의 확인버튼 클릭 시 호출
  function bet(num: number, turn: number) {
    if (turn === 0) {
      gameRef.current[0].betChips += num;
      gameRef.current[0].leftChips -= num;
      gameRef.current[1].betChips += num;
      gameRef.current[1].leftChips -= num;
      minNum.current = num;
    } else if (turn % 2 === 0) {
      gameRef.current[0].betChips += num;
      gameRef.current[0].leftChips -= num;
    } else {
      gameRef.current[1].betChips += num;
      gameRef.current[1].leftChips -= num;
    }

    currentNum.current = num;
    console.log(currentNum.current)
  }

  const motionPhase = useRef<'idle' | 'pick' | 'bet' | 'npcFail' | 'npcWin'>('idle');

  return (
    <main className="w-full h-full">
      {/* 게임 */}
      <div className="w-full h-full">
        <Scene >
          <Table
            hasPicked={hasPicked}
            gameRef={gameRef}
            turn={turn}
            currentNum={currentNum}
            cards={cards}
            coin={coin}
            motionPhase={motionPhase}
          />
          <primitive
            object={card}
            scale={10}
            position={[0,-250,-300]}
            rotation={[0,degToRad(-40),0]}
          />

          <color attach="background" args={["#101010"]} />
          <EffectComposer>
            <DepthOfField focusDistance={0} focalLength={0.3} bokehScale={8} height={480} />
            <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.03} height={300} />
          </EffectComposer>
        </Scene>
      </div>

      {/* 게임 인터페이스 */}
      <div className="flex flex-col items-center justify-center gap-2 h-screen pointer-events-none absolute right-0 top-0 w-1/2">
        <Ui
          hasPicked={hasPicked}
          pickCard={pickCard}
          gameRef={gameRef}
          turn={turn}
          minNum={minNum}
          currentNum={currentNum}
          onGameEnd={onGameEnd}
          motionPhase={motionPhase}
          bet={bet}
          npcWaitSec={npcWaitSec}
          coin={coin}
          cards={cards}
        />
      </div>

      <AudioPlayer src={`/audio/time_bg.mp3`} audioRef={audioRef} />
    </main>
  )
}