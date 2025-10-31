import { Object3D, Vector3, CatmullRomCurve3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { useMemo } from "react";

export default function PizzaLine({
  doorPos,
  pizzaPos,
  gltfMap,
}: {
  doorPos: Vector3;
  pizzaPos: Vector3;
  gltfMap: Object3D[];
}) {
  const curve = useMemo(() => {
    const dir = new Vector3().subVectors(doorPos, pizzaPos);
    const perp = new Vector3(-dir.z, 0, dir.x).normalize();
    const mid = new Vector3().addVectors(doorPos, pizzaPos).multiplyScalar(0.5);
    const offset = perp.multiplyScalar(-30);
    mid.add(offset);

    // Catmull-Rom 곡선 생성 (y는 모두 0)
    return new CatmullRomCurve3([
      doorPos.clone(),
      mid,
      pizzaPos.clone(),
    ]);
  }, [doorPos, pizzaPos]);

  return (
    <group>
      {gltfMap.map((avatar, i) => {
        const t = (i + Math.random() * 0.2) / (gltfMap.length + 0.3);
        const pos = curve.getPointAt(Math.min(t, 1));
        const rotY = degToRad(Math.random() * 360);

        return (
          <group
            key={i}
            position={[pos.x, 0, pos.z]} // y=0 유지
            rotation={[0, rotY, 0]}
            scale={8}
          >
            <primitive object={avatar.clone(true)} />
          </group>
        );
      })}
    </group>
  );
}