import { Object3D } from "three";
import { create } from "zustand";

type Dir = 'left' | 'right' | 'up' | 'down';

export const InputManager = {
  // onMove: (dir: Dir) => {},
  // onYawPitch: (dir: Dir) => {},
  // onOpenChat: () => {},
  // onJump: () => {},
  onNavigate: (dir: Dir) => {
    moveFocus(dir);
  },
  onConfirm: () => {
    const focusedObj = use3dFocusStore.getState().focusedObj;
    if (focusedObj) {
      focusedObj.onInteract?.();
    } else {
      const uiFocus = use2dFocusStore.getState().focusables[
        use2dFocusStore.getState().focusIndex
      ];
      uiFocus?.onSelect?.();
    }
  },
};

interface Focusable2d {
  id: number;
  onSelect: () => void;
  x: number;
  y: number;
}

interface Focus2d {
  focusIndex: number;
  focusables: Focusable2d[];
  setFocusIndex: (i: number) => void;
  registerFocusable: (f: Focusable2d) => void;
  unregisterFocusable: (id: number) => void;
}

// 현재 “UI 포커스 가능한 요소 목록”과 “현재 인덱스”를 관리
const use2dFocusStore = create<Focus2d>((set) => ({
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
  id: number;
  object: Object3D;
  onInteract?: () => void;
}

interface Focus3d {
  focusedObj: Focusable3d | null;
  setFocusedObj: (obj: Focusable3d | null) => void;
}

const use3dFocusStore = create<Focus3d>((set) => ({
  focusedObj: null as Focusable3d | null,
  setFocusedObj: (obj: Focusable3d | null) => set({ focusedObj: obj }),
}));

function moveFocus(dir: Dir) {
  const { focusables, focusIndex, setFocusIndex } = use2dFocusStore.getState();

  const current = focusables[focusIndex];
  if (!current) return;

  // 간단히: 방향에 맞는 가장 가까운 요소 선택
  const candidates = focusables.filter((f) => f.id !== current.id);
  let next = null;
  const minDist = Infinity;
  for (const f of candidates) {
    const dx = f.x - current.x;
    const dy = f.y - current.y;
    if (dir === "up" && dy < 0 && Math.abs(dx) < 100 && Math.abs(dy) < minDist) next = f;
    if (dir === "down" && dy > 0 && Math.abs(dx) < 100 && dy < minDist) next = f;
    if (dir === "left" && dx < 0 && Math.abs(dy) < 100 && Math.abs(dx) < minDist) next = f;
    if (dir === "right" && dx > 0 && Math.abs(dy) < 100 && dx < minDist) next = f;
  }

  if (next) setFocusIndex(focusables.indexOf(next));
}

// --- Button.tsx
// 기존 버튼에다가 id 넣고 onClick을 onConfirm으로 바꾸면 됨.
// export function UIButton({ id, children, onConfirm, x, y }) {
//   const ref = useRef();
//   const { focusIndex, focusables } = useFocusStore();
//   const index = focusables.findIndex((f) => f.id === id);
//   const isFocused = focusIndex === index;

//   useEffect(() => {
//     useFocusStore.getState().registerFocusable({ id, ref, x, y, onConfirm });

        // return () => {
        //   useFocusStore.getState().unregisterFocusable(id);
        // };
//   }, []);

//   return (
//     <div
//       ref={ref}
//       className={`p-4 rounded-xl cursor-pointer transition
//         ${isFocused ? "ring-4 ring-cyan-400 scale-105" : "opacity-80"}`}
//     >
//       {children}
//     </div>
//   );
// }

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