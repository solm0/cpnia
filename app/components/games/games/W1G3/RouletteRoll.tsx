import Model from "@/app/components/util/Model";
import { SurfaceHelper } from "../W2G2/SurfaceHelper";
import { Vector3 } from "three";
import RouletteNumbers from "./RouletteNumbers";
import { useEffect, useMemo, useState } from "react";

export default function RouletteRoll({
  n, betNum
}: {
  n: number;
  betNum: number;
}) {
  const [success, setSuccess] = useState<boolean | null>(null);

  const roulettePos = [0, 0, 0] as [number, number, number]
  const rouletteScale = 0.02
  const rouletteSurface = {
    center: new Vector3(
      roulettePos[0],
      roulettePos[1] + rouletteScale * 60,
      roulettePos[2],
    ),
    normal: new Vector3(0, 1, 0).normalize(),
    radius: rouletteScale * 2000
  }

  const numWithAngle = useMemo(() => {
    const unitAngle = 360 / n;

    // Make shuffled order 1–n
    const shuffled = Array.from({ length: n }, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5);

    // Assign evenly spaced angle slots to each number
    return shuffled.map((num, i) => ({
      num,
      angle: i * unitAngle,
    }));
  }, [n]);

  // 랜덤 숫자 뽑기
  useEffect(() => {
    const winningNum = Math.floor(Math.random() * n) + 1;
    setSuccess(winningNum === betNum);
  }, []);

  return (
    <>
      {/* 룰렛 */}
      <Model
        src="/models/roulette.gltf"
        scale={rouletteScale}
        position={roulettePos}
      />
      <SurfaceHelper
        center={rouletteSurface.center}
        normal={rouletteSurface.normal}
        radius={rouletteSurface.radius}
        color="red"
      />
      <RouletteNumbers
        numWithAngle={numWithAngle}
        center={rouletteSurface.center}
        distance={rouletteSurface.radius - 12}
      />

      {/* 공 */}

      {/* ui */}
      

      {/* 빛 */}
      <directionalLight intensity={3} position={[0,8,0]} color={'white'} />
      <ambientLight intensity={0.5} color={'white'} />
    </>
  )
}