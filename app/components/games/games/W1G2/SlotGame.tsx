import Button from "@/app/components/util/Button";
import { Html, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RefObject, useEffect, useRef, useState } from "react";
import { Object3D, Vector3 } from "three"
import { degToRad, MathUtils } from "three/src/math/MathUtils.js";

export default function SlotGame({
  onRoundEnd, motionPhase, setSuccess,
}: {
  onRoundEnd: (success: boolean) => void;
  motionPhase: RefObject<'idle' | 'toSide' | 'handle' | 'toFront' | 'cylinder' | 'done'>;
  setSuccess: (success: boolean) => void;
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

  const groupRotation = useRef<[number, number, number]>([0, Math.PI, 0]);

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
  const cylinderRefs = useRef<Object3D[]>([]);

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

  const spins = 5;
  const finalRot = randomAngles.map(item => item.angle + 360 * spins);
  const success = randomAngles.every(a => a.obj === randomAngles[0].obj);

  const rotationProgress = useRef(0);

  useFrame((_, delta) => {
    if (motionPhase.current === 'toSide') {
      // groupRotation.y값이 Math.PI에서 Math.PI/1.5
      groupRotation.current[1] = Math.max(groupRotation.current[1] - delta, Math.PI / 1.5);
      if (groupRotation.current[1] <= Math.PI / 1.5) {
        motionPhase.current = 'handle';
      }
    }
    if (motionPhase.current === 'handle') {
      // handleRotation.x 값이 degToRad(5)에서 degToRad(-85)로 갔다가 돌아옴.
      motionPhase.current = 'toFront';
    }
    if (motionPhase.current === 'toFront') {
      // groupRotation.y값이 Math.PI/1.5에서 // groupRotation.y값이 Math.PI에서 Math.PI
      groupRotation.current[1] = Math.max(groupRotation.current[1] + delta, Math.PI);
      if (groupRotation.current[1] >= Math.PI) {
        motionPhase.current = 'cylinder';
      }
    }
    if (motionPhase.current === 'cylinder') {
      if (motionPhase.current === 'cylinder' && rotationProgress.current === 0) {
        cylinderRefs.current.forEach(c => {
          c.rotation.x = degToRad(-correction);
        });
      }

      console.log('cylinder 0 initial rot.x', cylinderRefs.current[0]?.rotation.x);

      // 각 cylinder들이 저마다의 finalRot[cylinder index]만큼 돌아가고 멈춘다.
      rotationProgress.current = Math.min(rotationProgress.current + delta * 1, 1);

      cylinderRefs.current.forEach((c, i) => {
        const startRot = degToRad(-correction);
        const endRot = degToRad(finalRot[i]-correction);
        console.log(randomAngles[0].obj, randomAngles[1].obj, randomAngles[2].obj)
        c.rotation.x = MathUtils.lerp(startRot, endRot, rotationProgress.current);
      });

      if (rotationProgress.current >= 1) {
        motionPhase.current = 'done';
      }
    }
  })

  return (
    <>
      <group rotation={groupRotation.current}>
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
              ref={(el: Object3D) => {
                if (el) cylinderRefs.current[2-index] = el;
              }}
              object={c}
              rotation={[cylinderInitRotationX.current, 0, 0]}
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
    </>
  )
}