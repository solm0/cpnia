export interface homePortalProp {
  position: [number, number, number];
  rotation: [number, number, number];
  size?: [number, number, number];
}
export const homePortals: Record<string, homePortalProp> = {
  time: {
    position: [0,0,10],
    rotation: [0, Math.PI, 0],
  },
  sacrifice: {
    position: [0,0,10],
    rotation: [0, Math.PI, 0],
  },
  entropy: {
    position: [0,0,10],
    rotation: [0, Math.PI, 0],
  }
}