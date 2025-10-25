import Scene from "../../util/Scene";
import GameMenu from "../interfaces/GameMenu";
import { RefObject, useEffect, useRef, useState } from "react";
import Debris from "./W3G3/Debris";
import { Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Bloom, BrightnessContrast, ChromaticAberration, DepthOfField, EffectComposer, Glitch, HueSaturation, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction, GlitchMode } from 'postprocessing'
import { Physics, RigidBody } from "@react-three/rapier";
import { Quaternion, Vector3 } from "three";
import Player from "./W3G3/Player";
import FullScreenModal from "../../util/FullScreenModal";
import Button from "../../util/Button";
import { useTimerRef } from "./W3G3/useTimerRef";
import { useFrame } from "@react-three/fiber";
import { PlayerData } from "./W3G2";
import { Group } from "three";
import { PosHelper } from "./W2G2/AnchorHelper";

function GameScene({
  onGameEnd, timerRef,
}: {
  onGameEnd: (success: boolean) => void;
  timerRef: RefObject<{
    startTime: number;
    elapsed: number;
    running: boolean;
  }>;
}) {
  const healthRef = useRef(10);
  const exitPos = new Vector3(500, 500, -500);

  const initialPlayer = {
    position: new Vector3(0,0,0),
    rotation: new Quaternion()
  }
  const playerRef = useRef<PlayerData>(initialPlayer);
  const arrowRef = useRef<Group>(null);

  function CollideDebris() {
    healthRef.current -= 1;
    // 빨간 필터
  }

  useFrame(() => {
    if (timerRef.current.running) {
      timerRef.current.elapsed = (performance.now() - timerRef.current.startTime) / 1000;
    }

    // 화살표 방향 업데이트
    if (!arrowRef.current) return;

    const playerPos = playerRef.current.position;
    const dir = new Vector3().subVectors(exitPos, playerPos); // exit - player
    const dist = dir.length();
    if (dist < 0.001) return;
    dir.normalize();

    // 화살 위치: 플레이어 앞으로 5 단위 지점
    const arrowPos = playerPos.clone().add(dir.clone().multiplyScalar(5));
    arrowRef.current.position.copy(arrowPos);

    // 로컬 forward 축을 무엇으로 했나에 따라 아래 값을 바꿔라.
    // 위 예제에서는 로컬 +Y를 '앞'으로 사용했다.
    const localForward = new Vector3(0, 1, 0); // 그룹의 '앞' 축
    const targetDir = dir.clone(); // 씬에서 바라봐야 할 단위 방향

    // setFromUnitVectors(a, b) 는 a 축이 b 축과 일치하도록 회전 행렬을 만든다.
    const q = new Quaternion().setFromUnitVectors(localForward, targetDir);

    // 적용
    arrowRef.current.quaternion.copy(q);

    // 크기: 거리 기반
    arrowRef.current.scale.setScalar(Math.min(dist / 50, 1));
  })

  return (
    <>
      {/* <Planes /> */}
      <Physics gravity={[0, 0.04, 0]}>

        {/* 엔트로피 파편 */}
        <Debris
          scale={8}
          position={new Vector3(
            Math.random() * 10 - 5,
            Math.random() * 10 - 5,
            Math.random() * 10 - 5
          )}
        />

        {/* 출구 */}

        {/* 출구 위치 표시 */}
        <Html
          position={exitPos}
          center
          className="w-20 h-10 bg-amber-500"
        >
          <div>출구는 여기에</div>
        </Html>

        <PosHelper
          pos={exitPos}
          size={100}
          color="red"
        />

        <group ref={arrowRef}>
          {/* 몸통: 원점에서 +Y 쪽으로 올라가게 길이 2, center가 그룹 origin보다 위로 오게 설정 */}
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
            <meshStandardMaterial color="yellow" transparent opacity={0.8} />
          </mesh>

          {/* 머리: 몸통 끝(= +Y 방향)에 위치 */}
          <mesh position={[0, 2, 0]}>
            <coneGeometry args={[0.3, 0.8, 8]} />
            <meshStandardMaterial color="orange" emissive="orange" />
          </mesh>
        </group>
        
        <directionalLight intensity={10} position={[10,50,10]} />
      
        <Player playerRef={playerRef} />
      </Physics>
    </>
  )
}

export default function W3G3({
  worldKey, gameKey, onGameEnd
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
}) {
  const [hasStarted, setHasStarted] = useState(false);
  const { timerRef, start } = useTimerRef();
  
  return (
    <main className="w-full h-full">
      {/* 게임 */}
      <Scene>
        <GameScene
          onGameEnd={onGameEnd}
          timerRef={timerRef}
        />

        <Environment files={'/hdri/cloudSky.hdr'} background={true} environmentIntensity={0.05} />
        <EffectComposer>
          <HueSaturation saturation={0.8} opacity={1} />
          <DepthOfField focusDistance={0} focalLength={0.3} bokehScale={8} height={480} />
          <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.02} height={300} blendFunction={BlendFunction.ADD} />
          <Noise opacity={0.2} />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL} // blend mode
            offset={[0.001, 0.001]} // color offset
          />
        </EffectComposer>
      </Scene>

      {/* 게임 인터페이스 */}
      {!hasStarted &&
        <FullScreenModal>
          <p>난 시민권을 원했지, 여기서 엔트로피 조각에 맞아 죽는 걸 원하진 않았어! 이 무질서로부터 도망쳐야겠어.</p>
          <Button
            onClick={() => {
              setHasStarted(true);
              start();
            }}
            label="시작하기"
            worldKey={worldKey}
            autoFocus={true}
          />
        </FullScreenModal>
      }
    </main>
  )
}