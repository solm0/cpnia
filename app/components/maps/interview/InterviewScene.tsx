/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { MathUtils } from "three";
import Model from "../../util/Model";
import Scene from "../../util/Scene";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, DepthOfField, Noise, Vignette } from "@react-three/postprocessing";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Label from "../../util/Label";

export function FlickeringPointLight(props: any) {
  const lightRef = useRef<THREE.PointLight>(null);
  const [nextToggle, setNextToggle] = useState(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (t > nextToggle) {
      // Pick a new intensity level randomly (0–3)
      const newIntensity = Math.floor(Math.random() * 4);

      if (lightRef.current) {
        lightRef.current.intensity = newIntensity;
      }

      // Schedule next toggle between 1–3 seconds later
      const duration = 0.5 + Math.random() * 2;
      setNextToggle(t + duration);
    }
  });

  return <pointLight ref={lightRef} {...props} />;
}

export default function InterviewScene() {
  return (
    <Scene>
      <color attach="background" args={["lightgray"]} />
      <EffectComposer>
        <Noise opacity={0.02} />
        <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={1} height={480} />
        <Vignette eskil={false} offset={0.1} darkness={1} />
      </EffectComposer>

      <directionalLight
        intensity={1}
        position={[0.5,10,2]}
        castShadow
      />
      <FlickeringPointLight
        position={[-2.5,0,-1]}
        intensity={1}
        color={'blue'}
      />
      <Label
        text={'입국심사실'}
        position={[-3,2,-3]}
        rotation={[0, MathUtils.degToRad(30), 0]}
      />
      <Model
        src="/models/avatar.glb"
        scale={3}
        position={[-2.5, -1, -1.5]}
        rotation={[0, MathUtils.degToRad(30), 0]}
      />
      <Model
        src="/models/computer.glb"
        scale={2}
        position={[-1.5,-1,0]}
        rotation={[0, MathUtils.degToRad(210), 0]}
      />
      <OrbitControls enableZoom={false} />
    </Scene>
  )
}