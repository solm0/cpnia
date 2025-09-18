interface worldModelProp {
  label: string;
  id: string;
  position: [number, number, number];
  rotation:  [number, number, number];
}
export const worldModels: worldModelProp[] = [
  {
    label: "시간 기반 체제",
    id: 'time',
    position: [-5, 3, 0],
    rotation: [0, 0, 0]
  },
  {
    label: "희생 기반 체제",
    id: 'sacrifice',
    position: [0, 3, 0],
    rotation: [0, 0, 0]
  },
  {
    label: "엔트로피 체제",
    id: 'entropy',
    position: [5, 3, 0],
    rotation: [0, 0, 0]
  },
]