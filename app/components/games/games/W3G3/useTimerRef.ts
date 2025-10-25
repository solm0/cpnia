import { useRef } from "react";

export function useTimerRef() {
  const timerRef = useRef({
    startTime: 0,
    elapsed: 0,
    running: false,
  });

  const start = () => {
    timerRef.current.startTime = performance.now();
    timerRef.current.running = true;
  };

  const stop = () => {
    timerRef.current.running = false;
  };

  const getElapsed = () => {
    if (!timerRef.current.running) return timerRef.current.elapsed;
    return (performance.now() - timerRef.current.startTime) / 1000; // seconds
  };

  return { timerRef, start, stop, getElapsed };
}