/* eslint-disable @typescript-eslint/no-explicit-any */

import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { useRef, useEffect } from "react";

export function useStairClimb(
  bodyRef: React.RefObject<any>,
  start: [number, number, number],
  end: [number, number, number],
  steps: number,
  stairModeRef: React.RefObject<boolean>,
  onComplete?: () => void
) {
  const positionsRef = useRef<Vector3[]>([]);
  const currentStep = useRef(0);
  const progress = useRef(0);
  
  
  // Precompute stair positions
  useEffect(() => {
    const posArr: Vector3[] = [];
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const x = start[0] + (end[0] - start[0]) * t;
      const y = start[1] + (end[1] - start[1]) * t;
      const z = start[2] + (end[2] - start[2]) * t;
      posArr.push(new Vector3(x, y, z));
    }
    positionsRef.current = posArr;
    currentStep.current = 0;
    progress.current = 0;
  }, [start, end, steps]);


  useFrame((_, delta) => {
    if (!bodyRef.current || !stairModeRef.current) return;

    const positions = positionsRef.current;

    // If we're done, snap to the end position
    if (currentStep.current >= positions.length - 1) {
      bodyRef.current.setNextKinematicTranslation({
        x: end[0],
        y: end[1],
        z: end[2],
      });
      stairModeRef.current = false;
      onComplete?.();
      return;
    }

    const from = positions[currentStep.current];
    const to = positions[currentStep.current + 1];

    // Increment progress; 0.5 seconds per step
    progress.current += delta / 0.5;

    let tProgress = progress.current;
    if (tProgress > 1) tProgress = 1;

    // Smooth horizontal lerp
    const x = from.x + (to.x - from.x) * tProgress;
    const z = from.z + (to.z - from.z) * tProgress;

    // Parabolic jump in y
    const baseY = from.y + (to.y - from.y) * tProgress;
    const jumpOffset = Math.sin(Math.PI * tProgress) * 2;
    const y = baseY + jumpOffset;

    bodyRef.current.setNextKinematicTranslation({ x, y, z });

    if (progress.current >= 1) {
      progress.current = 0;
      currentStep.current += 1;
    }
  });
}