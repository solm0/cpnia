import Model from "../util/Model";
import { Group, Vector3 } from "three";
import { useRef, useState } from "react";
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

  const jumpStrength = 1;
  const gravity = 3;
  const [isGrounded, setIsGrounded] = useState(true);

  // --- main loop ---
  useFrame((_, delta) => {
    if (!ref.current) return;

    velocity.current.x = 0;
    velocity.current.z = 0;
  
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
    if (pressedKeys.current.has("KeyJ") && isGrounded) {
      velocity.current.y = jumpStrength;
      setIsGrounded(false);
    }

    // --- gamepad movement (left stick) ---
    if (Math.abs(gamepad.current.axes[1]) > 0.1) {
      velocity.current.add(
        forward.current.clone().multiplyScalar(-gamepad.current.axes[1] * 0.1)
      );
    }
    if (Math.abs(gamepad.current.axes[0]) > 0.1) {
      forward.current.applyAxisAngle(
        new Vector3(0, 1, 0),
        -gamepad.current.axes[0] * Math.PI / 2 * delta
      );
      forward.current.normalize();
      targetAngle.current -= gamepad.current.axes[0] * Math.PI / 2 * delta;
    }

    // --- gamepad movement (button) ---
    if (gamepad.current.buttons[0] && isGrounded) {
      velocity.current.y = jumpStrength;
      setIsGrounded(false);
    }

    // jump gravity
    velocity.current.y -= gravity * delta; // gravity every frame
    ref.current.position.addScaledVector(velocity.current, delta);

    // ground check (simple: stop at y=0)
    if (ref.current.position.y <= 0) {
      ref.current.position.y = 0;
      velocity.current.y = 0;
      setIsGrounded(true);
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