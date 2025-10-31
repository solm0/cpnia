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
        stagePositions.roulette.y + 1.5,
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
      rule: '페퍼로니 피자를 만들어요! wasd로 조작하고 space로 클릭해 피자안에 넣으세요, 이미 던진 곳에 또 던지면 안돼요!',
    },
    {
      label: 'game 3',
      gameKey: 'game3',
      rule: '떨고 있는 도망자를 설득해서 피자로 데려오세요.',
      position: [241, -8.5,-78.8], // 104, -71, -254.3
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
      rule: '알아서 잘 해보세요',
      position: [-10, 3, 0],
      rotation: [0, 0, 0]
    },
    {
      label: 'game 2',
      gameKey: 'game2',
      rule: '알아서 잘 해보세요',
      position: [0, 3, -3],
      rotation: [0, 0, 0]
    },
    {
      label: 'game 3',
      gameKey: 'game3',
      rule: '알아서 잘 해보세요',
      position: [10, 3, 0],
      rotation: [0, 0, 0]
    },
  ]
}