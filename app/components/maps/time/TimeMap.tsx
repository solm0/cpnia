import { timeIsland } from "@/app/lib/data/timeIslands"
import ClonedModel from "../../util/ClonedModels"
import CoinStairs from "./CoinStairs";
import PachinkoCircle from "./PachinkoCircle";

export default function TimeMap() {
  const rouletteIslands1 = timeIsland['roulette1'];

  return (
    <>
      {/* Stage 1. 카드 */}

      {/* Stage 2. 파친코 */}
      <ClonedModel
        src="/models/coin.gltf"
        scale={0.01}
        position={[80,-100,50]}
        rotation={[0,0,0]}
      />

      <PachinkoCircle
        count={8}
        distance={24}
        center={[80,-97,50]}
      />

      {/* Stage 3. 룰렛 */}
      <ClonedModel
        src="/models/roulette.gltf"
        scale={0.02}
        position={[0,-1.4,-37]}
        rotation={[0,0,0]}
      />

      {rouletteIslands1.map((island, idx) => 
        <ClonedModel
          key={idx}
          src="/models/roulette.gltf"
          scale={island.scale}
          position={island.position}
          rotation={island.rotation}
        />
      )}

      {/* 계단 */}
      <CoinStairs
        endPosition={[-100,-130,50]}
        startPosition={[50,-100,50]}
        count={10}
      />
      <CoinStairs
        endPosition={[50,-107,40]}
        startPosition={[-20,0,10]}
        count={10}
      />
    </>
  )
}