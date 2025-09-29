interface gamePortalProp {
  label: string;
  gameKey: string;
  position: [number, number, number];
  rotation:  [number, number, number];
  size?: [number, number, number];
}
export const gamePortals: Record<string, gamePortalProp[]> = {
  time: [
    {
      label: 'game 1',
      gameKey: 'game1',
      position: [-10, 3, 0],
      rotation: [0, 0, 0]
    },
    {
      label: 'game 2',
      gameKey: 'game2',
      position: [0, 3, -3],
      rotation: [0, 0, 0]
    },
    {
      label: 'game 3',
      gameKey: 'game3',
      position: [10, 3, 0],
      rotation: [0, 0, 0]
    },
  ],
  sacrifice: [
    {
      label: 'game 1',
      gameKey: 'game1',
      position: [-10, 3, 0],
      rotation: [0, 0, 0]
    },
    {
      label: 'game 2',
      gameKey: 'game2',
      position: [0, 3, -3],
      rotation: [0, 0, 0]
    },
    {
      label: 'game 3',
      gameKey: 'game3',
      position: [10, 3, 0],
      rotation: [0, 0, 0]
    },
  ],
  entropy: [
    {
      label: 'game 1',
      gameKey: 'game1',
      position: [-10, 3, 0],
      rotation: [0, 0, 0]
    },
    {
      label: 'game 2',
      gameKey: 'game2',
      position: [0, 3, -3],
      rotation: [0, 0, 0]
    },
    {
      label: 'game 3',
      gameKey: 'game3',
      position: [10, 3, 0],
      rotation: [0, 0, 0]
    },
  ]
}