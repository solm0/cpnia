/* eslint-disable @typescript-eslint/no-explicit-any */
import { Euler, Quaternion, Vector3 } from "three";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Avatar } from "@/app/components/maps/player/Avatar";
import { useFollowCam } from "@/app/components/maps/player/useFollowCam";
import { degToRad } from "three/src/math/MathUtils.js";
import { PlayerData } from "../W3G2";

export default function Player({
  playerRef,
}: {
  playerRef: RefObject<PlayerData>;
}) {
  const body = useRef<any>(null);
  const [activeAction, setActiveAction] = useState(0);

  const pressedKeys = useKeyboardControls();
  const gamepad = useGamepadControls();
  const { yaw } = useFollowCam(
    body,
    [0, 5, 20],
    [degToRad(20), 0, 0],
    pressedKeys.current,
    gamepad.current
  );

  const speed = 50; // horizontal speed
  const flySpeed = 5; // vertical speed

  useEffect(() => {
    if (body.current) {
      body.current.setTranslation({ x: 0, y: 0, z: 0 }, true);
    }
  }, []);

  useFrame((_, delta) => {
    if (!body.current) return;

    let nextAction = 0; // idle
    let horizontal = 0;
    let vertical = 0;
    let upDown = 0;
    const deadzone = 0.5;

    // Horizontal input (WASD / gamepad)
    if (pressedKeys.current.has("KeyD") || gamepad.current.axes[0] > deadzone) horizontal += 10;
    if (pressedKeys.current.has("KeyA") || gamepad.current.axes[0] < -deadzone) horizontal -= 10;
    if (pressedKeys.current.has("KeyS") || gamepad.current.axes[1] > deadzone) vertical += 10;
    if (pressedKeys.current.has("KeyW") || gamepad.current.axes[1] < -deadzone) vertical -= 10;

    // Vertical input (ArrowUp / ArrowDown)
    if (pressedKeys.current.has("ArrowUp")) {upDown += 10; nextAction = 3;};
    if (pressedKeys.current.has("ArrowDown")) {upDown -= 10; nextAction = 3;};

    const horizontalInput = new Vector3(horizontal, 0, vertical);

    if (horizontalInput.lengthSq() > 0) {
      horizontalInput.normalize();
      nextAction = 3; // flying / moving
      const yawQuat = new Quaternion().setFromEuler(new Euler(0, yaw.rotation.y, 0));
      horizontalInput.applyQuaternion(yawQuat);
    }

    // Combine horizontal and vertical movement
    const velocity = {
      x: horizontalInput.x * speed,
      y: upDown * flySpeed, // vertical control
      z: horizontalInput.z * speed,
    };

    body.current.setLinvel(velocity, true);

    // Rotate avatar to face horizontal movement
    if (horizontalInput.lengthSq() > 0) {
      const targetQuat = new Quaternion().setFromUnitVectors(
        new Vector3(0, 0, -1),
        horizontalInput.clone().normalize()
      );
      body.current.setRotation(targetQuat, true);
    }

    const t = body.current.translation();
    const r = body.current.rotation();

    // playerRef 업데이트
    if (playerRef.current) {
      playerRef.current.position = new Vector3(t.x, t.y, t.z);
      playerRef.current.rotation = new Quaternion(r.x, r.y, r.z, r.w);
    }

    if (activeAction !== nextAction) setActiveAction(nextAction);
  });

  return (
    <RigidBody ref={body} type="dynamic" gravityScale={0.5} colliders={'cuboid'}>
      <mesh visible={false}>
        <CuboidCollider args={[0.5, 1, 0.5]} />
      </mesh>
      <Avatar animIndex={activeAction} />
    </RigidBody>
  );
}