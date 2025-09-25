import { useEffect, useRef } from "react";

export function useKeyboardControls() {
  const pressedKeys = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement;
      if (active && ["INPUT", "TEXTAREA"].includes(active.tagName)) return;
      pressedKeys.current.add(e.code);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement;
      if (active && ["INPUT", "TEXTAREA"].includes(active.tagName)) return;
      pressedKeys.current.delete(e.code);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return pressedKeys;
}