import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Object3D, Vector3 } from "three"
import { degToRad } from "three/src/math/MathUtils.js";

export default function SlotGame({
  onRoundEnd,
}: {
  onRoundEnd: (success: boolean) => void;
}) {
  const main = useGLTF('/models/pachinko/main.glb').scene;
  const cylinders: Object3D[] = [
    useGLTF('/models/pachinko/cylinder-1.gltf').scene,
    useGLTF('/models/pachinko/cylinder-2.gltf').scene,
    useGLTF('/models/pachinko/cylinder-3.gltf').scene,
  ]
  const handle = useGLTF('/models/pachinko/handle.glb').scene;

  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0,5,10);
    camera.rotation.set(0,0,0);
    camera.lookAt(0, 5, 0);
  }, [camera]);

  const groupRotation = [0, Math.PI, 0] as [number, number, number];

  const mainCenter = new Vector3(0,0,0);
  const handleCenter = new Vector3(
    mainCenter.x - 1.7,
    mainCenter.y + 4,
    mainCenter.z + 1
  );
  const cylinderCenter = new Vector3(
    mainCenter.x - 0.1,
    mainCenter.y + 4.47,
    mainCenter.z - 0.2
  );
  const cylinderGap = 0.56;
  const correction = 40;
  const cylinderInitRotationX = useRef(degToRad(-correction));

  // 랜덤 3개의 각도 뽑기
  const angleObjMap: {angle:number, obj:string}[][] = [
    [
      { angle: 0, obj: 'text' },
      { angle: 50, obj: 'cherry' },
      { angle: 108, obj: 'bell' },
      { angle: 174, obj: 'seven' },
      { angle: 260, obj: 'text' },
    ],
    [
      { angle: 0, obj: 'seven' },
      { angle: 50, obj: 'bell' },
      { angle: 108, obj: 'text' },
      { angle: 184, obj: 'cherry' },
      { angle: 260, obj: 'seven' },
    ],
    [
      { angle: 0, obj: 'cherry' },
      { angle: 57, obj: 'text' },
      { angle: 124, obj: 'seven' },
      { angle: 190, obj: 'bell' },
      { angle: 271, obj: 'cherry' },
    ],
  ]
  const randomAngles = angleObjMap.map(
    reel => reel[Math.floor(Math.random() * reel.length)]
  );

  const rotCount = 5;
  const success = randomAngles.every(a => a.obj === randomAngles[0].obj);
  const finalRot = randomAngles.forEach(item => -(item.angle + correction + 360 * rotCount));

  // motionPhase = useRef<'idle' | 'toSide' | 'handle' | 'toFront' | 'cylinder' | 'done'>('idle');
  // useFrame
  // 버튼 클릭하면 toSide
  // function toSide { if(motionPhase === 'idle') ..., motionPhase.current = 'handle'}
  // ...
  // handle - finalRot[cylinder index] 만큼 돌아가고 페이드아웃

  return (
    <group
      rotation={groupRotation}
    >
      {/* 본체 */}
      <primitive
        object={main}
        position={mainCenter}
      />
      
      {/* 원통 1,2,3 */}
      {cylinders.map((c, index) => {
        const moveX = index === 0
          ? -cylinderGap
          : index === 1 
            ? 0
            : index === 2
              ? cylinderGap
              : 0
        return (
          <primitive
            key={index}
            object={c}
            rotation={[
              cylinderInitRotationX.current,
              0,
              0
            ]}
            position={[
              cylinderCenter.x + moveX,
              cylinderCenter.y,
              cylinderCenter.z
            ]}
          />
        )
      })}

      {/* 손잡이 */}
      <primitive
        object={handle}
        rotation={[degToRad(5), 0, 0]}
        position={[
          handleCenter.x,
          handleCenter.y,
          handleCenter.z
        ]}
      />
    </group>
  )
}