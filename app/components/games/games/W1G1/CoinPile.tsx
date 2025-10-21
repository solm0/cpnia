import Scene from "@/app/components/util/Scene";
import { Object3D } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

export default function CoinPile({
  coin, count,
}: {
  coin: Object3D;
  count: number;
}) {
  return (
    <Scene>
      <group rotation={[degToRad(55), 0, 0]}>
        {[...Array(count).keys()].map((c) => {
          const y = 0.1 * c;
          return (
            <primitive
              key={c}
              object={coin.clone()}
              scale={0.00015}
              position={[0, y, 0]}
            />
          )
        })}
      </group>
      <directionalLight intensity={10} position={[1,5,8]} color={'yellow'}/>
     </Scene>
  )
}