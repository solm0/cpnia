/* eslint-disable @typescript-eslint/no-explicit-any */

import { Euler, Quaternion, Vector3 } from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";
import { RigidBody } from "@react-three/rapier";
import { Boundary, clampToBoundary } from "@/app/components/maps/player/clampToBoundary";
import { checkCollision } from "./checkCollision";
import { Avatar } from "./Avatar";
import { useFollowCam } from "./useFollowCam";
import { coinStairs } from "@/app/lib/data/positions/coinStairs";
import { CuboidCollider } from "@react-three/rapier";

const rectArea: Boundary[] = [
  { type: "rect", center: [140, -13], size: [365, 108] }
];

export default function Player({
  worldKey,
  groundY = 0,
  stairClimbMode,
  currentStage, setCurrentStage,
  clickedStair,
}: {
  worldKey: string;
  groundY?: number;
  stairClimbMode?: React.RefObject<boolean>;
  currentStage?: number;
  setCurrentStage?: (currentStage: number) => void;
  clickedStair?: number | null;
}) {
  const playerGrounded = useRef(false);
  const inJumpAction = useRef(false);
  const body = useRef<any>(null);
  const isAutomated = stairClimbMode?.current || false;

  const pressedKeys = useKeyboardControls();
  const gamepad = useGamepadControls();
  const { yaw } = useFollowCam(
    body,
    [0, 5, 20],
    pressedKeys.current,
    gamepad.current
  );

  const inputVelocity = useMemo(() => new Vector3(), []);

  useEffect(() => {
    if (body.current) {
      body.current.setTranslation({ x: 80, y: -97, z: 85 }, true);
      console.log(body.current.y)
    }
  }, []);

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
    
    const t = body.current.translation();

    // Move rigidbody
    const move = horizontalInput.clone();
    move.y = inputVelocity.y;

    const newPos = {
      x: t.x + move.x * delta * 40,
      y: isAutomated
        ? t.y + move.y * delta * 40 // let stair animation control Y
        : Math.max(groundY, t.y + move.y * delta * 40),
      z: t.z + move.z * delta * 40,
    };

    // Reset jump state on ground
    if (newPos.y <= groundY + 0.01) {
      inputVelocity.y = 0;
      playerGrounded.current = true;
      inJumpAction.current = false;
    }

    let nextPos = newPos;
    
    if (!isAutomated) {
      if (worldKey === "sacrifice") {
        nextPos = clampToBoundary(newPos, rectArea);
      }
    }

    if (!checkCollision(nextPos, worldKey)) {
      body.current.setNextKinematicTranslation(nextPos);
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

  const [stairData, setStairData] = useState<{
    start: [number, number, number];
    end: [number, number, number];
    nextStage: number;
  } | null>(null);

  useEffect(() => {
    if (stairClimbMode && currentStage != null && clickedStair != null && setCurrentStage) {
      let startPos: [number, number, number];
      let endPos: [number, number, number];
      let nextStage: number;
  
      if (currentStage === clickedStair) {
        startPos = coinStairs[clickedStair].bottom;
        endPos = coinStairs[clickedStair].top;
        nextStage = currentStage + 1;
      } else if (currentStage > clickedStair) {
        startPos = coinStairs[clickedStair].top;
        endPos = coinStairs[clickedStair].bottom;
        nextStage = currentStage - 1;
      } else {
        startPos = [0, 0, 0];
        endPos = [0, 0, 0];
        nextStage = 0;
      }
      setStairData({ start: startPos, end: endPos, nextStage });
      console.log(stairData?.start, stairData?.end, stairData?.nextStage, groundY)
    }
  }, [stairClimbMode, currentStage, clickedStair]);

  return (
    <>
      <RigidBody
        ref={body}
        type="kinematicPosition"
        colliders={false} // turn off auto-generated colliders
      >
        {/* add a cuboid collider that matches player size */}
        <mesh visible={false} castShadow receiveShadow>
          <CuboidCollider args={[0.5, 1, 0.5]} /> 
        </mesh>
        <Avatar />
      </RigidBody>
    </>
  );
}