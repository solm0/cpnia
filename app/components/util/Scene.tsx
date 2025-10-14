'use client'

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import Loader from "./Loader";

function CameraSetup({
  position, rotation
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const { camera } = useThree();

  useEffect(() => {
    if (position) camera.position.set(...position);
    if (rotation) camera.rotation.set(...rotation);
    camera.updateProjectionMatrix();
  }, [camera, position, rotation]);

  return null;
}

export default function Scene({
  children,
  pointer = true,
  position = [0, 0, 5],
  rotation,
  fov = 50,
  near, far
}: {
  children: React.ReactNode;
  pointer?: boolean;
  position?: [number, number, number];
  rotation?: [number, number, number];
  fov?: number
  near?: number;
  far?: number;
}) {
  return (
    <Canvas
      style={{ pointerEvents: pointer === false ? "none" : "auto" }}
      shadows
      camera={{
        fov, near, far,
      }}
      frameloop="always"
    >
      <Suspense fallback={<Loader />}>
        <CameraSetup position={position} rotation={rotation} />
        {children}
      </Suspense>
    </Canvas>
  )
}