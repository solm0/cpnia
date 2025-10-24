/* eslint-disable @typescript-eslint/no-explicit-any */

import { Euler, Quaternion, Vector3 } from "three";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";
import { RigidBody } from "@react-three/rapier";
import { Avatar } from "@/app/components/maps/player/Avatar";
import { useFollowCam } from "@/app/components/maps/player/useFollowCam";
import { CuboidCollider } from "@react-three/rapier";
import { degToRad } from "three/src/math/MathUtils.js";
import { Field, PlayerData } from "../W3G2";
import { clampToField } from "./clampToField";

export default function Player({
  playerRef, field, isBreaking
}: {
  playerRef: RefObject<PlayerData>;
  field: Field;
  isBreaking: RefObject<boolean>;
}) {
  const playerGrounded = useRef(false);
  const inJumpAction = useRef(false);
  const body = useRef<any>(null);
  const [activeAction, setActiveAction] = useState(0);

  const pressedKeys = useKeyboardControls();
  const gamepad = useGamepadControls();
  const { yaw } = useFollowCam(
    body,
    [0, 5, 20],
    [degToRad(20),0,0],
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
    const moveSpeed = 50;
    let nextAction = 0; // idle

    // console.log(Object.entries(gamepad.current.buttons).find((button) => button[1] === true))

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

    // Breaking
    if (isBreaking.current === true) {
      nextAction = 3;
    }
    
    const t = body.current.translation();
    const r = body.current.rotation();

    // playerRef 업데이트
    if (playerRef.current) {
      playerRef.current.position = new Vector3(t.x, t.y, t.z);
      playerRef.current.rotation = new Quaternion(r.x, r.y, r.z, r.w);
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
    
    /* --- clamp 끄는법: 이걸 주석처리하고 --- */
    const nextPos = clampToField(newPos, field);

    // if (!checkCollision(nextPos, worldKey)) {
    //   body.current.setNextKinematicTranslation(nextPos);
    // }

    /* --- 이걸 주석 해제한다 --- */
    body.current.setNextKinematicTranslation(nextPos);

    // 게임에선 일단 collision만 끔

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
        ref={body}
        type="kinematicPosition"
        colliders={false} // turn off auto-generated colliders
      >
        {/* add a cuboid collider that matches player size */}
        <mesh visible={false} castShadow receiveShadow>
          <CuboidCollider args={[0.5, 1, 0.5]} /> 
        </mesh>
        <Avatar animIndex={activeAction} />
      </RigidBody>
      {/* <FieldHelper field={field} /> */}
    </>
  );
}