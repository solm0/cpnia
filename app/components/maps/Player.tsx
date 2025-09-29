/* eslint-disable @typescript-eslint/no-explicit-any */

import Model from "../util/Model";
import { Euler, Quaternion, Vector3, Object3D } from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";
import { RigidBody } from "@react-three/rapier";

/* ---------------- FOLLOW CAM HOOK ---------------- */
function useFollowCam(
  ref: React.RefObject<any>,
  offset: [number, number, number],
  pressedKeys: Set<string>,
  gamepad: {
    axes: number[];
    buttons: Record<string, boolean>;
  }
) {
  const { scene, camera } = useThree();

  const pivot = useMemo(() => new Object3D(), []);
  const alt = useMemo(() => new Object3D(), []);
  const yaw = useMemo(() => new Object3D(), []);
  const pitch = useMemo(() => new Object3D(), []);
  const worldPosition = useMemo(() => new Vector3(), []);
  const zoomDistance = useRef(offset[2]);

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
    e.preventDefault();
    zoomDistance.current += e.deltaY * 0.01;
    zoomDistance.current = Math.min(Math.max(zoomDistance.current, 10), 300);
  }

  useEffect(() => {
    scene.add(pivot);
    pivot.add(alt);
    alt.position.y = offset[1];
    alt.add(yaw);
    yaw.add(pitch);
    pitch.add(camera);

    pitch.rotation.x = -Math.PI / 12;
    camera.position.set(0, 0, zoomDistance.current);

    document.addEventListener("wheel", onDocumentMouseWheel, { passive: false });
    return () => document.removeEventListener("wheel", onDocumentMouseWheel);
  }, [camera]);

  const currentZoom = new Vector3();
  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.translation();
    worldPosition.set(pos.x, pos.y, pos.z);

    pivot.position.lerp(worldPosition, delta * 5);

    currentZoom.lerp(new Vector3(0, 0, zoomDistance.current), delta * 5);
    camera.position.copy(currentZoom);

    updateCameraFromKeys();
  });

  return { yaw };
}

/* ---------------- AVATAR MODEL ---------------- */
function Avatar() {
  return (
    <group>
      <Model
        src="/models/avatar.glb"
        scale={8}
        position={[0,0,0]}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
}

/* ---------------- PLAYER ---------------- */
export default function Player() {
  const playerGrounded = useRef(false);
  const inJumpAction = useRef(false);
  const body = useRef<any>(null);

  const pressedKeys = useKeyboardControls();
  const gamepad = useGamepadControls();
  const { yaw } = useFollowCam(body, [0, 1, 40], pressedKeys.current, gamepad.current);

  const inputVelocity = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    if (!body.current) return;

    const deadzone = 0.5;
    const speed = 1;

    // Input
    let horizontal = 0;
    let vertical = 0;
    if (pressedKeys.current.has("KeyD")) horizontal += speed;
    if (pressedKeys.current.has("KeyA")) horizontal -= speed;
    if (pressedKeys.current.has("KeyS")) vertical += speed;
    if (pressedKeys.current.has("KeyW")) vertical -= speed;

    if (gamepad) {
      if (gamepad.current.axes[0] > deadzone) horizontal += speed;
      if (gamepad.current.axes[0] < -deadzone) horizontal -= speed;
      if (gamepad.current.axes[1] > deadzone) vertical += speed;
      if (gamepad.current.axes[1] < -deadzone) vertical -= speed;
    }

    const horizontalInput = new Vector3(horizontal, 0, vertical);

    // Rotate by yaw
    if (horizontalInput.lengthSq() > 0) {
      horizontalInput.normalize();
      const yawQuat = new Quaternion().setFromEuler(new Euler(0, yaw.rotation.y, 0));
      horizontalInput.applyQuaternion(yawQuat);
    }

    // Jump & gravity
    if (playerGrounded.current) {
      if ((pressedKeys.current.has("Space") || gamepad?.current.buttons[0]) && !inJumpAction.current) {
        inputVelocity.y = 1;
        playerGrounded.current = false;
        inJumpAction.current = true;
      }
    } else {
      inputVelocity.y -= 3 * delta;
    }

    // Move rigidbody
    const move = horizontalInput.clone();
    move.y = inputVelocity.y;

    const t = body.current.translation();
    const newPos = {
      x: t.x + move.x * delta * 40,
      y: Math.max(0, t.y + move.y * delta * 40),
      z: t.z + move.z * delta * 40,
    };

    body.current.setNextKinematicTranslation(newPos);

    // Reset jump state on ground
    if (newPos.y <= 0) {
      inputVelocity.y = 0;
      playerGrounded.current = true;
      inJumpAction.current = false;
    }

    // Rotate avatar to face movement
    if (horizontalInput.lengthSq() > 0) {
      const targetQuat = new Quaternion().setFromUnitVectors(
        new Vector3(0, 0, -1),
        horizontalInput.clone().normalize()
      );

      const currentQuat = body.current.rotation();
      const currentThreeQuat = new Quaternion(currentQuat.x, currentQuat.y, currentQuat.z, currentQuat.w);

      const slerped = new Quaternion().slerpQuaternions(currentThreeQuat, targetQuat, delta * 10);
      body.current.setNextKinematicRotation(slerped);
    }
  });

  return (
    <RigidBody
      ref={body}
      colliders={'trimesh'}
      type="kinematicPosition"
    >
      <Avatar />
    </RigidBody>
  );
}