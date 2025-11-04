/* eslint-disable @typescript-eslint/no-explicit-any */

import { Euler, Object3D, Quaternion, Vector3 } from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";
import { RigidBody } from "@react-three/rapier";
import { Boundary, clampToBoundary } from "@/app/components/maps/player/clampToBoundary";
import { checkCollision } from "../player/checkCollision";
import { Avatar } from "../player/Avatar";
import { useFollowCam } from "../player/useFollowCam";
import { useStairClimb } from "./useStairClimb";
import { CuboidCollider } from "@react-three/rapier";
import { DebugBoundaries } from "../player/debogBoundaries";
import { degToRad } from "three/src/math/MathUtils.js";
import { coinStairProp } from "./TimeMap";
import { usePlayerStore } from "@/app/lib/state/playerStore";
import { stagePositions } from "@/app/lib/data/positions/stagePositions";
import { findAncestorWithId, getNearbyMeshes, hasAncestorWithId } from "../sacrifice/Player";
import { use3dFocusStore } from "@/app/lib/gamepad/inputManager";

export default function PlayerWithStair({
  worldKey,
  groundY = 0,
  stairClimbMode,
  currentStage, setCurrentStage,
  clickedStair,
  avatar,
  stairPosData,
  config,
}: {
  worldKey: string;
  groundY?: number;
  stairClimbMode?: React.RefObject<boolean>;
  currentStage?: number;
  setCurrentStage?: (currentStage: number) => void;
  clickedStair?: number | null;
  avatar: Object3D;
  stairPosData: coinStairProp[];
  config?: { playerPos: Vector3, playerRot: Vector3, camXRot: number, camYRot: number, zoom: number, }
}) {
  const timeClampArea: Boundary[] = [
    { 
      type: "rect",
      center: [stagePositions.card.x-12, stagePositions.card.z+20],
      y: stagePositions.card.y+99,
      rotation: [0,degToRad(-34),0],
      size: [41,63],
    },
    {
      type: "circle",
      center: [stagePositions.pachinko.x-5, stagePositions.pachinko.z],
      radius: 43,
      y: stagePositions.pachinko.y+43,
    },
    {
      type: "circle",
      center: [stagePositions.roulette.x,stagePositions.roulette.z],
      radius: stagePositions.roulette.scale * 10.5,
      y: stagePositions.roulette.y * stagePositions.roulette.scale * -0.5,
    },
  ];
  
  const playerGrounded = useRef(false);
  const inJumpAction = useRef(false);
  const body = useRef<any>(null);
  const [activeAction, setActiveAction] = useState(0);

  let isAutomated = stairClimbMode?.current || false;

  const pressedKeys = useKeyboardControls();
  const gamepad = useGamepadControls();
  const { yaw } = useFollowCam(
    body,
    [0, 10, config?.zoom ?? 50],
    [degToRad(config?.camXRot ?? 20), degToRad(config?.camYRot ?? 0), 0],
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
    const moveSpeed = 40;
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
      y: isAutomated
        ? t.y + move.y * delta * 40 // let stair animation control Y
        : Math.max(groundY, t.y + move.y * delta * moveSpeed),
      z: t.z + move.z * delta * moveSpeed,
    };

    // Reset jump state on ground
    if (newPos.y <= groundY + 0.01) {
      inputVelocity.y = 0;
      playerGrounded.current = true;
      inJumpAction.current = false;
    }

    if (activeAction !== nextAction) {
      // console.log(nextAction)
      setActiveAction(nextAction);
    }

    const nextPos = isAutomated ? newPos : clampToBoundary(newPos, timeClampArea);

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

    const nearby = getNearbyMeshes(playerPos, 30, scene)
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

  const [stairData, setStairData] = useState<{
    start: [number, number, number];
    end: [number, number, number];
    nextStage: number;
    count: number;
  } | null>(null);

  useEffect(() => {
    if (stairClimbMode && currentStage != null && clickedStair != null && setCurrentStage) {
      let startPos: [number, number, number];
      let endPos: [number, number, number];
      let nextStage: number;
      let count: number;
  
      if (currentStage === clickedStair) {
        startPos = stairPosData[clickedStair].bottom;
        endPos = stairPosData[clickedStair].top;
        nextStage = currentStage + 1;
        if (clickedStair === 1) {
          count = 10;
        } else {
          count= 5;
        }
      } else if (currentStage > clickedStair) {
        startPos = stairPosData[clickedStair].top;
        endPos = stairPosData[clickedStair].bottom;
        nextStage = currentStage - 1;
        if (clickedStair === 1) {
          count = 10;
        } else {
          count= 5;
        }
      } else {
        startPos = [0, 0, 0];
        endPos = [0, 0, 0];
        nextStage = 0;
        count = 0;
      }
      
      setStairData({ start: startPos, end: endPos, nextStage: nextStage, count: count });
    }
  }, [stairClimbMode, currentStage, clickedStair]);
  
  useStairClimb(
    body,
    stairData?.start ?? [0, 0, 0],
    stairData?.end ?? [0, 0, 0],
    stairData?.count ?? 11,
    stairClimbMode!,
    () => {
      if (stairData && setCurrentStage) {
        setCurrentStage(stairData.nextStage);
        console.log('currentstage', currentStage, 'nextstage', stairData.nextStage)
      }
      isAutomated = false;
    }
  );

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
      {/* <DebugBoundaries boundaries={timeClampArea} /> */}
    </>
  );
}