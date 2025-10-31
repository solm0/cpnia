'use client'

import { AnimationMixer, LoopRepeat, MathUtils, Object3D, PointLight } from "three";
import Model from "../../util/Model";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import Label from "../../util/Label";
import { useSearchParams } from "next/navigation";
import { useAnimGltf } from "@/app/lib/hooks/useAnimGltf";

useGLTF.preload("/models/animations/idle.glb");
useGLTF.preload("/models/animations/walk.glb");
useGLTF.preload("/models/animations/jump.glb");
useGLTF.preload("/models/animations/arm.glb");
useGLTF.preload("/models/avatars/time-npc.gltf");
useGLTF.preload("/models/avatars/olive.gltf");
useGLTF.preload("/models/avatars/entropy-npc.gltf");
useGLTF.preload("/models/computer.glb");

function Npc({
  model
}: {
  model: Object3D;
}) {
  const animGltf = useAnimGltf()[3];
  const mixer = useRef<AnimationMixer | null>(null);
  useEffect(() => {
    mixer.current = new AnimationMixer(model);
    return () => {
      mixer.current?.stopAllAction();
    };
  }, [model]);

  useEffect(() => {
    if (!mixer.current) return;
    const anim = animGltf?.animations?.[0];
    if (!anim) return;
  
    const action = mixer.current.clipAction(anim);
    action
      .reset()
      .setLoop(LoopRepeat, Infinity)
      .play();
  }, [animGltf]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <Model
      scene={model}
      scale={3}
      position={[-2.5, -1.8, -1.5]}
      rotation={[0, MathUtils.degToRad(30), 0]}
    />
  )
}

export function FlickeringPointLight({
  pos = [-1.5,0.5,0],
  intensity = 30,
  dur = 2,
  color = 'blue',
}: {
  pos?: [number, number, number];
  intensity?: number;
  dur?: number;
  color?: string
}) {
  const lightRef = useRef<PointLight>(null);
  const [nextToggle, setNextToggle] = useState(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (t > nextToggle) {
      const newIntensity = Math.floor(Math.random() * intensity);

      if (lightRef.current) {
        lightRef.current.intensity = newIntensity;
      }

      const duration = Math.random() * dur;
      setNextToggle(t + duration);
    }
  });

  return <pointLight ref={lightRef} position={pos} color={color} />;
}

export default function InterviewScene() {
  const searchParam = useSearchParams();
  const worldTo = searchParam.get('to');

  const timeNpc = useGLTF('/models/avatars/time-npc.gltf').scene;
  const sacrificeNpc = useGLTF('/models/avatars/olive.gltf').scene;
  const entropyNpc = useGLTF('/models/avatars/entropy-npc.gltf').scene;
  const computer = useGLTF("/models/computer.glb").scene;

  let model;
  switch(worldTo) {
    case 'time':  model = timeNpc; break;
    case 'sacrifice': model = sacrificeNpc; break;
    case 'entropy': model = entropyNpc; break;
    default: model = entropyNpc;
  }

  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0,0,5.5);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  return (
    <>
      <color attach="background" args={["lightgray"]} />

      <directionalLight
        intensity={5}
        position={[30,20,20]}
        castShadow
      />
      <FlickeringPointLight />
      <Label
        text={'입국심사실'}
        position={[-3,2.7,-3]}
        rotation={[0, MathUtils.degToRad(30), 0]}
      />
      <Npc model={model} />
      <Model
        scene={computer}
        scale={2}
        position={[-1.5,-1.3,0]}
        rotation={[0, MathUtils.degToRad(210), 0]}
      />
      <OrbitControls  />
    </>
  )
}