'use client'

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import Loader from "./Loader";

export default function SmallScene({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 50 }} >
      <Suspense fallback={<Loader />}>
        {children}

        {/* Controls */}
        <OrbitControls target={[0, 0, 0]} enableZoom={false} />
      </Suspense>
    </Canvas>
  )
}