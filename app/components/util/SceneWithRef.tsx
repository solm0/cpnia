/* eslint-disable @typescript-eslint/no-explicit-any */

import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef, useImperativeHandle, forwardRef } from "react";
import { OrbitControls } from "@react-three/drei";
import Loader from "./Loader";
import * as THREE from "three";
import gsap from "gsap";

const SceneWithRef = forwardRef(({
  children, isFocused, setIsFocused
}: {
  children: React.ReactNode;
  isFocused: boolean;
  setIsFocused: (isFocused: boolean) => void;
}, ref) => {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  // --- Focus animation logic ---
  useImperativeHandle(ref, () => ({
    focusOn: (
      target: [number, number, number],
      rotation: [number, number, number],
      zoomIn = 20,
    ) => {
      setIsFocused(true);
      if (!controlsRef.current) return;

      // 방향
      const portalEuler = new THREE.Euler(rotation[0], rotation[1], rotation[2]);
      const forward = new THREE.Vector3(0, 0, 1).applyEuler(portalEuler).normalize();

      // Target camera position after zoom
      const newPos = new THREE.Vector3(
        target[0] + forward.x * zoomIn,
        target[1] + forward.y * zoomIn,
        target[2] + forward.z * zoomIn,
      );

      // Animate camera position
      gsap.to(camera.position, {
        x: newPos.x + 6,
        y: newPos.y - 2,
        z: newPos.z,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => controlsRef.current.update()
      });

      gsap.to(controlsRef.current.target, {
        x: target[0] + 6,
        y: target[1] - 2,
        z: target[2],
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => controlsRef.current.update()
      });
    },
  }));

  return (
    <Suspense fallback={<Loader />}>
      {children}
      <OrbitControls
        ref={controlsRef}
        minDistance={!isFocused ? 45 : 0 }
        maxDistance={100}
      />
    </Suspense>
  );
});

SceneWithRef.displayName = "SceneWithRef";
export default SceneWithRef;