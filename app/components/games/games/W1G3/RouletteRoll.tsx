import Model from "@/app/components/util/Model";

export default function RouletteRoll() {
  const roulettePos = [0, 0, 0] as [number, number, number]
  const rouletteScale = 0.02

  return (
    <>
      {/* 룰렛 */}
      <Model
        src="/models/roulette.gltf"
        scale={rouletteScale}
        position={roulettePos}
      />

      {/* 공 */}

      {/* 숫자 */}

      {/* 빛 */}
      <directionalLight intensity={3} position={[0,8,0]} color={'white'} />
      <ambientLight intensity={0.5} color={'white'} />
    </>
  )
}