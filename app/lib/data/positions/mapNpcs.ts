import { stagePositions } from "./stagePositions";

export interface mapNpcProp {
  name: string;
  position: [number, number, number];
  rotation:  [number, number, number];
  size?: [number, number, number];
  scale?: number;
  type?: string; // circle이면 안됨. clampToBoundary 참고
  radius?:number,
}
export const mapNpcs: Record<string, mapNpcProp[]> = {
  time: [
    {
      name: '루카',
      position: [-8,0,5],
      rotation: [0, Math.PI ,0],
    },
    {
      name: '마야',
      position: [-3,0,5],
      rotation: [0, Math.PI ,0],
    },
    {
      name: '니코',
      position: [2,0,5],
      rotation: [0, Math.PI ,0],
    },
    {
      name: '카드게임장에서 발견한 주민',
      position: [
        stagePositions.card.x - 10,
        stagePositions.card.y + stagePositions.card.scale * 22,
        stagePositions.card.z
      ],
      rotation: [0, 0 ,0],
      type: 'special',

    },
    {
      name: '파친코 앞에서 발견한 주민',
      position: [
        stagePositions.pachinko.x - 10,
        stagePositions.pachinko.y + stagePositions.pachinko.scale * 18,
        stagePositions.pachinko.z + 30
      ],
      rotation: [0, 0 ,0],
      type: 'special',

    },
  ],
  sacrifice: [
    {
      name: '로미',
      position: [-8,0,5],
      rotation: [0, Math.PI ,0],
    },
    {
      name: '아리',
      position: [-3,0,5],
      rotation: [0, Math.PI ,0],
    },
    {
      name: '노아',
      position: [2,0,5],
      rotation: [0, Math.PI ,0],
    },
    {
      name: '피자커팅기',
      position: [30,0,0],
      rotation: [0,0, 0],
      scale: 2,
      type: 'special',
    },
  ],
  entropy: [
    {
      name: '니아',
      position: [-8,0,5],
      rotation: [0, Math.PI ,0],
    },
    {
      name: '루벤',
      position: [-3,0,5],
      rotation: [0, Math.PI ,0],
    },
    {
      name: '밀라',
      position: [2,0,5],
      rotation: [0, Math.PI ,0],
    },
  ]
}