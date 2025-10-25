import Scene from "../../util/Scene";
import { RefObject, useRef, useState } from "react";
import Debris from "./W3G3/Debris";
import { Environment, Html, useGLTF } from "@react-three/drei";
import { Bloom, ChromaticAberration, DepthOfField, EffectComposer, HueSaturation, Noise, } from "@react-three/postprocessing";
import { BlendFunction } from 'postprocessing'
import { Physics, RigidBody } from "@react-three/rapier";
import { Color, Quaternion, Vector3 } from "three";
import Player from "./W3G3/Player";
import FullScreenModal from "../../util/FullScreenModal";
import Button from "../../util/Button";
import { useTimerRef } from "./W3G3/useTimerRef";
import { useFrame } from "@react-three/fiber";
import { PlayerData } from "./W3G2";
import { Group } from "three";
import { PosHelper } from "./W2G2/AnchorHelper";
import DebrisPool from "./W3G3/DebrisPool";
import Planes from "./W3G3/Planes";

interface Config {
  crowd: number,
  debris: number,
  lines: string[],
  lineStyle: string,
  lineTerm: number,
}

function GameScene({
  onGameEnd, timerRef, healthRef,
}: {
  onGameEnd: (success: boolean) => void;
  timerRef: RefObject<{
    startTime: number;
    elapsed: number;
    running: boolean;
  }>;
  healthRef: RefObject<number>;
}) {
  const length = 500;
  const exitPos = new Vector3(length, length, -length);
  const avatar = useGLTF('/models/avatars/default.glb').scene;

  const initialPlayer = {
    position: new Vector3(0,0,0),
    rotation: new Quaternion()
  }
  const playerRef = useRef<PlayerData>(initialPlayer);
  const arrowRef = useRef<Group>(null);

  function CollideDebris() {
    healthRef.current -= 1;
    console.log(healthRef.current)
    // 빨간 필터

    if (healthRef.current <= 0) {
      onGameEnd(false);
    }
  }

  const phaseRef = useRef(0);
  const [phase, setPhase] = useState(0);

  const phaseConfig: Config[] = [
    {
      crowd: 5, // 한 구역(플레이어로부터 x,y,x축으로 +10 -10 거리 안에) 5명의 관중.
      // 이 구역에서 벗어난 개체는 삭제되고 playerRef로 인해 업데이트된 구역 안에 새로운 개체가 생긴다.
      // 한 번 생긴 개체는 삭제되기 전까지 임의로 position rotation이 수정되지 않지만 중력의 영향은 받는다.
      debris: 5, // 파편의 갯수. 위와 같음.
      lines: ['우리의 구원자!', '해방자!', '영웅!', '무질서의 수호자!', '자유의 화신!'],
      // lineTerm에 한 번씩, 관중 중 랜덤한 CrowdRef[?].current.line
      lineStyle: 'bg-white text-black px-2',
      lineTerm: 1 // 1초에 한 번씩 대사가 나타남
    },
    {
      crowd: 5,
      debris: 7,
      lines: ['그런데 왜 도망쳐?', '설마 죽음이 무서운 거야?', '죽음이야말로 가장 숭고한 무질서라고!', '무질서로부터 도망치지 마!'],
      lineStyle: 'bg-black text-white px-2 text-lg',
      lineTerm: 2,
    },
    {
      crowd: 10,
      debris: 10,
      lines: ['배신자다!', '무질서를 버리다니!', '무질서를 온몸으로 수용해!', '자연스러운 엔트로피의 확산을 거스르지 마!', '생명도 갑갑한 질서일 뿐, 생명 유지의 욕구는 부질없어!'],
      lineStyle: 'bg-blue text-white px-2',
      lineTerm: 0.3,
    }
  ]

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
    if (timerRef.current.elapsed >= 10 && phaseRef.current === 0) {
      phaseRef.current = 1;
      setPhase(1);
    } else if (timerRef.current.elapsed >= 20 && phaseRef.current === 1) {
      phaseRef.current = 2;
      setPhase(2);
    }
    
    // if (timerRef.current.elapsed <= 10) {
    //   const config = phaseConfig[phase];
    // }

    // --- crowdRef line 업데이트 ---
    // TODO. 나중에
  })

  return (
    <>
      {/* <Planes /> */}
      <Physics gravity={[0, 7, 0]}>
        <DebrisPool playerRef={playerRef} count={150} radius={150} collideDebris={CollideDebris} />

        <RigidBody type="fixed">
          <primitive
            scale={1}
            object={avatar.clone()}
            position={new Vector3(
              Math.random() * (length - 0),
              Math.random() * (length - 0),
              Math.random() * (-length - 0),
            )}
          />
        </RigidBody>
        <RigidBody type="fixed">
          <primitive
            scale={1}
            object={avatar.clone()}
            position={new Vector3(
              Math.random() * (length - 0),
              Math.random() * (length - 0),
              Math.random() * (-length - 0),
            )}
          />
        </RigidBody>
        <RigidBody type="fixed">
          <primitive
            scale={1}
            object={avatar.clone()}
            position={new Vector3(
              Math.random() * (length - 0),
              Math.random() * (length - 0),
              Math.random() * (-length - 0),
            )}
          />
        </RigidBody>
        <RigidBody type="fixed">
          <primitive
            scale={1}
            object={avatar.clone()}
            position={new Vector3(
              Math.random() * (length - 0),
              Math.random() * (length - 0),
              Math.random() * (-length - 0),
            )}
          />
        </RigidBody>
        <RigidBody type="fixed">
          <primitive
            scale={1}
            object={avatar.clone()}
            position={new Vector3(
              Math.random() * (length - 0),
              Math.random() * (length - 0),
              Math.random() * (-length - 0),
            )}
          />
        </RigidBody>
        <RigidBody type="fixed">
          <primitive
            scale={1}
            object={avatar.clone()}
            position={new Vector3(
              Math.random() * (length - 0),
              Math.random() * (length - 0),
              Math.random() * (-length - 0),
            )}
          />
        </RigidBody>

        
        <Debris
          scale={15}
          position={new Vector3(
            Math.random() * (length - 0),
            Math.random() * (length - 0),
            Math.random() * (-length - 0),
          )}
        />
        <Debris
          scale={15}
          position={new Vector3(
            Math.random() * (length - 0),
            Math.random() * (length - 0),
            Math.random() * (-length - 0),
          )}
        />
        <Debris
          scale={15}
          position={new Vector3(
            Math.random() * (length - 0),
            Math.random() * (length - 0),
            Math.random() * (-length - 0),
          )}
        />
        <Debris
          scale={15}
          position={new Vector3(
            Math.random() * (length - 0),
            Math.random() * (length - 0),
            Math.random() * (-length - 0),
          )}
        />
        <Debris
          scale={15}
          position={new Vector3(
            Math.random() * (length - 0),
            Math.random() * (length - 0),
            Math.random() * (-length - 0),
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

        {/* <PosHelper
          pos={exitPos}
          size={100}
          color="red"
        /> */}

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
  const healthRef = useRef(10);

  const color = new Color();
  const ratio = Math.min(healthRef.current / 10, 1);

  const barColor = color
    .setHex(0xff3333)
    .lerp(new Color(0x33ff66), ratio)
    .getStyle(); // CSS용 색상 문자열
  
  return (
    <main className="w-full h-full">
      {/* 게임 */}
      <Scene>
        <GameScene
          onGameEnd={onGameEnd}
          timerRef={timerRef}
          healthRef={healthRef}
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

      <div className="absolute top-8 left-8 w-72 h-10 border-2 border-white rounded-full bg-white overflow-hidden">
        <div
          style={{
            width: `${ratio * 100}%`,
            height: "100%",
            background: barColor,
            transition: "width 0.1s linear, background 0.1s linear",
          }}
        />
      </div>
    </main>
  )
}