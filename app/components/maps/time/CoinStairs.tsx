import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import ClonedModel from "../../util/ClonedModels";
import * as THREE from "three";

function SpinningCoin({
  position,
  scale = 0.001,
  index,
  waveDelay = 0.2, // delay per coin
  rotationSpeed = Math.PI * 8, // 1 rotation per second
  breakTime = 10 // seconds between sets
}: {
  position: [number, number, number];
  scale?: number;
  index: number;
  waveDelay?: number;
  rotationSpeed?: number;
  breakTime?: number;
}) {
  const ref = useRef<THREE.Object3D>(null);

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
    <group ref={ref} position={position} scale={[scale, scale, scale]}>
      <ClonedModel src="/models/coin.gltf" scale={1} position={[0, 0, 0]} />
    </group>
  );
}

export default function CoinStairs({
  startPosition,
  endPosition,
  count = 10
}: {
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  count?: number;
}) {
  const xLength = endPosition[0] - startPosition[0];
  const yLength = endPosition[1] - startPosition[1];
  const zLength = endPosition[2] - startPosition[2];
  const xDistance = xLength / count;
  const yDistance = yLength / count;
  const zDistance = zLength / count;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
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
          />
        );
      })}
    </>
  );
}