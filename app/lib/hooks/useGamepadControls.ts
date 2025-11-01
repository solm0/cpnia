import { useEffect, useRef } from "react";

export function useGamepadControls() {
  const gamepadState = useRef({
    axes: [0, 0, 0, 0],
    buttons: {} as Record<string, boolean>,
  });

  useEffect(() => {
    let animationFrame: number;

    function pollGamepad() {
      const gp = navigator.getGamepads()[0];
      if (gp) {
        gamepadState.current.axes = gp.axes.slice(0, 4);
        gp.buttons.forEach((btn, i) => {
          gamepadState.current.buttons[i] = btn.pressed;
        });
      }

      animationFrame = requestAnimationFrame(pollGamepad);
    }

    pollGamepad();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return gamepadState;
}