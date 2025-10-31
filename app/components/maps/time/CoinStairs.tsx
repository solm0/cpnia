import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Object3D } from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

useGLTF.preload('/models/coin.gltf');

function SpinningCoin({
  position,
  scale,
  index,
  waveDelay = 0.2, // delay per coin
  rotationSpeed = Math.PI * 8, // 1 rotation per second
  breakTime = 10, // seconds between sets
  coin,
}: {
  position: [number, number, number];
  scale: number;
  index: number;
  waveDelay?: number;
  rotationSpeed?: number;
  breakTime?: number;
  coin: Object3D;
}) {
  const ref = useRef<Object3D>(null);

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
      <primitive object={coin} />
    </group>
  );
}

export default function CoinStairs({
  startPosition,
  endPosition,
  count = 10,
  coinScale = 3
}: {
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  count?: number;
  coinScale: number;
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

  return (
    <>
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
          />
        );
      })}
    </>
  );
}