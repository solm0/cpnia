import { useEffect } from "react";
import { InputManager } from "@/app/lib/gamepad/inputManager";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";

export function useGamepadInputManager() {
  const gamepad = useGamepadControls();

  useEffect(() => {
    if (!gamepad?.current) return;

    const prevPressed: boolean[] = Array(16).fill(false);
    let rafId: number;

    const loop = () => {
      const buttons = gamepad.current?.buttons;
      Object.entries(buttons).forEach(([index, pressedValue]) => {
        const i = Number(index);
        const pressed = !!pressedValue;

        if (pressed && !prevPressed[i]) {
          switch (i) {
            case 12:
              InputManager.onNavigate("up");
              break;
            case 13:
              InputManager.onNavigate("down");
              break;
            case 14:
              InputManager.onNavigate("left");
              break;
            case 15:
              InputManager.onNavigate("right");
              break;
            case 1:
              InputManager.onConfirm();
              break;
            default:
              break;
          }
        }

        prevPressed[i] = pressed;
      });
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [gamepad]);
}