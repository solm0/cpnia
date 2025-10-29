/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { AnimationMixer, LoopRepeat, MathUtils, Object3D, PointLight } from "three";
import Model from "../../util/Model";
import Scene from "../../util/Scene";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { EffectComposer, DepthOfField, Noise, Vignette } from "@react-three/postprocessing";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import Label from "../../util/Label";
import { useSearchParams } from "next/navigation";
import { useAnimGltf } from "@/app/lib/hooks/useAnimGltf";

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
      position={[-2.5, -1.5, -1.5]}
      rotation={[0, MathUtils.degToRad(30), 0]}
    />
  )
}

export function FlickeringPointLight(props: any) {
  const lightRef = useRef<PointLight>(null);
  const [nextToggle, setNextToggle] = useState(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (t > nextToggle) {
      const newIntensity = Math.floor(Math.random() * 4);

      if (lightRef.current) {
        lightRef.current.intensity = newIntensity;
      }

      const duration = 0.5 + Math.random() * 2;
      setNextToggle(t + duration);
    }
  });

  return <pointLight ref={lightRef} {...props} />;
}

export default function InterviewScene() {
  const searchParam = useSearchParams();
  const worldTo = searchParam.get('to');

  const timeNpc = useGLTF('models/avatars/time-npc.glb').scene;
  const sacrificeNpc = useGLTF('models/avatars/olive.gltf').scene;
  const entropyNpc = useGLTF('models/avatars/entropy-npc.glb').scene;
  const computer = useGLTF("/models/computer.glb").scene;

  let model;
  switch(worldTo) {
    case 'time':  model = timeNpc; break;
    case 'sacrifice': model = sacrificeNpc; break;
    case 'entropy': model = entropyNpc; break;
    default: model = entropyNpc;
  }
  
  return (
    <Scene>
      <color attach="background" args={["lightgray"]} />

      <directionalLight
        intensity={1}
        position={[50,30,20]}
        castShadow
      />
      <FlickeringPointLight
        position={[-1.5,1,0]}
        intensity={3}
        color={'blue'}
      />
      <Label
        text={'입국심사실'}
        position={[-3,2,-3]}
        rotation={[0, MathUtils.degToRad(30), 0]}
      />
      <Npc model={model} />
      <Model
        scene={computer}
        scale={2}
        position={[-1.5,-1,0]}
        rotation={[0, MathUtils.degToRad(210), 0]}
      />
      <OrbitControls  />
    </Scene>
  )
}