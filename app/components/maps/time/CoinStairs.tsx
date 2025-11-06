import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import { MeshStandardMaterial, Object3D } from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { Mesh } from "three";
import { use3dFocusStore } from "@/app/lib/gamepad/inputManager";
import { stagePositions } from "@/app/lib/data/positions/stagePositions";
import { radToDeg } from "three/src/math/MathUtils.js";
import Button from "../../util/Button";

useGLTF.preload('/models/coin.gltf');

function SpinningCoin({
  position,
  scale,
  index,
  waveDelay = 0.2, // delay per coin
  rotationSpeed = Math.PI * 8, // 1 rotation per second
  breakTime = 10, // seconds between sets
  coin,
  handleClickStair, locked, idx
}: {
  position: [number, number, number];
  scale: number;
  index: number;
  waveDelay?: number;
  rotationSpeed?: number;
  breakTime?: number;
  coin: Object3D;
  handleClickStair: (clickedStair: number ) => void;
  locked: boolean;
  idx: number;
}) {
  const ref = useRef<Object3D>(null);
  const id = `time-stair-${idx}`;
  const focusedId = use3dFocusStore((s) => s.focusedObj?.id);
  const [isOpen, setIsOpen] = useState(false);

  coin.userData = {
    id: id,
    onClick: () => {
      handleClickStair(idx);
      // console.log(locked)
      // if (!locked) {
      //   handleClickStair(idx);
      // } else {
      //   setIsOpen(true);
      // }
    },
  }

  useMemo(() => {
    coin.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        mesh.castShadow = mesh.receiveShadow = true;
        mesh.material = (mesh.material as MeshStandardMaterial).clone();
  
        const mat = mesh.material as MeshStandardMaterial;
        mat.onBeforeCompile = (shader) => {
          shader.uniforms.uHighlight = { value: 0 };
  
          shader.fragmentShader = `
            uniform float uHighlight;
          ` + shader.fragmentShader;
  
          shader.fragmentShader = shader.fragmentShader.replace(
            `#include <dithering_fragment>`,
            `
              #include <dithering_fragment>
              if (uHighlight > 0.5) {
                gl_FragColor.rgb += vec3(0.2, 0.2, 0.2);
              }
            `
          );
  
          mesh.userData.shader = shader;
        };
      }
    });
  }, [coin]);

  useMemo(() => {
    coin.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const shader = child.userData.shader;
        if (shader?.uniforms?.uHighlight) {
          shader.uniforms.uHighlight.value = focusedId === id ? 1 : 0;
        }
      }
    });
  }, [focusedId]);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.getElapsedTime();
    const cycleTime = 1 + breakTime; // spin duration + break
    const localTime = (t - index * waveDelay) % cycleTime;

    if (localTime >= 0 && localTime <= 1) {
      ref.current.rotation.x = localTime * rotationSpeed;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <primitive object={coin} scale={1} />
      {isOpen && (
        <Html distanceFactor={8} className="w-200" position={[0,2,0]}>
          <div className="w-400 text-wrap break-keep text-8xl leading-[1.7em] p-20 bg-[#ff000050] rounded-4xl backdrop-blur-2xl">
            느낌표 이미지가 달려 있는 npc를 클릭해 이번 스테이지의 게임을 먼저 하고 오세요!
          </div>
        </Html>
      )}
    </group>
  );
}

export default function CoinStairs({
  startPosition,
  endPosition,
  count = 10,
  coinScale = 3,
  handleClickStair,
  locked, idx
}: {
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  count?: number;
  coinScale: number;
  handleClickStair: (clickedStair: number ) => void;
  locked: boolean;
  idx: number;
}) {
  const xLength = endPosition[0] - startPosition[0];
  const yLength = endPosition[1] - startPosition[1];
  const zLength = endPosition[2] - startPosition[2];
  const xDistance = xLength / (count - 1);
  const yDistance = yLength / (count - 1);
  const zDistance = zLength / (count - 1);
  const coin = useGLTF('/models/coin.gltf').scene;

  const clonedCoins = useMemo(() => {
    return Array.from({ length: count }, () => clone(coin));
  }, [coin, count]);
  const coinAbove = useMemo(() => clone(coin), [coin]);

  return (
    <>
      <primitive
        object={coinAbove}
        scale={5}
        position={[stagePositions.pachinko.x, stagePositions.pachinko.y + 75, stagePositions.pachinko.z]}
        rotation={[radToDeg(60), 0, radToDeg(0)]}
      />
      {clonedCoins.map((coin, i) => {
        const x = startPosition[0] + xDistance * i;
        const y = startPosition[1] + yDistance * i;
        const z = startPosition[2] + zDistance * i;
        const position: [number, number, number] = [x, y, z];

        return (
          <SpinningCoin
            key={i}
            position={position}
            index={i}
            waveDelay={0.2} // stagger each coin
            breakTime={10}  // pause between sets
            coin={coin}
            scale={coinScale}
            handleClickStair={handleClickStair}
            // locked={locked}
            locked={false}
            idx={idx}
          />
        );
      })}
    </>
  );
}