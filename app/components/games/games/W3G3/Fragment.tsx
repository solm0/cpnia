/* eslint-disable @typescript-eslint/no-explicit-any */

import * as THREE from "three";
import { useMemo } from "react";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

export default function Fragment(props: any) {
  const geometry = useMemo(() => {
    // 무작위 점들 생성
    const vertices = Array.from({ length: 30 }, () =>
      new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      )
    );
    return new ConvexGeometry(vertices);
  }, []); // 생성 시 한 번만

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(
          Math.random(),
          Math.random(),
          Math.random()
        ).multiplyScalar(0.8),
        roughness: 0.6,
        metalness: 2,
        flatShading: true,
      }),
    []
  );

  return <mesh geometry={geometry} material={material} {...props} />
}