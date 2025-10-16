import { Object3D, Object3DEventMap, Vector3 } from "three";
import { SurfaceHelper } from "./SurfaceHelper";
import { PizzaModel } from "./PizzaModel";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import Model from "@/app/components/util/Model";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";
import { SlingshotString } from "./SlingshotString";
import { Line, OrbitControls } from "@react-three/drei";
import { TrajectoryLine } from "./\bTrajectoryLine";
import { PosHelper } from "./AnchorHelper";

const pizzaSurface = {
  center: new Vector3(0, 10, -10),
  normal: new Vector3(0, 1, 1).normalize(),
  radius: 10
}

export default function ShootingRange({
  onRoundEnd,
  prey,
  pizzaMoveSpeed,
}:{
  onRoundEnd: (success: boolean) => void;
  prey: [string, Object3D<Object3DEventMap>];
  pizzaMoveSpeed: number;
}) {
  // 카메라
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 30, 70);
    camera.lookAt(pizzaSurface.center);
  }, [camera]);

  // 피자
  const pizzaModelScale = 1.2;
  const pizzaPos = useRef(pizzaSurface.center.clone());
  const pizzaOffset = useRef(new Vector3(0, -3, -2));
  const pizzaModelPos = useRef(pizzaPos.current.clone().add(pizzaOffset.current));

  const maxX = 10;
  const minX = -10;
  const direction = useRef(1);

  // 새총
  const slingshotCenter = [0,30,90] as [number, number, number];
  const slingshotScale = 0.1;
  const leftAnchor = new Vector3(
    slingshotCenter[0] - 28 * slingshotScale,
    slingshotCenter[1] + 90 * slingshotScale,
    slingshotCenter[2]
  )
  const rightAnchor = new Vector3(
    slingshotCenter[0] + 28 * slingshotScale,
    slingshotCenter[1] + 90 * slingshotScale,
    slingshotCenter[2]
  )
  const restPos = new Vector3(
    (leftAnchor.x + rightAnchor.x) / 2,
    (leftAnchor.y + rightAnchor.y) / 2 -1,
    (leftAnchor.z + rightAnchor.z) / 2,
  )

  // 조준
  const pullPos = useRef(restPos.clone());
  const pressedKeys = useKeyboardControls();
  const gamepad = useGamepadControls();
  const preyRef = useRef<Object3D>(null!);

  // 발사
  const gravity = new Vector3(0, -9.8, 0);
  const deltaT = 0.05;
  const maxTime = 5;
  const speedFactor = 3;

  const isFlying = useRef(false);
  const flightPath = useRef<Vector3[]>([new Vector3(0, 0, 0), new Vector3(0, 0, 0)]);
  const flightIndex = useRef(0); 

  useFrame((_, delta) => {
    // 피자 왔다갔다
    pizzaPos.current.x += pizzaMoveSpeed * delta * direction.current;

    if (pizzaPos.current.x > maxX) {
      pizzaPos.current.x = maxX;
      direction.current = -1;
    }
    if (pizzaPos.current.x < minX) {
      pizzaPos.current.x = minX;
      direction.current = 1;
    }

    pizzaModelPos.current.copy(pizzaPos.current).add(pizzaOffset.current);

    // --- 조준 ---
    if (!isFlying.current) {
      // pullPos
      const moveSpeed = 3; // units/sec
      const deadzone = 0.5;
      const input = new Vector3();

      if (pressedKeys.current.has("KeyD") || gamepad.current.axes[0] > deadzone) input.x -= 1;
      if (pressedKeys.current.has("KeyA") || gamepad.current.axes[0] < -deadzone) input.x += 1;
      if (pressedKeys.current.has("KeyW") || gamepad.current.axes[1] < -deadzone) input.z -= 1;
      if (pressedKeys.current.has("KeyS") || gamepad.current.axes[1] > deadzone) input.z += 1;
      if (pressedKeys.current.has("ArrowUp")) input.y += 1;
      if (pressedKeys.current.has("ArrowDown")) input.y -= 1;

      if (input.length() > 0) {
        input.normalize().multiplyScalar(moveSpeed * delta);
        pullPos.current.add(input);
      }

      const clampMinX = restPos.x - 4;
      const clampMaxX = restPos.x + 4;
      const clampMinY = restPos.y - 5;
      const clampMaxY = restPos.y + 2;
      const clampMinZ = restPos.z + 0;
      const clampMaxZ = restPos.z + 10;
      pullPos.current.x = Math.max(clampMinX, Math.min(clampMaxX, pullPos.current.x));
      pullPos.current.y = Math.max(clampMinY, Math.min(clampMaxY, pullPos.current.y));
      pullPos.current.z = Math.max(clampMinZ, Math.min(clampMaxZ, pullPos.current.z));

      if (preyRef.current) preyRef.current.position.copy(pullPos.current);

      // precompute
      const start = pullPos.current.clone();
      const velocity = restPos.clone().sub(pullPos.current).multiplyScalar(speedFactor);
      const newPath: Vector3[] = [];

      for (let t = 0; t < maxTime; t += deltaT) {
        const pos = start.clone()
          .add(velocity.clone().multiplyScalar(t))
          .add(gravity.clone().multiplyScalar(0.5 * t * t));
        newPath.push(pos);
      }
      flightPath.current = newPath;
    }

    // --- 발사 ---
    if (isFlying.current) {
      if (flightIndex.current < flightPath.current.length) {
        const pos = flightPath.current[flightIndex.current];
        if (pos) preyRef.current.position.copy(pos);

        // move to next frame position
        flightIndex.current += 1;
      } else {
        isFlying.current = false;
        onRoundEnd(false);
        console.log('false')
      }

      // collision check
      const toPizza = preyRef.current.position.clone().sub(pizzaSurface.center);
      if (toPizza.length() <= pizzaSurface.radius) {
        isFlying.current = false;
        console.log('true')
        onRoundEnd(true);
      }
    }

    // check space key
    if (pressedKeys.current.has("Space")) {
      if (!isFlying.current && flightPath.current.length > 0) {
        isFlying.current = true;
        flightIndex.current = 0;
      }
    }
  });

  return (
    <>
      <OrbitControls
        target={pizzaSurface.center}
        minDistance={130}
        maxDistance={140}
        minPolarAngle={Math.PI / 2.6} // pitch
        maxPolarAngle={Math.PI / 2.5}
        minAzimuthAngle={-Math.PI / 8} // yaw
        maxAzimuthAngle={Math.PI / 8} 
      />

      {/* 지형 */}
      {/* <mesh rotation-x={-Math.PI / 2} position={[0,0,0]} receiveShadow>
        <planeGeometry args={[10, 100]} />
        <meshStandardMaterial color="white" />
      </mesh> */}
      <Model
        src="/models/shop.glb"
        scale={1}
        position={[-60,-30.6,68]}
        rotation={[0,0,0]}
      />

      {/* 피자 */}
      <PizzaModel
        center={pizzaModelPos.current}
        normal={pizzaSurface.normal}
        scale={pizzaModelScale}
      />
      <SurfaceHelper
        center={pizzaPos.current}
        normal={pizzaSurface.normal}
        radius={pizzaSurface.radius}
        color="red"
      />

      {/* 새총 */}
      <Model
        src="/models/slingshot.glb"
        position={slingshotCenter}
        scale={slingshotScale}
      />
      {/* <AnchorHelper
        leftAnchor={leftAnchor}
        rightAnchor={rightAnchor}
        color="red"
        size={0.5}
      />
      <PosHelper
        pos={restPos}
        color="lime"
        size={0.3}
      />
      <PosHelper
        pos={pullPos.current}
        color="lime"
        size={0.3}
      /> */}
      <SlingshotString
        leftAnchor={leftAnchor}
        rightAnchor={rightAnchor}
        pullPos={pullPos}
      />

      {/* 희생양 */}
      <group ref={preyRef} scale={3} rotation={[0, Math.PI, 0]}>
        <primitive object={prey[1]} />
      </group>
      {/* 궤적 라인 */}
      {!isFlying.current && (
        <TrajectoryLine
          pullPos={pullPos}
          restPos={restPos}
          gravity={gravity}
          speedFactor={speedFactor}
          maxTime={maxTime}
          deltaT={deltaT}
        />
      )}

      {/* 빛 */}
      <directionalLight
        intensity={3}
        position={[50,80,-30]}
        color={'white'}
        castShadow
      />
      <color attach="background" args={["white"]} />
    </>
  )
}