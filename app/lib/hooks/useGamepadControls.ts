import { useEffect, useRef } from "react";

export function useGamepadControls() {
  const gamepadState = useRef({ x: 0, y: 0 }); // left stick
  
  useEffect(() => {
    let animationFrame: number;
    function pollGamepad() {
      const gp = navigator.getGamepads()[0];
      if (gp) {
        gamepadState.current.x = gp.axes[0]; // left stick horizontal
        gamepadState.current.y = gp.axes[1]; // left stick vertical
      }
      animationFrame = requestAnimationFrame(pollGamepad);
    }
    pollGamepad();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return gamepadState;
}