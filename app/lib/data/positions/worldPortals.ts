interface worldPortalProp {
  label: string;
  src: string;
  worldKey: string;
  worldName: string;
  description: string;
  position: [number, number, number];
  rotation:  [number, number, number];
  scale: number;
}
export const worldPortals: worldPortalProp[] = [
  {
    label: "시간 기반 체제",
    src: '/models/planet-time/scene.gltf',
    worldKey: 'time',
    worldName: '온 타임',
    description: '이 국가에서는 모든 시민은 시간을 가지고 태어나며, 화폐 대신 시간을 사용한다. 카지노에서 도박으로 시간을 증식한다.',
    position: [-25, 3, 0],
    rotation: [0, Math.PI/3, 0],
    scale: 0.25
  },
  {
    label: "희생 기반 체제",
    src: '/models/planet-sacrifice.glb',
    worldKey: 'sacrifice',
    worldName: '피자슛',
    description: '이 국가에서는 공동체를 위해 주기적 희생이 필요하고 시민은 피자 재료가 된다.',
    position: [0, 3, -15],
    rotation: [0, 0, 0],
    scale: 2.3
  },
  {
    label: "엔트로피 체제",
    src: '/models/planet-entropy.glb',
    worldKey: 'entropy',
    worldName: '엔트로피체제아직이름없으무',
    description: '이 국가에서는 모든 것은 무질서로 돌아가야 한다. 질서를 세우려는 행동은 범죄로 간주되고 고발이 장려된다.',
    position: [25, 3, 0],
    rotation: [0, -Math.PI/3, 0],
    scale: 0.02
  },
]