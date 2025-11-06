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
    console.log('onConfirm 실행')
    const focusedObj = use3dFocusStore.getState().focusedObj;
    if (focusedObj) {
      console.log('focusedObj가 있어서 클릭 불가')
      focusedObj.onClick?.();
    } else {
      console.log('focusedObj가 없어서 클릭 가능')
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
  important?: boolean;
}

interface Focus2d {
  focusIndex: number;
  focusables: Focusable2d[];
  setFocusIndex: (i: number) => void;
  registerFocusable: (f: Focusable2d) => void;
  unregisterFocusable: (id: string) => void;
}

export const use2dFocusStore = create<Focus2d>((set, get) => ({
  focusIndex: 0,
  focusables: [],
  setFocusIndex: (i: number) => set({ focusIndex: i }),
  registerFocusable: (f) => {
    const focusable = { ...f, important: f.important ?? false };  // 기본값 false

    if (focusable.important) {
      console.log('important focusable added')
      set((state) => ({ focusables: [f, ...state.focusables] }))
    } else {
      set((state) => ({ focusables: [...state.focusables, f] }))
    }
  },
  unregisterFocusable: (id) => {
    const newList = get().focusables.filter((f: Focusable2d) => f.id !== id);
    let newIndex = get().focusIndex;
    if (newIndex >= newList.length) newIndex = 0; // ✅ 배열 짧아지면 0으로
    set({ focusables: newList, focusIndex: newIndex });
  },
}));

export interface Focusable3d {
  id: string;
  onClick?: () => void;
}

interface Focus3d {
  focusedObj: Focusable3d | null;
  setFocusedObj: (obj: Focusable3d | null) => void;
}

export const use3dFocusStore = create<Focus3d>((set, get) => {
  let resetTimer: NodeJS.Timeout | null = null;

  return {
    focusedObj: null as Focusable3d | null,
    setFocusedObj: (obj: Focusable3d | null) => {
      set({ focusedObj: obj });

      // 타이머 리셋
      if (resetTimer) clearTimeout(resetTimer);

      // 새 포커스가 잡히면 5초 후 자동 해제
      if (obj) {
        resetTimer = setTimeout(() => {
          if (get().focusedObj === obj) {
            console.warn("focusedObj 자동 초기화됨 (timeout)");
            set({ focusedObj: null });
          }
        }, 5000); // 5초 후 자동 초기화
      }
    },
  };
});

function moveFocus(dir: Dir) {
  const { focusables, focusIndex, setFocusIndex } = use2dFocusStore.getState();
  const current = focusables[focusIndex];
  if (!current) return;

  let next = null;
  let bestScore = -Infinity;

  // 방향 벡터 설정
  const dirVec = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0],
  }[dir];

  for (const f of focusables) {
    if (f.id === current.id) continue;

    const dx = f.x - current.x;
    const dy = f.y - current.y;

    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) continue;

    const normX = dx / dist;
    const normY = dy / dist;

    // 방향 일치도 (cosine similarity)
    const dot = normX * dirVec[0] + normY * dirVec[1];
    if (dot <= 0.2) continue; // 0보다 커야 대략 같은 방향임. (0.2는 약간의 관용)

    // 방향 일치도(가중치 높게) + 거리(보조 우선순위)
    const score = dot * 2 - dist * 0.01;

    if (score > bestScore) {
      bestScore = score;
      next = f;
    }
  }

  if (next) setFocusIndex(focusables.indexOf(next));
}