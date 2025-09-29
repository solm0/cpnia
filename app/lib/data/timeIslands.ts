interface timeIslandProp {
  scale: number;
  position: [number, number, number];
  rotation: [number, number, number];
}
export const timeIsland: Record<string, timeIslandProp[]> = {
  roulette1: [
    {
      scale: 0.005,
      position: [50,-30,-50],
      rotation: [0,0,0]
    },
    {
      scale: 0.005,
      position: [-50,-40,-50],
      rotation: [0,0,0]
    },
    {
      scale: 0.005,
      position: [0,-50,0],
      rotation: [0,0,0]
    },
  ],
  roulette2: [
   
  ],
}