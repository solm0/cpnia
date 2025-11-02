import { use2dFocusStore } from "@/app/lib/gamepad/inputManager";
import { ChangeEvent, useEffect, useRef } from "react";

export default function Input({
  value, onChange, id, disabled = false, placeholder, style,
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  id: string;
  disabled?: boolean;
  placeholder: string | null;
  style: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const { focusIndex, focusables } = use2dFocusStore();
  const index = focusables.findIndex((f) => f.id === id);
  const isFocused = focusIndex === index;

  useEffect(() => {
    if (isFocused) {
      ref.current?.focus();
    }
  }, [isFocused]);

  useEffect(() => {
    if (!ref.current) return;
    const store = use2dFocusStore.getState();

    const updatePosition = () => {
      const rect = ref.current!.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      store.registerFocusable({
        id,
        x,
        y,
        onClick: () => ref.current?.focus(),
      });
    };

    // disabled=false일 때만 등록
    if (!disabled) {
      const raf = requestAnimationFrame(updatePosition);
      return () => {
        cancelAnimationFrame(raf);
        store.unregisterFocusable(id);
      };
    } else {
      // disabled=true면 즉시 focusable에서 제거
      store.unregisterFocusable(id);
    }
  }, [id, disabled]);


  return (
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={onChange}
      className={`
        ${style} focus:outline-0
        ${isFocused ? 'border-b-4' : 'border-b-1'}
      `}
      placeholder={placeholder ?? ''}
      disabled={disabled}
    />
  )
}