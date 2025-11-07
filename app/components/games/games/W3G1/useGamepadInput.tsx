import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";
import { useEffect } from "react";

export function useGamepadInput() {
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
            case 14:
              
              break;
            case 15:
              
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