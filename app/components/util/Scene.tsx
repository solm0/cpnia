'use client'

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import Loader from "./Loader";

export default function Scene({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <Suspense fallback={<Loader />}>
        {children}

        {/* Controls */}
        <OrbitControls
          minDistance={30}
          maxDistance={100}
        />
      </Suspense>
    </Canvas>
  )
}