import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import { Mesh, MeshStandardMaterial } from "three";
import { useFrame } from "@react-three/fiber";
import { useRouter } from "next/navigation";

export default function GamePortal({
  modelSrc, locked, worldKey, gameKey, scale = 1
}: {
  modelSrc: string;
  locked: boolean;
  worldKey: string;
  gameKey: string;
  scale?: number;
}) {
  const gltf = useGLTF(modelSrc).scene;
  gltf.userData = {
    id: `${worldKey}-gameportal-${gameKey}`,
    onClick: () => {
      if (!locked) {
        router.push(`/${worldKey}?game=${gameKey}`)
      }
    }
  }
  
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (gltf) {
      gltf.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh;
          mesh.castShadow = mesh.receiveShadow = true;
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
      })
    }
  }, [gltf]);

  useFrame(() => {
    if (!gltf) return;
    gltf.traverse((child) => {
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
      onClick={(e: MouseEvent) => {
        e.stopPropagation();
        if (!locked) {
          router.push(`/${worldKey}?game=${gameKey}`)
        }
      }}
      scale={scale}
    >
      <primitive object={gltf} />
    </group>
  )
}