import Scene from "@/app/components/util/Scene";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Object3D, Vector3, Mesh, Material } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

function disposeObject(obj: Object3D) {
  obj.traverse(child => {
    if ((child as Mesh).isMesh) {
      const mesh = child as Mesh;
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        (mesh.material as Material[]).forEach((m: Material) => m.dispose());
      } else {
        (mesh.material as Material).dispose();
      }
    }
  });
}

function useClones(coin: Object3D, count: number) {
  const [clones, setClones] = useState<Object3D[]>([]);
  const prevRef = useRef<Object3D[]>([]);

  useEffect(() => {
    // 이전 clone dispose
    prevRef.current.forEach(disposeObject);

    // 새 clone 생성
    const newClones = Array.from({ length: count }, () => coin.clone());
    setClones(newClones);
    prevRef.current = newClones;
  }, [coin, count]);

  return clones;
}

export default function CoinPile({
  coin,
  count,
  x = 0,
}: {
  coin: Object3D;
  count: number;
  x?: number;
}) {
  const clones = useClones(coin, count);
  if (count === 0) return null;

  return (
    <Scene>
      <group rotation={[degToRad(50), 0, 0]}>
        {clones.map((c, i) => (
          <primitive
            key={i}
            object={c}
            scale={0.00016}
            position={[x, 0.11 * i, 0]}
          />
        ))}
      </group>
      <directionalLight intensity={10} position={[1,5,8]}/>
    </Scene>
  );
}

export function CoinPileOnTable({
  coin,
  count,
  position,
}: {
  coin: Object3D;
  count: number;
  position: Vector3;
}) {
  const clones = useClones(coin, count);
  if (count === 0) return null;

  return (
    <group position={position}>
      {clones.map((c, i) => (
        <primitive
          key={i}
          object={c}
          scale={0.00004}
          position={[0, 0.03 * i, 0]}
        />
      ))}
    </group>
  );
}

export const CoinPileOnTableWRef = forwardRef(function CoinPileOnTableWRef(
  {
    coin,
    count,
    position,
  }: {
    coin: Object3D;
    count: number;
    position: Vector3;
  },
  ref
) {
  const clones = useClones(coin, count);
  if (count === 0) return null;

  return (
    <group position={position} ref={ref}>
      {clones.map((c, i) => (
        <primitive
          key={i}
          object={c}
          scale={0.00004}
          position={[0, 0.03 * i, 0]}
        />
      ))}
    </group>
  );
});