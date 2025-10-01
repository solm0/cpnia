'use client'

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Loader from "./Loader";
import { EffectComposer, DepthOfField, Bloom, Noise, Outline, Pixelation, Vignette } from "@react-three/postprocessing";

export default function Scene({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 5], fov: 50 }}
      frameloop="always"
    >
      <Suspense fallback={<Loader />}>
        {children}
        
      </Suspense>
      <EffectComposer>
        <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Pixelation granularity={4} />
      </EffectComposer>
    </Canvas>
  )
}