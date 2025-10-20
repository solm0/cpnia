interface worldPortalProp {
  label: string;
  src: string;
  worldKey: string;
  worldName: string;
  description: string;
  position: [number, number, number];
  rotation:  [number, number, number];
  scale: number;
  rotationAxis: [number, number, number];
  rotationSpeed: number;
  bgm: string;
}
export const worldPortals: worldPortalProp[] = [
  {
    label: "시간 기반 체제",
    src: '/models/world-icon/time-3.gltf',
    worldKey: 'time',
    worldName: 'ON TIME',
    description: '이 국가에서는 모든 시민은 시간을 가지고 태어나며, 화폐 대신 시간을 사용한다. 카지노에서 도박으로 시간을 증식한다.',
    position: [-25, 3, 0],
    rotation: [0, Math.PI/3, 0],
    scale: 2,
    rotationAxis: [1, 0.2, 0],
    rotationSpeed: 0.25, 
    bgm:'/audio/sacrifice_bg.mp3'
  },
  {
    label: "희생 기반 체제",
    src: '/models/world-icon/sacrifice-3.gltf',
    worldKey: 'sacrifice',
    worldName: 'PIZZA SHOOT',
    description: '이 국가에서는 공동체를 위해 주기적 희생이 필요하고 시민은 피자 재료가 된다.',
    position: [0, 3, -15],
    rotation: [0, 0, 0],
    scale: 2.4,
    rotationAxis: [0.3, 1, 0],
    rotationSpeed: 0.35,
    bgm:'/audio/sacrifice_bg.mp3'
  },
  {
    label: "엔트로피 체제",
    src: '/models/world-icon/entropy-3.gltf',
    worldKey: 'entropy',
    worldName: 'ENTROPY',
    description: '이 국가에서는 모든 것은 무질서로 돌아가야 한다. 질서를 세우려는 행동은 범죄로 간주되고 고발이 장려된다.',
    position: [25, 3, 0],
    rotation: [0, -Math.PI/3, 0],
    scale: 2,
    rotationAxis: [0, 1, 0.2],
    rotationSpeed: 0.18,
    bgm:'/audio/entropy_bg.mp3'
  },
]