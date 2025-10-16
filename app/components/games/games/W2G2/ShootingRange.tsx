import { Vector3 } from "three";
import { SurfaceHelper } from "./SurfaceHelper";
import { PizzaModel } from "./PizzaModel";
import { TargetModel } from "./TargetModel";

const pizzaSurface = {
  center: new Vector3(0, 10, -10),
  normal: new Vector3(0, 1, 1).normalize(),
  radius: 10
}

export default function ShootingRange({
  targetRadius,
  gameOver,
}:{
  targetRadius: number;
  gameOver: (success: boolean) => void;
}) {
  const targetSurface = {
    center: pizzaSurface.center,
    normal: pizzaSurface.normal,
    radius: targetRadius,
  }

  // pizzaSurface에 대한 피자모델의 위치와 크기 차이 보정
  const pizzaModelScale = 1.2;
  const pizzaModelPosition = new Vector3 (
    pizzaSurface.center.x,
    pizzaSurface.center.y-3,
    pizzaSurface.center.z-2,
  )

  // targetSurface에 대한 타겟모델의 위치 차이 보정
  const targetModelPosition = new Vector3 (
    targetSurface.center.x,
    targetSurface.center.y,
    targetSurface.center.z,
  )

  // 슛 했는지를 라운드마다 state로 해서 useEffect해서 바뀌면
  // intersection 검사하고 gameOver해야됨.

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
  // => 이건 희생양을 stop함.

  // const hitPoint = getHitPoint(
  //   pullPosition.current,
  //   velocity,
  //   gravity,
  //   pizzaSurface.center,
  //   pizzaSurface.normal,
  //   pizzaSurface.radius,
  // )
  // => 이건 gameOver()

  return (
    <>
      {/* 피자, 타겟 헬퍼 */}
      <SurfaceHelper {...pizzaSurface} color="red" />
      <SurfaceHelper {...targetSurface} color="green" />

      {/* 임시 바닥 */}
      <mesh rotation-x={-Math.PI / 2} position={[0,0,0]} receiveShadow>
        <planeGeometry args={[10, 100]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* 피자, 타겟 */}
      <PizzaModel
        center={pizzaModelPosition}
        normal={pizzaSurface.normal}
        scale={pizzaModelScale}
      />
      <TargetModel
        center={targetModelPosition}
        normal={targetSurface.normal}
        radius={targetSurface.radius}
        opacity={0.5}
        color='green'
      />

      {/* 조명, 색 */}
      <directionalLight
        intensity={3}
        position={[50,80,-30]}
        color={'white'}
        castShadow
      />
      <color attach="background" args={["white"]} />

      {/* 효과 */}
    </>
  )
}