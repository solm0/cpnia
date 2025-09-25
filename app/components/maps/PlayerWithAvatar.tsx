import Model from "../util/Model";
import { Group, Vector3 } from "three";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";

export default function PlayerWithAvatar() {
  const ref = useRef<Group>(null);
  const { camera } = useThree();
  const pressedKeys = useKeyboardControls();
  const gamepad = useGamepadControls();

  // --- movement state ---
  const forward = useRef(new Vector3(0, 0, -1));
  const velocity = useRef(new Vector3(0, 0, 0));
  const targetAngle = useRef(0);

  // --- main loop ---
  useFrame((_, delta) => {
    if (!ref.current) return;
    velocity.current.set(0, 0, 0); // reset each frame
  
    // --- keyboard movement ---
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

    // --- gamepad movement (left stick) ---
    if (Math.abs(gamepad.current.y) > 0.1) {
      velocity.current.add(
        forward.current.clone().multiplyScalar(-gamepad.current.y * 0.1)
      );
    }
    if (Math.abs(gamepad.current.x) > 0.1) {
      forward.current.applyAxisAngle(
        new Vector3(0, 1, 0),
        -gamepad.current.x * Math.PI / 2 * delta
      );
      forward.current.normalize();
      targetAngle.current -= gamepad.current.x * Math.PI / 2 * delta;
    }
  
    // --- apply movement ---
    ref.current.position.add(velocity.current.clone().multiplyScalar(delta * 60));
  
    // smooth rotation
    ref.current.rotation.y += (targetAngle.current - ref.current.rotation.y) * 0.1;
  
    // --- camera follow ---
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