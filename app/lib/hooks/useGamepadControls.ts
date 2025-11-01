import { useEffect, useRef } from "react";

export function useGamepadControls() {
  const gamepadState = useRef({
    axes: [0, 0, 0, 0],
    buttons: {} as Record<string, boolean>,
  });

  const prevButtons = useRef<Record<string, boolean>>({});

  useEffect(() => {
    let animationFrame: number;

    function pollGamepad() {
      const gp = navigator.getGamepads()[0];
      if (gp) {
        gamepadState.current.axes = gp.axes.slice(0, 4);
        gp.buttons.forEach((btn, i) => {
          const pressed = btn.pressed;
          const prev = prevButtons.current[i] || false;

          gamepadState.current.buttons[i] = btn.pressed;

          if (pressed && !prev) {
            console.log(`Button ${i} pressed`);
          }

          prevButtons.current[i] = pressed;
        });
      }

      animationFrame = requestAnimationFrame(pollGamepad);
    }

    pollGamepad();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return gamepadState;
}

/*

0 B
1 A
2 Y
3 X
4 L1
5 R1
6 L2
7 R2
8 -
9 +
12 up
13 down
14 left
15 right
17 []

*/