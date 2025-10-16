import { Object3D, Object3DEventMap, Vector3 } from "three";
import { SurfaceHelper } from "./SurfaceHelper";
import { PizzaModel } from "./PizzaModel";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import Model from "@/app/components/util/Model";
import { PosHelper } from "./AnchorHelper";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";
import { SlingshotString } from "./SlingshotString";

// 이제 어케해야할지???? 좀 알려달라 쉽게 영어로

// 사용자가 space키를 클릭하면 wasReleased state가 true되고(state가 낫나?)
// 그게 true되면 희생양이 3d공간 안을 날아서(이부분 어케 구현할지 겁나 이해안감 좀 쉽게 설명해바...
// 날아가는 path를 미리 계산해서 그거대로 이동시키는 거야, 아니면 시시각각 다음 프레임의 위치가 정해지는 거야?
// pizzaSurface랑 닿으면 stop onRoundEnd(true)해야 하고, 안 닿으면 onRoundEnd(false)해야돼.
// 닿는 경우는 아래처럼 하는건가?
// 안 닿는 경우는 또 어떻게 체크하는 거지? 피자 주변에 또다른 면을 만들어서 그거에 충돌할때 onRoundEnd(false)해야하나?
// 그리고... 날아가는 희생자의 회전은 하지 않을 생각이야. 하지만 피자에 박혔을 때는
// 피자에 등이 닿게 해야 하지. 그리고 피자에 박힌 위치와 사이즈를 기억해놨다가, 새로 쏜 희생자가
// 거기에 많이 겹칠 경우 onRoundEnd(false)해야돼.

  // intersection 검사
  // function getHitPoint(
  //   startPos, velocity, gravity,
  //   center, normal, radius
  // ) {
  //   // do something
  // }
  
  // const hitPoint = getHitPoint(
  //   pullPosition.current,
  //   velocity,
  //   gravity,
  //   targetSurface.center,
  //   targetSurface.normal,
  //   targetSurface.radius,
  // )
  // => 희생양을 stop + onRoundEnd()

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
  // 피자
  const pizzaModelScale = 1.2;
  const pizzaPos = useRef(pizzaSurface.center.clone());
  const pizzaOffset = useRef(new Vector3(0, -3, -2));
  const pizzaModelPos = useRef(pizzaPos.current.clone().add(pizzaOffset.current));

  const maxX = 10;
  const minX = -10;
  const direction = useRef(1);

  // 새총
  const slingshotCenter = [0,0,50];
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
    (leftAnchor.y + rightAnchor.y) / 2,
    (leftAnchor.z + rightAnchor.z) / 2,
  )

  const pullPos = useRef(restPos);
  const pressedKeys = useKeyboardControls();
  const gamepad = useGamepadControls();
  const preyRef = useRef<Object3D>(null!);

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

    // pullPos
    const moveSpeed = 30; // units/sec
    const deadzone = 0.5;

    const input = new Vector3();

    // X-axis
    if (pressedKeys.current.has("KeyD") || gamepad.current.axes[0] > deadzone) input.x += 1;
    if (pressedKeys.current.has("KeyA") || gamepad.current.axes[0] < -deadzone) input.x -= 1;

    // Y-axis
    if (pressedKeys.current.has("KeyW") || gamepad.current.axes[1] < -deadzone) input.z -= 1;
    if (pressedKeys.current.has("KeyS") || gamepad.current.axes[1] > deadzone) input.z += 1;

    // Z-axis (use arrow keys for example)
    if (pressedKeys.current.has("ArrowUp")) input.y += 1;
    if (pressedKeys.current.has("ArrowDown")) input.y -= 1;

    if (input.length() > 0) {
      input.normalize().multiplyScalar(moveSpeed * delta);
      pullPos.current.add(input);
    }

    // Optional: clamp pullPos within some bounds
    pullPos.current.x = Math.max(-4, Math.min(4, pullPos.current.x));
    pullPos.current.y = Math.max(5, Math.min(10, pullPos.current.y));
    pullPos.current.z = Math.max(50, Math.min(60, pullPos.current.z));

    if (preyRef.current) {
      preyRef.current.position.copy(pullPos.current);
    }
  });

  return (
    <>
      {/* 임시 바닥 */}
      <mesh rotation-x={-Math.PI / 2} position={[0,0,0]} receiveShadow>
        <planeGeometry args={[10, 100]} />
        <meshStandardMaterial color="white" />
      </mesh>

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
        position={[0,0,50]}
        scale={slingshotScale}
      />
      {/* <AnchorHelper
        leftAnchor={leftAnchor}
        rightAnchor={rightAnchor}
        color="red"
        size={0.5}
      /> */}
      <PosHelper
        pos={restPos}
        color="lime"
        size={0.3}
      />
      <SlingshotString
        leftAnchor={leftAnchor}
        rightAnchor={rightAnchor}
        pullPos={pullPos}
      />

      {/* 희생양 */}
      <primitive
        object={prey[1]}
        rotation={[0,Math.PI,0]}
        ref={preyRef}
        scale={3}
      />


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