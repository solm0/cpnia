import Model from "../util/Model";
import { Euler, Group,  Object3D, Quaternion, Vector3 } from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";

function useFollowCam(
  ref: React.RefObject<Group | null>,
  offset: [number, number, number],
  pressedKeys: Set<string>,
  gamepad: {
    axes: number[], // left & right sticks
    buttons: Record<string, boolean>,
  }
) {
  const { scene, camera } = useThree();

  const pivot = useMemo(() => new Object3D(), []);
  const alt = useMemo(() => new Object3D(), []);
  const yaw = useMemo(() => new Object3D(), []);
  const pitch = useMemo(() => new Object3D(), []);
  const worldPosition = useMemo(() => new Vector3(), []);

  function updateCameraFromKeys() {
    const rotateSpeed = 0.02;

    const deadzone = 0.5;

    if (pressedKeys.has("KeyJ") || (gamepad && gamepad.axes[2] < -deadzone)) {
      yaw.rotation.y += rotateSpeed;
    }
    if (pressedKeys.has("KeyL") || (gamepad && gamepad.axes[2] > deadzone)) {
      yaw.rotation.y -= rotateSpeed;
    }
    if (pressedKeys.has("KeyI") || (gamepad && gamepad.axes[3] < -deadzone)) {
      pitch.rotation.x = Math.max(-1, pitch.rotation.x - rotateSpeed);
    }
    if (pressedKeys.has("KeyK") || (gamepad && gamepad.axes[3] > deadzone)) {
      pitch.rotation.x = Math.min(0.1, pitch.rotation.x + rotateSpeed);
    }
  }

  function onDocumentMouseWheel(e: WheelEvent) {
    if (document.pointerLockElement) {
      e.preventDefault();
      const v = camera.position.z + e.deltaY * 0.005;
      if (v >= 0.5 && v <= 5) camera.position.z = v;
    }
  }

  useEffect(() => {
    scene.add(pivot);
    pivot.add(alt);
    alt.position.y = offset[1];
    alt.add(yaw);
    yaw.add(pitch);
    pitch.add(camera);

    pitch.rotation.x = -Math.PI / 12 
    camera.position.set(offset[1], 0, offset[2]);

    document.addEventListener("wheel", onDocumentMouseWheel, { passive: false });
    return () => document.removeEventListener("wheel", onDocumentMouseWheel);
  }, [camera]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.getWorldPosition(worldPosition);
    pivot.position.lerp(worldPosition, delta * 5);
    updateCameraFromKeys(); // rotate using IJLK
  });

  return { pivot, alt, yaw, pitch };
}

function Avatar() {
  const ref = useRef<Group>(null);

  // 아바타 애니메이션
  
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

export default function Player({ position }: { position: [number, number, number] }) {
  const playerGrounded = useRef(false)
  const inJumpAction = useRef(false)
  const group = useRef<Group>(null!)

  const pressedKeys = useKeyboardControls();
  const gamepad = useGamepadControls();
  const { yaw } = useFollowCam(group, [0, 1, 25], pressedKeys.current, gamepad.current);

  const inputVelocity = useMemo(() => new Vector3(), [])

  useFrame((_, delta) => {
    if (!group.current) return;

    // --- raw WASD input ---
    const deadzone = 0.5;
    const speed = 1

    // horizontal: right = +1, left = -1
    let horizontal = 0;
    if (pressedKeys.current.has("KeyD")) horizontal += speed;
    if (pressedKeys.current.has("KeyA")) horizontal -= speed;
    if (gamepad) {
      if (gamepad.current.axes[0] > deadzone) horizontal += speed;
      if (gamepad.current.axes[0] < -deadzone) horizontal -= speed;
    }

    // vertical: forward = -1, backward = +1
    let vertical = 0;
    if (pressedKeys.current.has("KeyS")) vertical += speed;
    if (pressedKeys.current.has("KeyW")) vertical -= speed;
    if (gamepad) {
      if (gamepad.current.axes[1] > deadzone) vertical += speed;
      if (gamepad.current.axes[1] < -deadzone) vertical -= speed;
    }

    const horizontalInput = new Vector3(horizontal, 0, vertical);
  
    // --- rotate input by current yaw ---
    if (horizontalInput.lengthSq() > 0) {
      horizontalInput.normalize();
      const yawQuat = new Quaternion().setFromEuler(new Euler(0, yaw.rotation.y, 0));
      horizontalInput.applyQuaternion(yawQuat);
    }
  
    // --- jump & gravity ---
    if (playerGrounded.current) {
      if (pressedKeys.current.has("Space") && !inJumpAction.current) {
        inputVelocity.y = 1; // jump
        playerGrounded.current = false;
        inJumpAction.current = true;
      }
      if (gamepad && gamepad.current.buttons[0] && !inJumpAction.current) {
        inputVelocity.y = 1; // jump
        playerGrounded.current = false;
        inJumpAction.current = true;
      }
    } else {
      inputVelocity.y -= 3 * delta; // gravity
    }
  
    // --- move avatar ---
    const move = horizontalInput.clone();
    move.y = inputVelocity.y;
    group.current.position.addScaledVector(move, delta * 40);
  
    // --- simple ground collision ---
    if (group.current.position.y <= 0) {
      group.current.position.y = 0;
      inputVelocity.y = 0;
      playerGrounded.current = true;
      inJumpAction.current = false;
    }
  
    // --- rotate avatar to face movement direction ---
    if (horizontalInput.lengthSq() > 0) {
      const targetQuat = new Quaternion().setFromUnitVectors(new Vector3(0, 0, -1), horizontalInput.clone().normalize());
      group.current.quaternion.slerp(targetQuat, delta * 10);
    }
  });

  return (
    <group ref={group} position={position}>
      <Avatar />
    </group>
  )
}