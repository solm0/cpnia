'use client'

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Loader from "./Loader";

export default function Scene({
  children,
  worldKey,
  pointer = true,
}: {
  children: React.ReactNode;
  worldKey?: string;
  pointer?: boolean
}) {
  return (
    <Canvas
      style={{ pointerEvents: pointer === false ? "none" : "auto" }}
      shadows
      camera={worldKey === 'sacrifice' ? { position: [0, 0, 5], fov: 50, near: 0.1, far: 7000} :{ position: [0, 0, 5], fov: 50 }}
      frameloop="always"
    >
      <Suspense fallback={<Loader />}>
        {children}
      </Suspense>
    </Canvas>
  )
}