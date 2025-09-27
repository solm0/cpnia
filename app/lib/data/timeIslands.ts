interface timeIslandProp {
  scale: number;
  position: [number, number, number];
  rotation: [number, number, number];
}
export const timeIsland: Record<string, timeIslandProp[]> = {
  coinStair1: [

  ],
  coinStair2: [
    
  ],
  pachinko: [
    {
      scale: 0.6,
      position: [-30,0,0],
      rotation: [0,0,0]
    },
    {
      scale: 0.6,
      position: [-20,0,0],
      rotation: [0,0,0]
    },
    {
      scale: 0.6,
      position: [-10,0,0],
      rotation: [0,0,0]
    },
    {
      scale: 0.6,
      position: [0,0,0],
      rotation: [0,0,0]
    },
    {
      scale: 0.6,
      position: [10,0,0],
      rotation: [0,0,0]
    },
    {
      scale: 0.6,
      position: [20,0,0],
      rotation: [0,0,0]
    },
    {
      scale: 0.6,
      position: [30,0,0],
      rotation: [0,0,0]
    },
    {
      scale: 1,
      position: [40,0,0],
      rotation: [0,0,0]
    },
  ],
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