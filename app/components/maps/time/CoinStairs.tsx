import ClonedModel from "../../util/ClonedModels";

export default function CoinStairs({
  startPosition, endPosition, count = 10
}: {
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  count?: number;
}) {
  const xLength = endPosition[0] - startPosition[0];
  const yLength = endPosition[1] - startPosition[1];
  const zLength = endPosition[2] - startPosition[2];
  const xDistance = xLength/count;
  const yDistance = yLength/count;
  const zDistance = zLength/count;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const x = startPosition[0] + xDistance * i;
        const y = startPosition[1] + yDistance * i;
        const z = startPosition[2] + zDistance * i;
        const position: [number, number, number]=[x, y, z]

        return (
          <ClonedModel
            key={i}
            src="/models/coin.gltf"
            scale={0.001}
            position={position}
          />
        )
      })}
    </>
  )
}