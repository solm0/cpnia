import { center, mapScale } from "@/app/components/maps/entropy/entropyPos";
import { stagePositions } from "./stagePositions";

export interface gamePortalProp {
  label: string;
  gameKey: string;
  position?: [number, number, number];
  rotation?:  [number, number, number];
  size?: [number, number, number];
  model?: string;
  scale?: number;
  rule?: string;
  type?: string;
  radius?:number,
  labelYPos?: number; // gamePortalLabel 높이
}

// collision계산하려면 rotation, position,size있어야됨.
// 맵에 렌더하려면 model있어야됨.

export const gamePortals: Record<string, gamePortalProp[]> = {
  time: [
    {
      label: 'game 1',
      gameKey: 'game1',
      rule: '알아서 잘 해보세요',
    },
    {
      label: 'game 2',
      gameKey: 'game2',
      rule: '알아서 잘 해보세요',
    },
    {
      label: 'game 3',
      gameKey: 'game3',
      rule: '알아서 잘 해보세요',
      position: [
        stagePositions.roulette.x - 42,
        stagePositions.roulette.y + 5,
        stagePositions.roulette.z + 20
      ],
      rotation: [0, 0, 0],
      scale: 10,
      model: '/models/ball.gltf',
      labelYPos: 10,
    },
  ],
  sacrifice: [
    {
      label: 'game 1',
      gameKey: 'game1',
      rule: '피자 재료가 아닌 주민을 찾아 공격하세요.',
    },
    {
      label: 'game 2',
      gameKey: 'game2',
      rule: '페퍼로니 피자를 만들어요! 새총의 위치를 조정해 피자 안에 던지세요.',
    },
    {
      label: 'game 3',
      gameKey: 'game3',
      rule: '피자가 되기 싫어 파프리카 한 명이 도망쳐 숨었습니다. 그를 찾으세요. 그리고 설득하세요.',
      position: [241, -8.5,-78.8],
      rotation: [0, 0, 0],
      scale: 0.35,
      model: '/models/door.glb',
      labelYPos: 45,
    },
  ],
  entropy: [
    {
      label: 'game 1',
      gameKey: 'game1',
      position: [
        center.x - 55 * mapScale,
        center.y,
        center.z - 70
      ],
      rotation: [0, 0, 0],
      model: '/models/core.glb',
      scale: 180 * mapScale,
      labelYPos: 30 * mapScale,
    },
    {
      label: 'game 2',
      gameKey: 'game2',
      position: [
        center.x + 86 * mapScale,
        center.y,
        center.z -2 * mapScale,
      ],
      rotation: [0, 0, 0],
      model: '/models/core.glb',
      scale: 200 * mapScale,
      labelYPos: 30 * mapScale,
    },
    {
      label: 'game 3',
      gameKey: 'game3',
      position: [
        center.x - 33 * mapScale,
        center.y,
        center.z + 42 * mapScale
      ],
      rotation: [0, 0, 0],
      model: '/models/core.glb',
      scale: 140 * mapScale,
      labelYPos: 30 * mapScale,
    },
  ]
}