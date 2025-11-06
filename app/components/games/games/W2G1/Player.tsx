/* eslint-disable @typescript-eslint/no-explicit-any */

import { Euler, Object3D, Quaternion, Vector3 } from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";
import { RigidBody } from "@react-three/rapier";
import { Boundary, clampToBoundary } from "@/app/components/maps/player/clampToBoundary";
import { useFollowCam } from "@/app/components/maps/player/useFollowCam";
import { CuboidCollider } from "@react-three/rapier";
import { usePlayerStore } from "@/app/lib/state/playerStore";
import { degToRad } from "three/src/math/MathUtils.js";

export default function Player({
  config, rectArea,
}: {
  config?: { playerPos: Vector3, playerRot: Vector3, camXRot?: number, camYPos?: number, camYRot?: number, zoom?: number, }
  rectArea: Boundary[];
}) {
  const body = useRef<any>(null);
  const pressedKeys = useKeyboardControls();
  const gamepad = useGamepadControls();
  const { yaw } = useFollowCam(
    body,
    [0, config?.camYPos ?? 0, config?.zoom ?? 0],
    [degToRad(config?.camXRot ?? 20), degToRad(config?.camYRot ?? 0), 0],
    pressedKeys.current,
    gamepad.current,
  );

  const inputVelocity = useMemo(() => new Vector3(), []);

  useEffect(() => {
    if (body.current) {
      body.current.setTranslation({
        x: config?.playerPos.x,
        y: config?.playerPos.y,
        z: config?.playerPos.z
      }, true);

      const quat = new Quaternion().setFromEuler(
        new Euler(config?.playerRot.x, config?.playerRot.y, config?.playerRot.z)
      );
      body.current.setRotation(quat, true);
    }
  }, [config]);

  useFrame((_, delta) => {
    if (!body.current) return;

    const deadzone = 0.5;
    const speed = 1;
    const moveSpeed = 10;
    let nextAction = 0; // idle

    // Input
    let horizontal = 0;
    let vertical = 0;
    if (pressedKeys.current.has("KeyD") || gamepad.current.axes[0] > deadzone) {
      horizontal += speed;
      nextAction = 1
    }
    if (pressedKeys.current.has("KeyA") || gamepad.current.axes[0] < -deadzone) {
      horizontal -= speed;
      nextAction = 1
    }
    if (pressedKeys.current.has("KeyS") || gamepad.current.axes[1] > deadzone) {
      vertical += speed;
      nextAction = 1
    }
    if (pressedKeys.current.has("KeyW") || gamepad.current.axes[1] < -deadzone) {
      vertical -= speed;
      nextAction = 1
    }
    
    const horizontalInput = new Vector3(horizontal, 0, vertical);
    
    // Rotate by yaw
    if (horizontalInput.lengthSq() > 0) {
      horizontalInput.normalize();
      const yawQuat = new Quaternion().setFromEuler(new Euler(0, yaw.rotation.y, 0));
      horizontalInput.applyQuaternion(yawQuat);
    }
    
    const t = body.current.translation();
    
    // Move rigidbody
    const move = horizontalInput.clone();
    move.y = inputVelocity.y;
    
    const newPos = {
      x: t.x + move.x * delta * moveSpeed,
      y: Math.max(0, t.y + move.y * delta * moveSpeed),
      z: t.z + move.z * delta * moveSpeed,
    };
    
    const nextPos = clampToBoundary(newPos, rectArea);
    body.current.setNextKinematicTranslation(nextPos);

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
    <>
      <RigidBody
        scale={0.15}
        ref={body}
        type="kinematicPosition"
        colliders={false}
      >
        {/* add a cuboid collider that matches player size */}
        <mesh visible={false} castShadow receiveShadow>
          <CuboidCollider args={[0.5, 1, 0.5]} /> 
        </mesh>
      </RigidBody>
      {/* <DebugBoundaries boundaries={rectArea} /> */}
    </>
  );
}