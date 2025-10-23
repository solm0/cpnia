import Scene from "@/app/components/util/Scene";
import { forwardRef, RefObject } from "react";
import { Object3D, Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

export default function CoinPile({
  coin, count, x = 0,
}: {
  coin: Object3D;
  count: number;
  x?: number
}) {
  return (
    <Scene>
      <group rotation={[degToRad(50), 0, 0]}>
        {[...Array(count).keys()].map((c) => {
          const y = 0.11 * c;
          return (
            <primitive
              key={c}
              object={coin.clone()}
              scale={0.00016}
              position={[x, y, 0]}
            />
          )
        })}
      </group>
      <directionalLight intensity={10} position={[1,5,8]}/>
     </Scene>
  )
}

export function CoinPileOnTable({
  coin, count, position,
}: {
  coin: Object3D;
  count: number;
  position: Vector3;
}) {
  if (count === 0) return null;
  else return (
    <group position={position}>
      {[...Array(count).keys()].map((c) => {
        const y = 0.03 * c;
        return (
          <primitive
            key={c}
            object={coin.clone()}
            scale={0.00004}
            position={[0, y, 0]}
          />
        )
      })}
    </group>
  )
}

export const CoinPileOnTableWRef = forwardRef(function CoinPileOnTable(
  {
    coin,
    count,
    position
  }: {
    coin: Object3D;
    count: number;
    position: Vector3;
  },
  ref
) {
  return (
    <group position={position} ref={ref}>
      {[...Array(count).keys()].map((c) => {
        const y = 0.03 * c;
        return (
          <primitive
            key={c}
            object={coin.clone()}
            scale={0.00004}
            position={[0, y, 0]}
          />
        );
      })}
    </group>
  );
});