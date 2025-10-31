import { degToRad } from "three/src/math/MathUtils.js";
import { stagePositions } from "./stagePositions";

export interface mapNpcProp {
  name: string;
  position: [number, number, number];
  rotation:  [number, number, number];
  size?: [number, number, number];
  scale?: number;
  type?: string; // circle이면 안됨. clampToBoundary 참고
  radius?:number,
  labelPos?: [number, number, number],
}
export const mapNpcs: Record<string, mapNpcProp[]> = {
  time: [
    {
      name: '루카',
      position: [
        stagePositions.pachinko.x + stagePositions.pachinko.scale * 5,
        stagePositions.pachinko.y + stagePositions.card.scale * 9.8,
        stagePositions.pachinko.z + stagePositions.pachinko.scale * 8
      ],
      rotation: [Math.PI/2, 0 ,degToRad(-80)],
      scale: 9,
      labelPos: [0,0.5,-0.8],
    },
    {
      name: '마야',
      position: [
        stagePositions.pachinko.x - stagePositions.pachinko.scale * 9.5,
        stagePositions.pachinko.y + stagePositions.card.scale * 9.5,
        stagePositions.pachinko.z + stagePositions.pachinko.scale * 5.5
      ],
      rotation: [0, degToRad(105) ,0],
      scale: 9
    },
    {
      name: '니코',
      position: [
        stagePositions.pachinko.x + stagePositions.pachinko.scale * 8,
        stagePositions.pachinko.y + stagePositions.card.scale * 9.5,
        stagePositions.pachinko.z - stagePositions.pachinko.scale * 2
      ],
      rotation: [0, -Math.PI/2 ,0],
      scale: 9,
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
      name: '파친코 위에서 발견한 주민',
      position: [
        stagePositions.pachinko.x - 2,
        stagePositions.pachinko.y + stagePositions.pachinko.scale * 28.2,
        stagePositions.pachinko.z + 2.3
      ],
      rotation: [0, 0 ,0],
      type: 'special',
    },
  ],
  sacrifice: [
    {
      name: '로미',
      position: [180,0,-10],
      rotation: [0, Math.PI ,0],
    },
    {
      name: '아리',
      position: [60, 27, -10],
      rotation: [-Math.PI/2, 0, degToRad(160)],
      labelPos: [0, 0.5, 0.8],
    },
    {
      name: '노아',
      position: [100, 27, 5],
      rotation: [-Math.PI/2, 0, degToRad(-20)],
      labelPos: [0, 0.5, 0.8],
    },
    {
      name: '피자커팅기',
      position: [150, 0, -45],
      rotation: [0, degToRad(200), 0],
      scale: 2.4,
      type: 'special',
      labelPos: [-1.8, 13, 1],
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