export interface gamePortalProp {
  label: string;
  gameKey: string;
  gameName: string;
  gameIconUrl?: string;
  position?: [number, number, number];
  rotation?:  [number, number, number];
  size?: [number, number, number];
  model?: string;
  scale?: number;
}
export const gamePortals: Record<string, gamePortalProp[]> = {
  time: [
    {
      label: 'game 1',
      gameKey: 'game1',
      gameName: '카드게임에서 시간 따기',
      position: [-10, 3, 0],
      rotation: [0, 0, 0]
    },
    {
      label: 'game 2',
      gameKey: 'game2',
      gameName: '파친코에서 시간 따기',
      position: [10, 3, -3],
      rotation: [0, 0, 0]
    },
    {
      label: 'game 3',
      gameKey: 'game3',
      gameName: '룰렛에서 시간 따기',
      position: [10, 3, 0],
      rotation: [0, 0, 0]
    },
  ],
  sacrifice: [
    {
      label: 'game 1',
      gameKey: 'game1',
      gameName: '스파이 재료 골라내기',
    },
    {
      label: 'game 2',
      gameKey: 'game2',
      gameName: '주민 피자에 던지기',
    },
    {
      label: 'game 3',
      gameKey: 'game3',
      gameName: '도망자 데려오기',
      position: [241, -8.5,-78.8], // 104, -71, -254.3
      rotation: [0, 0, 0],
      scale: 0.35,
      model: '/models/door.glb'
    },
  ],
  entropy: [
    {
      label: 'game 1',
      gameKey: 'game1',
      gameName: '장애물 피하기',
      position: [-10, 3, 0],
      rotation: [0, 0, 0]
    },
    {
      label: 'game 2',
      gameKey: 'game2',
      gameName: '주민들의 말 거꾸로 입력하기',
      position: [0, 3, -3],
      rotation: [0, 0, 0]
    },
    {
      label: 'game 3',
      gameKey: 'game3',
      gameName: '주민들이 생산하는 말 부수기',
      position: [10, 3, 0],
      rotation: [0, 0, 0]
    },
  ]
}