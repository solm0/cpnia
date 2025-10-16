import { Vector3 } from "three";
import { SurfaceHelper } from "./SurfaceHelper";
import { PizzaModel } from "./PizzaModel";

const pizzaSurface = {
  center: new Vector3(0, 2, -10),
  normal: new Vector3(0, 1, 1).normalize(),
  radius: 30
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

  // pizzaSurface에 대한 피자모델의 상대적인 위치와 크기 차이 보정
  const pizzaModelScale = 1;
  const pizzaModelPosition = new Vector3 (
    pizzaSurface.center.x,
    pizzaSurface.center.y,
    pizzaSurface.center.z,
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

      {/* 피자, 타겟 */}
      <PizzaModel
        center={pizzaModelPosition}
        normal={pizzaSurface.normal}
        scale={pizzaModelScale}
      />

      {/* 임시 바닥 */}
      <mesh rotation-x={-Math.PI / 2} position={[0,0,0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* 조명, 색 */}
      <directionalLight intensity={1} position={[20,10,30]} color={'white'} />
      <color attach="background" args={["white"]} />

      {/* 효과 */}
    </>
  )
}