const scale = 1;
const center = [0,0,0];

export const stagePositions: Record<string, {
  x:number, y:number, z:number, scale: number;
}> = {
  card: {
    x: scale * center[0] - scale * 50,
    y: scale * center[1] - scale * 230,
    z: scale * center[2] + scale * 100,
    scale: scale * 4.5
  },
  pachinko: {
    x: scale * center[0] + scale * 120,
    y: scale * center[1] - scale * 134.5,
    z: scale * center[2] + scale * 160,
    scale: scale * 2.4
  },
  roulette: {
    x: scale * center[0] + scale * 1,
    y: scale * center[1] - scale * 1.9,
    z: scale * center[2] - scale * 180,
    scale: scale * 8
  },
}