import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";
import { useMemo } from "react";

export function createFragment(): THREE.Mesh {
  const vertices = Array.from({ length: 30 }, () =>
    new THREE.Vector3(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    )
  );

  const geometry = new ConvexGeometry(vertices);

  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(Math.random(), Math.random(), Math.random()).multiplyScalar(0.8),
    roughness: 0.6,
    metalness: 2,
    flatShading: true,
  });

  return new THREE.Mesh(geometry, material);
}

export function Fragment() {
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

  return <mesh geometry={geometry} material={material} />
}