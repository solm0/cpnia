import { useEffect, useRef } from "react";

export function useGamepadControls() {
  const gamepadState = useRef({
    axes: [0, 0, 0, 0], // left & right sticks
    buttons: {} as Record<string, boolean>,
  });

  useEffect(() => {
    let animationFrame: number;
    function pollGamepad() {
      const gp = navigator.getGamepads()[0];
      if (gp) {
        // update axes
        gamepadState.current.axes = gp.axes.slice(0, 4);

        // update buttons
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