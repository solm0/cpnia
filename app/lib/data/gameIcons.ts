interface gameIconProp {
  label: string;
  id: string;
  position: [number, number, number];
  rotation:  [number, number, number];
}
export const gameIcons: Record<string, gameIconProp[]> = {
  time: [
    {
      label: 'game 1',
      id: 'game1',
      position: [-5, 3, 0],
      rotation: [0, 0, 0]
    },
    {
      label: 'game 2',
      id: 'game2',
      position: [0, 3, 0],
      rotation: [0, 0, 0]
    },
    {
      label: 'game 3',
      id: 'game3',
      position: [5, 3, 0],
      rotation: [0, 0, 0]
    },
  ],
  sacrifice: [
    {
      label: 'game 1',
      id: 'game1',
      position: [-5, 3, 0],
      rotation: [0, 0, 0]
    },
    {
      label: 'game 2',
      id: 'game2',
      position: [0, 3, 0],
      rotation: [0, 0, 0]
    },
    {
      label: 'game 3',
      id: 'game3',
      position: [5, 3, 0],
      rotation: [0, 0, 0]
    },
  ],
  entropy: [
    {
      label: 'game 1',
      id: 'game1',
      position: [-5, 3, 0],
      rotation: [0, 0, 0]
    },
    {
      label: 'game 2',
      id: 'game2',
      position: [0, 3, 0],
      rotation: [0, 0, 0]
    },
    {
      label: 'game 3',
      id: 'game3',
      position: [5, 3, 0],
      rotation: [0, 0, 0]
    },
  ]
}