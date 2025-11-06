import { ReactNode, useEffect, useRef } from "react";
import { use2dFocusStore } from "@/app/lib/gamepad/inputManager";

export default function OptionButton({
  id, onClick, label, disabled = false, style
}: {
  id: string;
  onClick: (param?: number | string | boolean | null) => void;
  label: string | ReactNode;
  disabled?: boolean;
  style: string;
}) {
  // register를 해주는데 일반 Button과 달리 focusable의 첫번째순서에다 넣는다.
  const ref = useRef<HTMLButtonElement>(null);
  const { focusIndex, focusables } = use2dFocusStore();
  const index = focusables.findIndex((f) => f.id === id);
  const isFocused = focusIndex === index;

  useEffect(() => {
    if (!ref.current) return;
    const store = use2dFocusStore.getState();
  
    const updatePosition = () => {
      const rect = ref.current!.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      store.registerFocusable({ id, x, y, onClick, important: true });
    };
  
    if (!disabled) {
      const raf = requestAnimationFrame(updatePosition);
      return () => {
        cancelAnimationFrame(raf);
        store.unregisterFocusable(id);
      };
    } else {
      store.unregisterFocusable(id);
    }
  }, [id, onClick, disabled]);

  return (
    <button
      ref={ref}
      type='button'
      onClick={() => onClick?.()}
      className={`
        ${style}
        ${isFocused ? "border-4 border-cyan-400 scale-105" : "opacity-80"}
      `}
      disabled={disabled ? true : false}
    >
      {label}
    </button>
  )
}