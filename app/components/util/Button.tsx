import { jersey15 } from "@/app/lib/fonts";
import { use2dFocusStore } from "@/app/lib/gamepad/inputManager";
import { useEffect, useRef } from "react";

export default function Button({
  id, onClick, label, worldKey, small, disabled = false,
}: {
  id: string; // 게임패드 focusable에 register하기 위함.
  onClick: (param?: number | string | boolean | null) => void;
  label: string;
  worldKey?: string;
  small?: boolean;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  // focusIndex는 focusable 내에서 현재 포커스를가리키는 인덱스
  // 현재 렌더되는 버튼의 index가 focusIndex와 같으면
  // 그 버튼이 현재 포커스되었다는 거겠지.
  const { focusIndex, focusables } = use2dFocusStore();
  const index = focusables.findIndex((f) => f.id === id);
  const isFocused = focusIndex === index;

  // register
  useEffect(() => {
    if (!ref.current) return;
  
    const updatePosition = () => {
      const rect = ref.current!.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      use2dFocusStore.getState().registerFocusable({ id, x, y, onClick });
    };
  
    const raf = requestAnimationFrame(updatePosition);
  
    return () => {
      cancelAnimationFrame(raf);
      use2dFocusStore.getState().unregisterFocusable(id);
    };
  }, [id, onClick]);

  switch (worldKey) {
    case 'time':
      return (
        <button
          ref={ref}
          type="button"
          onClick={() => onClick?.()}
          className={`
            px-4
            ${small ? 'h-full' : 'py-1'}
            flex items-center border-1 border-[#ffffff70] pointer-events-auto hover:opacity-50 transition-opacity cursor-pointer
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
            ${isFocused ? "ring-4 ring-cyan-400 scale-105" : "opacity-80"}
          `}
          disabled={disabled ? true : false}
        >
          {label}
        </button>
      )
    case 'sacrifice':
      return (
        <button
          ref={ref}
          onClick={() => onClick?.()}
          className={`
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
            "px-3 py-1 rounded-2xl bg-yellow-300 hover:opacity-50 transition-opacity text-gray-700 break-keep w-auto pointer-events-auto shrink-0"
            ${isFocused ? "ring-4 ring-cyan-400 scale-105" : "opacity-80"}
          `}
          disabled={disabled ? true : false}
        >
          {label}
        </button>
      )
    case 'entropy':
      return (
        <button
          ref={ref}
          onClick={() => onClick?.()}
          className={`
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
            "px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 break-keep w-auto pointer-events-auto"
            ${isFocused ? "ring-4 ring-cyan-400 scale-105" : "opacity-80"}
          `}
          disabled={disabled ? true : false}
        >
          {label}
        </button>
      )
    default:
      return (
        <button
          ref={ref}
          onClick={() => onClick?.()}
          className={`
            h-10
            ${small ? 'w-20' : 'w-auto min-w-40'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
            ${jersey15.className}
            relative flex gap-4 items-center justify-center pointer-events-auto
            group focus:outline-none
            ${isFocused ? "ring-4 ring-cyan-400 scale-105" : "opacity-80"}
          `}
          disabled={disabled ? true : false}
        >
          <div className={`
            hidden bg-white h-3 w-3 rotate-45
            ${small ? '' : 'group-focus:block'}
          `}/>
          <p className="text-white text-2xl h-10 flex items-center">{label}</p>
          <div className={`
            absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-50 active:opacity-40 transition-opacity duration-300 bg-gradient-to-r from-white to-transparent
            ${small ? 'group-focus:opacity-50' : ''}
          `} />
        </button>
      )
  }
}