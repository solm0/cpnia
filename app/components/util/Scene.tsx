'use client'

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import SacrificeLights from "../maps/SacrificeLights";
import Loader from "./Loader";

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
        <SacrificeLights />
        {children}
      </Suspense>
    </Canvas>
  )
}