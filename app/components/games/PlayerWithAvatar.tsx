import Model from "../util/Model";
import { Group, Vector3 } from "three";
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function PlayerWithAvatar() {
  const ref = useRef<Group>(null);
  const { camera } = useThree();

  // --- movement state ---
  const forward = useRef(new Vector3(0, 0, -1));
  const velocity = useRef(new Vector3(0, 0, 0));
  const targetAngle = useRef(0);

  // --- key handling ---
  const pressedKeys = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 입력창에 포커스가 있을 때는 무시
      const active = document.activeElement as HTMLElement;
      if (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.isContentEditable)
      ) {
        return;
      }

      console.log("keydown:", e.code);
      pressedKeys.current.add(e.code);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement;
      if (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.isContentEditable)
      ) {
        return;
      }

      pressedKeys.current.delete(e.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // --- main loop ---
  useFrame((_, delta) => {
    if (!ref.current) return;
    // console.log({
    //   keys: Array.from(pressedKeys.current),
    //   forward: forward.current.toArray(),
    //   velocity: velocity.current.toArray()
    // });
  
    velocity.current.set(0, 0, 0); // reset each frame
  
    if (pressedKeys.current.has("KeyW")) {
      velocity.current.add(forward.current.clone().multiplyScalar(0.1));
    }
    if (pressedKeys.current.has("KeyS")) {
      velocity.current.add(forward.current.clone().multiplyScalar(-0.1));
    }
    if (pressedKeys.current.has("KeyA")) {
      forward.current.applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2 * delta);
      forward.current.normalize();
      targetAngle.current += Math.PI / 2 * delta;
    }
    if (pressedKeys.current.has("KeyD")) {
      forward.current.applyAxisAngle(new Vector3(0, 1, 0), -Math.PI / 2 * delta);
      forward.current.normalize();
      targetAngle.current -= Math.PI / 2 * delta;
    }
  
    // move
    ref.current.position.add(velocity.current.clone().multiplyScalar(delta * 60));
  
    // smooth rotation
    ref.current.rotation.y += (targetAngle.current - ref.current.rotation.y) * 0.1;
  
    // camera
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
      <Model
        src="/models/avatar.glb"
        scale={8}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
}