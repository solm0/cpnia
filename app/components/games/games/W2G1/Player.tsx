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
import { Avatar } from "@/app/components/maps/player/Avatar";

export default function Player({
  config, rectArea, avatar
}: {
  config?: { playerPos: Vector3, playerRot: Vector3, camYRot: number };
  rectArea: Boundary[];
  avatar: Object3D;
}) {
  const playerGrounded = useRef(false);
  const inJumpAction = useRef(false);
  const body = useRef<any>(null);
  const [activeAction, setActiveAction] = useState(0);

  const pressedKeys = useKeyboardControls();
  const gamepad = useGamepadControls();
  const { yaw } = useFollowCam(
    body,
    [0, 0,0],
    [0,0, 0],
    pressedKeys.current,
    gamepad.current
  );

  // chatnpc를 위한 player position 저장
  const setIsMoving = usePlayerStore((state) => state.setIsMoving);
  const setPosition = usePlayerStore((state) => state.setPosition);
  const wasMoving = useRef(false);

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
    const moveSpeed = 20;
    let nextAction = 0; // idle

    // Input
    let horizontal = 0;
    let vertical = 0;
    if (pressedKeys.current.has("KeyD") || gamepad.current.axes[0] > deadzone) {
      horizontal += speed;
      console.log('d pressed')
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

    if (inJumpAction.current) {
      nextAction = 2;
    } else if (horizontalInput.lengthSq() > 0) {
      nextAction = 1;
    } else {
      nextAction = 0;
    }
    
    const t = body.current.translation();
    
    // --- chatnpc를 위한 player position 저장
    const isInputting = horizontal !== 0 || vertical !== 0;
    
    if (isInputting && !wasMoving.current) {
      setIsMoving(true);
      wasMoving.current = true;
    } else if (!isInputting && wasMoving.current) {
      setIsMoving(false);
      wasMoving.current = false;
      
      // player가 멈추면 final position 저장
      setPosition({ x: t.x, y: t.y, z: t.z });
    }
    
    // Move rigidbody
    const move = horizontalInput.clone();
    move.y = inputVelocity.y;
    
    const newPos = {
      x: t.x + move.x * delta * moveSpeed,
      y: Math.max(0, t.y + move.y * delta * moveSpeed),
      z: t.z + move.z * delta * moveSpeed,
    };
    
    // Reset jump state on ground
    if (newPos.y <= 0 + 0.01) {
      inputVelocity.y = 0;
      playerGrounded.current = true;
      inJumpAction.current = false;
    }
    
    if (activeAction !== nextAction) {
      console.log(nextAction)
      setActiveAction(nextAction);
    }
    
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
        {/* <Avatar animIndex={activeAction} avatar={avatar} /> */}
      </RigidBody>
      {/* <DebugBoundaries boundaries={rectArea} /> */}
    </>
  );
}