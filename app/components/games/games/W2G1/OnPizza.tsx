import Model from "@/app/components/util/Model";
import { Object3D } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

export default function OnPizza({
  pizzaRadius, center, ing, gltfMap
}: {
  pizzaRadius: number;
  center: [number, number, number];
  ing: string[];
  gltfMap: Record<string, Object3D>
}) {
  const pos: [number, number, number] = [center[0], center[1]+3.7, center[2]];

  interface onPizzaDataProp {
    radius: number;
    count: number;
    ing: string;
  }

  const onPizzaData: onPizzaDataProp[] = [];
  
  for (let i = ing.length; i > 0; i--) {
    const radius = (pizzaRadius - 1.5) * i / ing.length;
    const count = Math.floor(radius * 3);

    onPizzaData.push({
      radius: radius,
      count: count,
      ing: ing[i-1]
    })
  }

  const items = onPizzaData.flatMap((layer, layerIndex) => {
    // Rotate odd-numbered layers by half the step angle
    const offset = layerIndex % 2 === 1 ? (Math.PI * 2) / (layer.count * 2) : 0;
  
    return Array.from({ length: layer.count }).map((_, i) => {
      const angle = (i / layer.count) * Math.PI * 2 + offset;
      const x = Math.cos(angle) * layer.radius;
      const z = Math.sin(angle) * layer.radius;
  
      return {
        key: layer.ing,
        position: [pos[0] + x, pos[1], pos[2] + z] as [number, number, number],
        rotation: [0, -angle - 4.8, degToRad(90)] as [number, number, number],
      };
    });
  });

  return (
    <>
      {/* <mesh position={pos}>
        <cylinderGeometry args={[pizzaRadius, pizzaRadius, 0.01, 30]} />
        <meshBasicMaterial color="red" wireframe />
      </mesh> */}

      {/* {onPizzaData.map(layer => (
        <mesh position={pos}>
          <cylinderGeometry args={[layer.radius, layer.radius, 0.01, layer.count]} />
          <meshBasicMaterial color="blue" wireframe />
        </mesh>
      ))} */}

      {items.map((item, i) => (
        <group
          key={i}
          type='fixed'
          position={item.position}
          rotation={item.rotation}
        >
          <primitive
            object={gltfMap[item.key].clone()}
            rotation={[Math.PI / 2, Math.PI / 2, 0]}
        />
        </group>
      ))}
    </>
  )
}