'use client'

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Loader from "./loader";
import { OrbitControls } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function Model() {
  const gltf = useLoader(GLTFLoader, "/models/stul.glb");
  return (
    <primitive
      object={gltf.scene}
      scale={1}
      position={[0, 3, 0]}
      rotation={[0, 0, 0]}
    />
  )
}

export default function Scene() {
  

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <Suspense fallback={<Loader />}>
        {/* Light */}
        <ambientLight intensity={0.8} />
        <pointLight 
          position={[0, 0, 0]} 
          intensity={0.6} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
        />

        {/* Models */}
        <Model />

        {/* Controls */}
        <OrbitControls
          minDistance={30}
          maxDistance={100}
        />
      </Suspense>
    </Canvas>
  )
}