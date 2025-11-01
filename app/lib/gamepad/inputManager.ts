import { Object3D } from "three";
import { create } from "zustand";

type Dir = 'left' | 'right' | 'up' | 'down';

export const InputManager = {
  // onMove: (dir: Dir) => {},
  // onYawPitch: (dir: Dir) => {},
  // onOpenChat: () => {},
  // onJump: () => {},
  onNavigate: (dir: Dir) => {
    console.log(use2dFocusStore.getState().focusables, use2dFocusStore.getState().focusIndex)
    moveFocus(dir);
  },
  onConfirm: () => {
    const focusedObj = use3dFocusStore.getState().focusedObj;
    if (focusedObj) {
      focusedObj.onClick?.();
    } else {
      const uiFocus = use2dFocusStore.getState().focusables[
        use2dFocusStore.getState().focusIndex
      ];
      console.log(uiFocus)
      console.log(use2dFocusStore.getState().focusables)
      uiFocus?.onClick?.();
    }
  },
};

interface Focusable2d {
  id: string;
  x: number;
  y: number;
  onClick: (param?: number | string | boolean | null) => void;
}

interface Focus2d {
  focusIndex: number;
  focusables: Focusable2d[];
  setFocusIndex: (i: number) => void;
  registerFocusable: (f: Focusable2d) => void;
  unregisterFocusable: (id: string) => void;
}

export const use2dFocusStore = create<Focus2d>((set) => ({
  focusIndex: 0,
  focusables: [],
  setFocusIndex: (i: number) => set({ focusIndex: i }),
  registerFocusable: (f) =>
    set((state) => ({ focusables: [...state.focusables, f] })),
  unregisterFocusable: (id) =>
    set((s) => ({
      focusables: s.focusables.filter((f) => f.id !== id),
    })),
}));

interface Focusable3d {
  id: string;
  object: Object3D;
  onClick?: () => void;
}

interface Focus3d {
  focusedObj: Focusable3d | null;
  setFocusedObj: (obj: Focusable3d | null) => void;
}

export const use3dFocusStore = create<Focus3d>((set) => ({
  focusedObj: null as Focusable3d | null,
  setFocusedObj: (obj: Focusable3d | null) => set({ focusedObj: obj }),
}));

function moveFocus(dir: Dir) {
  const { focusables, focusIndex, setFocusIndex } = use2dFocusStore.getState();
  const current = focusables[focusIndex];
  if (!current) return;

  let next = null;
  let minScore = Infinity;

  for (const f of focusables) {
    if (f.id === current.id) continue;

    const dx = f.x - current.x;
    const dy = f.y - current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // 방향 필터링
    if (dir === "up" && dy >= 0) continue;
    if (dir === "down" && dy <= 0) continue;
    if (dir === "left" && dx >= 0) continue;
    if (dir === "right" && dx <= 0) continue;

    // 방향에 따른 “가중 거리” 계산
    let score = dist;
    if (dir === "up" || dir === "down") score += Math.abs(dx) * 0.4; // 수직 이동 시 x 오차는 살짝 허용
    else score += Math.abs(dy) * 0.4; // 수평 이동 시 y 오차는 살짝 허용

    if (score < minScore) {
      minScore = score;
      next = f;
    }
  }

  if (next) setFocusIndex(focusables.indexOf(next));
}

// --- 3D 오브젝트 생성 시 사용자 정의 속성으로 id나 meta 정보를 부여
// const mesh = new THREE.Mesh(geometry, material);
// mesh.userData = {
//   id: 'portal_01',
//   type: 'gamePortal',
//   onInteract: () => console.log('Enter portal'),
// };

// --- glb 생성시에 userData 부여하기. gamePortal, mapNpc에서.
// const loader = new GLTFLoader();
// loader.load('/models/portal.glb', (gltf) => {
//   const model = gltf.scene;
//   model.traverse((child) => {
//     if (child.isMesh) {
//       // 예: 이름으로 구분하거나 tag로 판단
//       if (child.name.includes('Portal')) {
//         child.userData = {
//           id: 'portal_01',
//           type: 'gamePortal',
//           onInteract: () => console.log('Portal entered!'),
//         };
//       }
//     }
//   });

//   scene.add(model);
// });

// --- 위의 것을 레이캐스팅에서 접근
// const intersects = raycaster.intersectObjects(scene.children);
// if (intersects.length > 0) {
//   const obj = intersects[0].object.userData;
//   use3dFocusStore.getState().setFocusedObj(obj);
// } else {
//   use3dFocusStore.getState().setFocusedObj(null);
// }