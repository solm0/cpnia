import { Html, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import { Mesh, MeshStandardMaterial } from "three";
import { useFrame } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { use3dFocusStore } from "@/app/lib/gamepad/inputManager";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

export default function GamePortal({
  modelSrc, worldKey, gameKey, scale = 1, setOpen,
}: {
  modelSrc: string;
  worldKey: string;
  gameKey: string;
  scale?: number;
  setOpen: (open: string | null) => void;
}) {
  const id = `${worldKey}-gameportal-${gameKey}`;
  const focusedId = use3dFocusStore((s) => s.focusedObj?.id);

  const gltf = useGLTF(modelSrc).scene;
  const clonedGltf = useMemo(() => clone(gltf), [gltf]);
  clonedGltf.userData = {
    id: id,
    onClick: () => {
      setOpen(gameKey);
    }
  }
  
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (clonedGltf) {
      clonedGltf.traverse((child) => {
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
  }, [clonedGltf]);

  useFrame(() => {
    if (!clonedGltf) return;
    clonedGltf.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const shader = child.userData.shader;
        if (shader?.uniforms?.uHighlight) {
          shader.uniforms.uHighlight.value = hovered
          ? 1
          : focusedId === id
              ? 1 : 0;
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
        setOpen(gameKey);
      }}
      scale={scale}
    >
      <primitive object={clonedGltf} />
    </group>
  )
}