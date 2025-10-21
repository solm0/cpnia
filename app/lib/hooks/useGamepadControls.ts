import { useEffect, useRef } from "react";

export function useGamepadControls() {
  const gamepadState = useRef({
    axes: [0, 0, 0, 0],
    buttons: {} as Record<string, boolean>,
  });

  const prevButton15 = useRef(false);
  const prevButton14 = useRef(false);
  const prevButton1 = useRef(false);

  useEffect(() => {
    let animationFrame: number;

    // 십자 오른쪽(15) - 포커스 이동
    function focusNextElement(next:boolean) {
      const focusable = Array.from(
        document.querySelectorAll<HTMLElement>(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => !el.hasAttribute("disabled") && el.tabIndex >= 0);
      
      const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
      const nextIndex = next
        ? (currentIndex + 1) % focusable.length
        : (currentIndex - 1) % focusable.length
      focusable[nextIndex]?.focus();
      console.log(focusable, focusable[nextIndex])
    }

    function pollGamepad() {
      const gp = navigator.getGamepads()[0];
      if (gp) {
        gamepadState.current.axes = gp.axes.slice(0, 4);
        gp.buttons.forEach((btn, i) => {
          gamepadState.current.buttons[i] = btn.pressed;
        });

        // ── Button 15 (D-Pad Right): Focus next
        const button15Pressed = Boolean(gp.buttons[15]?.pressed);
        if (button15Pressed && !prevButton15.current) {
          console.log("button 15 pressed");
          focusNextElement(true);
        }
        prevButton15.current = button15Pressed;

        // ── Button 14 (D-Pad Left): Focus prev
        const button14Pressed = Boolean(gp.buttons[14]?.pressed);
        if (button14Pressed && !prevButton14.current) {
          console.log("button 14 pressed");
          focusNextElement(false);
        }
        prevButton14.current = button14Pressed;


        // ── Button 1 (A): Trigger Enter or click
        const button1Pressed = Boolean(gp.buttons[1]?.pressed);
        if (button1Pressed && !prevButton1.current) {
          console.log("button 1 pressed → simulate Enter");
          const active = document.activeElement as HTMLElement | null;

          if (active && typeof (active).click === "function") {
            (active).click();
          } else {
            const e = new KeyboardEvent("keydown", { key: "Enter" });
            document.dispatchEvent(e);
          }
        }
        prevButton1.current = button1Pressed;
      }

      animationFrame = requestAnimationFrame(pollGamepad);
    }

    pollGamepad();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return gamepadState;
}