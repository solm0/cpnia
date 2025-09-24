export interface chatNpcProp {
  name: string;
  world: string;
  position: [number, number, number];
  rotation: [number, number, number];
}
export const chatNpcs: Record<string, chatNpcProp> = {
  time: {
    name: '티모',
    world: '시간기반체제',
    position: [0,0,10],
    rotation: [0, Math.PI, 0],
  },
  sacrifice: {
    name: '조르다',
    world: '희생기반체제',
    position: [0,0,10],
    rotation: [0, Math.PI, 0],
  },
  entropy: {
    name: '페르디',
    world: '엔트로피체제',
    position: [0,0,10],
    rotation: [0, Math.PI, 0],
  }
}