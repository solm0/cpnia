import { stagePositions } from "@/app/components/maps/time/TimeMap";

export interface coinStairProp {
  top: [number,number,number];
  bottom: [number, number, number];
  count: number;
}

export const coinStairs: coinStairProp[] = [
  {
    // 1-2
    top: [
      stagePositions.pachinko.x-50,
      stagePositions.pachinko.y+40,
      stagePositions.pachinko.z+10
    ],
    bottom: [
      stagePositions.card.x+30,
      stagePositions.card.y+40,
      stagePositions.card.z
    ],
    count: 5,
  },
  // 2-3
  {
    top: [
      stagePositions.roulette.x,
      stagePositions.roulette.y+1.4,
      stagePositions.roulette.z+37
    ],
    bottom: [
      stagePositions.pachinko.x-40,
      stagePositions.pachinko.y+27.5,
      stagePositions.pachinko.z-20
    ],
    count: 10,
  },
]