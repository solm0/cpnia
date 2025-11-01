import Scene from "../../util/Scene";
import { RefObject, useRef, useState } from "react";
import { Environment, Html } from "@react-three/drei";
import { Bloom, ChromaticAberration, DepthOfField, EffectComposer, HueSaturation, Noise, } from "@react-three/postprocessing";
import { BlendFunction } from 'postprocessing'
import { Physics } from "@react-three/rapier";
import { Object3D, Quaternion, Vector3 } from "three";
import Player from "./W3G3/Player";
import FullScreenModal from "../../util/FullScreenModal";
import Button from "../../util/Button";
import { useTimerRef } from "./W3G3/useTimerRef";
import { useFrame } from "@react-three/fiber";
import { PlayerData } from "./W3G2";
import { Group } from "three";
import DebrisPool from "./W3G3/DebrisPool";
import Health from "./W3G3/Health";
import CollisionOverlay from "./W3G3/CollisionOverlay";
import LinePool from "./W3G3/LinePool";

interface Config {
  lines: string[],
  lineStyle: string,
}

const phaseConfig: Config[] = [
  {
    lines: ['구원자!', '해방자!', '영웅!', '무질서의 수호자!'],
    lineStyle: 'bg-white text-black px-2',
  },
  {
    lines: ['그런데 왜 도망쳐?', '설마 죽음이 무서운 거야?', '죽음이야말로 완벽한 무질서라고!', '무질서로부터 도망치지 마!'],
    lineStyle: 'bg-black text-white px-2',
  },
  {
    lines: ['배신자다!', '무질서를 버리다니!', '자연스러운 엔트로피의 확산을 거스르지 마!', '생명도 질서일 뿐, 생명 유지의 욕구는 부질없어!'],
    lineStyle: 'bg-[#0000ff] text-white px-2',
  }
]

function GameScene({
  onGameEnd, timerRef, healthRef, avatar,
}: {
  onGameEnd: (success: boolean) => void;
  timerRef: RefObject<{
    startTime: number;
    elapsed: number;
    running: boolean;
  }>;
  healthRef: RefObject<number>;
  avatar: Object3D;
}) {
  const length = 500;
  const exitPos = new Vector3(length, length, -length);

  const initialPlayer = {
    position: new Vector3(0,0,0),
    rotation: new Quaternion()
  }
  const playerRef = useRef<PlayerData>(initialPlayer);
  const arrowRef = useRef<Group>(null);

  const [health, setHealth] = useState(10);
  const isColliding = useRef(false);
  const phaseRef = useRef(0);
  const [phase, setPhase] = useState(0);

  function CollideDebris() {
    healthRef.current -= 1;
    setHealth(prev => prev - 1);
    isColliding.current = true;

    console.log('ref', healthRef.current, 'state', health, 'isColliding', isColliding.current);

    if (healthRef.current <= 0) {
      onGameEnd(false);
    }
  }

  useFrame(() => {
    // --- 타이머 ---
    if (timerRef.current.running) {
      timerRef.current.elapsed = (performance.now() - timerRef.current.startTime) / length;
    }

    // --- 출구 위치 화살표 ---
    if (!arrowRef.current) return;

    const playerPos = playerRef.current.position;
    const dir = new Vector3().subVectors(exitPos, playerPos);
    const dist = dir.length();
    if (dist < 0.001) return;
    dir.normalize();

    // 화살 위치: 플레이어 앞으로 5 단위 지점
    const arrowPos = playerPos.clone().add(dir.clone().multiplyScalar(5));
    arrowRef.current.position.copy(arrowPos);

    const localForward = new Vector3(0, 1, 0); // 그룹의 '앞' 축
    const targetDir = dir.clone(); // 씬에서 바라봐야 할 단위 방향

    // setFromUnitVectors(a, b) 는 a 축이 b 축과 일치하도록 회전 행렬을 만든다.
    const q = new Quaternion().setFromUnitVectors(localForward, targetDir);
    arrowRef.current.quaternion.copy(q); // 적용
    arrowRef.current.scale.setScalar(Math.min(dist / 50, 5)); // 크기: 거리 기반

    // --- 게임 종료 ---
    if (dist < 5) {
      onGameEnd(true);
    }

    // --- crowdRef, debrisRef 정의, 추가, 삭제 ---
    if (timerRef.current.elapsed >= 20 && phaseRef.current === 0) {
      phaseRef.current = 1;
      setPhase(1);
    } else if (timerRef.current.elapsed >= 30 && phaseRef.current === 1) {
      phaseRef.current = 2;
      setPhase(2);
    }

    // --- crowdRef line 업데이트 ---
    // 플레이어를 둘러싸고 랜덤한 위치에 
  })

  return (
    <>
      {/* <Planes /> */}
      <Physics gravity={[0, 7, 0]}>
        {/* 조각들 */}
        <DebrisPool playerRef={playerRef} count={150} radius={150} collideDebris={CollideDebris} />

        {/* 대사들 */}
        <LinePool playerRef={playerRef} lines={phaseConfig[phase].lines} lineStyle={phaseConfig[phase].lineStyle} />

        {/* 필터 */}
        <CollisionOverlay isColliding={isColliding} playerRef={playerRef} />

        {/* 출구 */}
        <Html
          position={exitPos}
          center
          className="w-20 h-10 bg-amber-500"
        >
          <div>출구는 여기에</div>
        </Html>

        <group ref={arrowRef}>
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
            <meshStandardMaterial color="yellow" transparent opacity={0.8} />
          </mesh>
          <mesh position={[0, 2, 0]}>
            <coneGeometry args={[0.3, 0.8, 8]} />
            <meshStandardMaterial color="orange" emissive="orange" />
          </mesh>
        </group>
        
        <directionalLight intensity={10} position={[10,50,10]} />
      
        <Player playerRef={playerRef} avatar={avatar} />

      </Physics>
    </>
  )
}

export default function W3G3({
  worldKey, gameKey, onGameEnd, avatar
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
  avatar: Object3D;
}) {
  const [hasStarted, setHasStarted] = useState(false);
  const { timerRef, start } = useTimerRef();
  const healthRef = useRef(10);
  
  return (
    <main className="w-full h-full">
      {/* 게임 */}
      <Scene>
        <GameScene
          onGameEnd={onGameEnd}
          timerRef={timerRef}
          healthRef={healthRef}
          avatar={avatar}
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
            id={'tempId'}
          />
        </FullScreenModal>
      }


      <Health healthRef={healthRef} />

    </main>
  )
}