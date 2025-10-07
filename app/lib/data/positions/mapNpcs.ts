interface mapNpcProp {
  name: string;
  position: [number, number, number];
  rotation:  [number, number, number];
  size?: [number, number, number];
  scale?: number;
  model?: string;
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
      model: '/models/cutter.gltf',
      position: [30,0,0],
      rotation: [0,0, 0],
      scale: 2
    }
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