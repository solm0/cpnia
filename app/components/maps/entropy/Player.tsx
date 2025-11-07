/* eslint-disable @typescript-eslint/no-explicit-any */

import { Euler, Mesh, Object3D, Quaternion, Scene, Vector3 } from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";
import { RigidBody } from "@react-three/rapier";
import { Boundary, clampToBoundary } from "@/app/components/maps/player/clampToBoundary";
import { Avatar } from "../player/Avatar";
import { useFollowCam } from "../player/useFollowCam";
import { CuboidCollider } from "@react-three/rapier";
import { usePlayerStore } from "@/app/lib/state/playerStore";
import { degToRad } from "three/src/math/MathUtils.js";
import { checkCollision } from "../player/checkCollision";
import { use3dFocusStore } from "@/app/lib/gamepad/inputManager";

export function getNearbyMeshes(origin: Vector3, radius: number, scene: Scene) {
  const nearby: Mesh[] = [];
  scene.traverse((obj) => {
    if ((obj as Mesh).isMesh && obj.visible) {
      const pos = new Vector3();
      obj.getWorldPosition(pos);
      const dist = pos.distanceTo(origin);
      if (dist <= radius) nearby.push(obj as Mesh);
    }
  });
  return nearby;
}

export function hasAncestorWithId(obj: Object3D, id: string): boolean {
  let current: Object3D | null = obj;
  while (current) {
    if (current.userData?.id === id) return true;
    current = current.parent;
  }
  return false;
}

export function findAncestorWithId(obj: Object3D): Object3D | null {
  let current: Object3D | null = obj;
  while (current) {
    if (current.userData?.id) return current;
    current = current.parent;
  }
  return null;
}

export default function Player({
  worldKey, avatar, rectArea, center
}: {
  worldKey: string;
  avatar: Object3D;
  rectArea: Boundary[];
  center: Vector3;
}) {
  const playerGrounded = useRef(false);
  const inJumpAction = useRef(false);
  const body = useRef<any>(null);
  const [activeAction, setActiveAction] = useState(0);

  const pressedKeys = useKeyboardControls();
  const gamepad = useGamepadControls();
  const { yaw } = useFollowCam(
    body,
    [0, 10, 20],
    [degToRad(20),0,0],
    pressedKeys.current,
    gamepad.current
  );
  const { scene } = useThree();

  // chatnpc를 위한 player position 저장
  const setIsMoving = usePlayerStore((state) => state.setIsMoving);
  const setPosition = usePlayerStore((state) => state.setPosition);
  const wasMoving = useRef(false);

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
    const moveSpeed = 40;
    let nextAction = 0; // idle

    // console.log(Object.entries(gamepad.current.buttons).find((button) => button[1] === true))

    // Input
    let horizontal = 0;
    let vertical = 0;
    if (pressedKeys.current.has("KeyD")) {
      horizontal += speed;
      nextAction = 1
    }
    if (pressedKeys.current.has("KeyA")) {
      horizontal -= speed;
      nextAction = 1
    }
    if (pressedKeys.current.has("KeyS")) {
      vertical += speed;
      nextAction = 1
    }
    if (pressedKeys.current.has("KeyW")) {
      vertical -= speed;
      nextAction = 1
    }

    if (gamepad) {
      if (gamepad.current.axes[0] > deadzone) {
        horizontal += speed;
        nextAction = 1
      }
      if (gamepad.current.axes[0] < -deadzone) {
        horizontal -= speed;
        nextAction = 1
      }
      if (gamepad.current.axes[1] > deadzone) {
        vertical += speed;
        nextAction = 1
      }
      if (gamepad.current.axes[1] < -deadzone) {
        vertical -= speed;
        nextAction = 1
      }
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
      y: Math.max(center.y, t.y + move.y * delta * moveSpeed),
      z: t.z + move.z * delta * moveSpeed,
    };
    
    // Reset jump state on ground
    if (newPos.y <= center.y + 0.01) {
      inputVelocity.y = 0;
      playerGrounded.current = true;
      inJumpAction.current = false;
    }
    
    if (activeAction !== nextAction) {
      console.log(nextAction)
      setActiveAction(nextAction);
    }
  
    const nextPos = clampToBoundary(newPos, rectArea);

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

    // focusedObj를 찾는다
    const playerPos = new Vector3(t.x, t.y, t.z);
    const playerRoot = body.current as Object3D;

    function isDescendant(child: Object3D, parent: Object3D): boolean {
      let current: Object3D | null = child;
      while (current) {
        if (current === parent) return true;
        current = current.parent;
      }
      return false;
    }

    const nearby = getNearbyMeshes(playerPos, 20, scene)
      .filter(obj => 
        !isDescendant(obj, playerRoot) &&
        !hasAncestorWithId(obj, 'its me') && !hasAncestorWithId(obj, 'its chatnpc')
      );

    // --- 여기서부터 ---
    let ancestor: Object3D | null = null;

    if (nearby.length > 0) {
      const nearest = nearby.reduce((prev, curr) => {
        const prevPos = new Vector3(), currPos = new Vector3();
        prev.getWorldPosition(prevPos);
        curr.getWorldPosition(currPos);
        return currPos.distanceTo(playerPos) < prevPos.distanceTo(playerPos) ? curr : prev;
      });
      ancestor = findAncestorWithId(nearest);
    }

    const prevFocused = use3dFocusStore.getState().focusedObj;

    if (ancestor) {
      if (!prevFocused || prevFocused.id !== ancestor.userData.id) {
        use3dFocusStore.getState().setFocusedObj({
          id: ancestor.userData.id,
          onClick: ancestor.userData.onClick,
        });
        console.log(use3dFocusStore.getState().focusedObj)
      }
    } else {
      if (prevFocused) {
        use3dFocusStore.getState().setFocusedObj(null);
        console.log(use3dFocusStore.getState().focusedObj)
      }
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
        <Avatar animIndex={activeAction} avatar={avatar} />
      </RigidBody>
      {/* <DebugBoundaries boundaries={rectArea} /> */}
    </>
  );
}