import { OrbitControls, useGLTF } from "@react-three/drei";
import { Object3D, Vector3 } from "three"

export default function SlotGame() {
  const mainCenter = new Vector3(0,0,0);
  const handleCenter = new Vector3(mainCenter.x, mainCenter.y, mainCenter.z);
  const cylinderCenter = new Vector3(mainCenter.x, mainCenter.y, mainCenter.z);

  // 원통 돌아가기 - 그림 있는

  // 손잡이 일정 각도로 돌아갔다가 돌아가기
  const main = useGLTF('/models/pachinko/main.glb').scene;
  const cylinders: Object3D[] = [
    useGLTF('/models/pachinko/cylinder-1.gltf').scene,
    useGLTF('/models/pachinko/cylinder-2.gltf').scene,
    useGLTF('/models/pachinko/cylinder-3.gltf').scene,
  ]
  const handle = useGLTF('/models/pachinko/handle.gltf').scene;

  return (
    <>
      {/* 본체 */}
      <primitive
        object={main}
        rotation={[0, Math.PI, 0]}
        position={mainCenter}
      />
      
      {/* 원통 1,2,3 */}
      {cylinders.map((c, index) => (
        <primitive
          key={index}
          object={c}
          position={[
            cylinderCenter.x,
            cylinderCenter.y,
            cylinderCenter.z
          ]}
        />
      ))}

      {/* 손잡이 */}
      <primitive
        object={handle}
        rotation={[0, Math.PI, 0]}
        position={[
          handleCenter.x+5.1,
          handleCenter.y+3,
          handleCenter.z
        ]}
      />

      {/* 빛 */}
      <directionalLight intensity={3} position={[0,30,40]} />
      <OrbitControls minDistance={10} maxDistance={50} />
    </>
  )
}