interface worldPortalProp {
  label: string;
  worldKey: string;
  position: [number, number, number];
  rotation:  [number, number, number];
}
export const worldPortals: worldPortalProp[] = [
  {
    label: "시간 기반 체제",
    worldKey: 'time',
    position: [-5, 3, 0],
    rotation: [0, 0, 0]
  },
  {
    label: "희생 기반 체제",
    worldKey: 'sacrifice',
    position: [0, 3, 0],
    rotation: [0, 0, 0]
  },
  {
    label: "엔트로피 체제",
    worldKey: 'entropy',
    position: [5, 3, 0],
    rotation: [0, 0, 0]
  },
]