import Model from "./Model";
import { Group, Vector3, MathUtils } from "three";
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function PlayerWithAvatar() {
  const ref = useRef<Group>(null);
  const { camera } = useThree();

  // --- movement state ---
  const forward = useRef(new Vector3(0, 0, -1)); // current forward direction
  const velocity = useRef(new Vector3(0, 0, 0));
  const targetAngle = useRef(0);

  // --- key handling ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "w":
          velocity.current.copy(forward.current).multiplyScalar(0.1);
          break;
        case "s":
          velocity.current.copy(forward.current).multiplyScalar(-0.1);
          break;
        case "a":
          // rotate left 90°
          forward.current.applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
          targetAngle.current += Math.PI / 2;
          velocity.current.copy(forward.current).multiplyScalar(0.1);
          break;
        case "d":
          // rotate right 90°
          forward.current.applyAxisAngle(new Vector3(0, 1, 0), -Math.PI / 2);
          targetAngle.current -= Math.PI / 2;
          velocity.current.copy(forward.current).multiplyScalar(0.1);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      velocity.current.set(0, 0, 0);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // --- main loop ---
  useFrame(() => {
    if (!ref.current) return;

    // Move avatar
    ref.current.position.add(velocity.current);

    // Rotate smoothly to face current direction
    ref.current.rotation.y += (targetAngle.current - ref.current.rotation.y) * 0.1;

    // Camera follow
    const offset = new Vector3(0, 5, 15);
    const camPos = ref.current.position.clone().sub(
      forward.current.clone().multiplyScalar(offset.z)
    );
    camPos.y += offset.y;
    camera.position.lerp(camPos, 0.12);
    camera.lookAt(ref.current.position);
  });

  return (
    <group ref={ref}>
      <Model src="/models/avatar.glb" scale={8} rotation={[0, Math.PI, 0]} />
    </group>
  );
}