import { Object3D, Object3DEventMap, Vector3 } from "three";
import { SurfaceHelper } from "./SurfaceHelper";
import { PizzaModel } from "./PizzaModel";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

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
  const pizzaModelScale = 1.2;

  // main helper position
  const pizzaPos = useRef(
    pizzaSurface.center.clone()
  );

  // model position with offset relative to helper
  const pizzaOffset = useRef(new Vector3(0, -3, -2));
  const pizzaModelPos = useRef(pizzaPos.current.clone().add(pizzaOffset.current));

  const maxX = 10;
  const minX = -10;

  // track current direction for bouncing
  const direction = useRef(1); // 1 = right, -1 = left

  useFrame((_, delta) => {
    // move helper
    pizzaPos.current.x += pizzaMoveSpeed * delta * direction.current;

    // bounce at edges
    if (pizzaPos.current.x > maxX) {
      pizzaPos.current.x = maxX;
      direction.current = -1;
    }
    if (pizzaPos.current.x < minX) {
      pizzaPos.current.x = minX;
      direction.current = 1;
    }

    // update pizza model to follow helper + offset
    pizzaModelPos.current.copy(pizzaPos.current).add(pizzaOffset.current);
  });

  return (
    <>
      <SurfaceHelper
        center={pizzaPos.current}
        normal={pizzaSurface.normal}
        radius={pizzaSurface.radius}
        color="red"
      />

      <mesh rotation-x={-Math.PI / 2} position={[0,0,0]} receiveShadow>
        <planeGeometry args={[10, 100]} />
        <meshStandardMaterial color="white" />
      </mesh>

      <PizzaModel
        center={pizzaModelPos.current}
        normal={pizzaSurface.normal}
        scale={pizzaModelScale}
      />

      <primitive object={prey} />

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

  // 슛 했는지를 라운드마다 state로 해서 useEffect해서 바뀌면
  // intersection 검사하고 onRoundEnd해야됨.

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