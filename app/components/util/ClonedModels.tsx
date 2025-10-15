import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { useMemo, useEffect, useState } from "react";
import { Mesh, MeshStandardMaterial } from "three";

export default function ClonedModel({
  src,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  hoverEffect = false
}: {
  src: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  hoverEffect?: boolean;
}) {
  const gltf = useLoader(GLTFLoader, src);
  const clonedScene = useMemo(() => clone(gltf.scene), [gltf.scene]);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (hoverEffect === false) return;

        const mesh = child as Mesh

        // clone the material so each NPC is independent
        mesh.material = (mesh.material as MeshStandardMaterial).clone();

        const mat = mesh.material as MeshStandardMaterial;
        mat.onBeforeCompile = (shader) => {
          shader.uniforms.uHighlight = { value: 0 };

          shader.fragmentShader = `
            uniform float uHighlight;
          ` + shader.fragmentShader;

          shader.fragmentShader = shader.fragmentShader.replace(
            `#include <dithering_fragment>`,
            `
              #include <dithering_fragment>
              if (uHighlight > 0.5) {
                gl_FragColor.rgb += vec3(0.2, 0.2, 0.2);
              }
            `
          );

          mesh.userData.shader = shader;
        };
      }
    });
  }, [clonedScene]);

  useFrame(() => {
    if (!clonedScene) return;
    clonedScene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const shader = child.userData.shader;
        if (shader?.uniforms?.uHighlight) {
          shader.uniforms.uHighlight.value = hovered ? 1 : 0;
        }
      }
    });
  });

  return (
    <group
      onPointerEnter={(e: MouseEvent) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerLeave={(e: MouseEvent) => {
        e.stopPropagation();
        setHovered(false);
      }}
    >
      <primitive
        object={clonedScene}
        scale={scale}
        position={position}
        rotation={rotation}
      />
    </group>
  );
}