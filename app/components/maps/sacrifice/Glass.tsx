import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { MeshPhysicalMaterial, Color, Mesh } from "three";

useGLTF.preload("/models/glass.gltf");

export default function Glass() {
  const glass = useGLTF("/models/glass.gltf").scene;

  useEffect(() => {
    glass.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        mesh.material = new MeshPhysicalMaterial({
          color: new Color(0xffffff),
          metalness: 0,
          roughness: 0,
          transmission: 1,     // enables glass-like refraction
          thickness: 1,        // how thick the glass appears
          ior: 1.5,            // index of refraction (typical glass: 1.45-1.52)
          transparent: true,
          opacity: 1,          // must be 1 when using transmission
          reflectivity: 1,
          envMapIntensity: 1.5,
          clearcoat: 1,
          clearcoatRoughness: 0,
        });
      }
    });
  }, [glass]);

  return (
    <primitive
      object={glass}
      position={[-100,15,500]}
      scale={4}
    />
  );
}