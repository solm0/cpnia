import { Object3D } from "three";
import { useMemo } from "react";
import CrowdChar from "../../games/games/W2G2/CrowdChar";

export default function PizzaCrowd({
  gltfMap,
  center,
  radius,
}: {
  gltfMap: Record<string, Object3D>;
  center: [number, number, number];
  radius: number;
}) {
  const placed = useMemo(() => {
    const usedPositions: [number, number][] = [];
    const minDistance = 4; // 최소 거리 (겹치지 않게)
    const maxTries = 50; // 무한 루프 방지용

    return Object.entries(gltfMap).map(([key, model], index) => {
      let randomX = 0;
      let randomZ = 0;
      let tries = 0;

      // 랜덤한 점을 원 안에서 선택 (겹치지 않도록)
      do {
        const r = Math.sqrt(Math.random()) * radius * 0.9; // 중심에 덜 몰리게
        const theta = Math.random() * Math.PI * 2;
        randomX = center[0] + r * Math.cos(theta);
        randomZ = center[2] + r * Math.sin(theta);
        tries++;
      } while (
        usedPositions.some(
          ([x, z]) => Math.hypot(x - randomX, z - randomZ) < minDistance
        ) && tries < maxTries
      );

      usedPositions.push([randomX, randomZ]);

      return (
        <CrowdChar
          key={key}
          model={model}
          animTerm={(index + 1) * 1000}
          position={[randomX, center[1], randomZ]}
          scale={8}
        />
      );
    });
  }, [gltfMap, center, radius]);

  return <>{placed}</>;
}