import { Html, useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import { Mesh, MeshStandardMaterial } from "three";
import { useFrame } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { use3dFocusStore } from "@/app/lib/gamepad/inputManager";

export default function GamePortal({
  modelSrc, locked, worldKey, gameKey, scale = 1
}: {
  modelSrc: string;
  locked: boolean;
  worldKey: string;
  gameKey: string;
  scale?: number;
}) {
  const id = `${worldKey}-gameportal-${gameKey}`;
  const focusedId = use3dFocusStore((s) => s.focusedObj?.id);
  // const [isOpen, setIsOpen] = useState(false);

  const gltf = useGLTF(modelSrc).scene;
  gltf.userData = {
    id: id,
    onClick: () => {
      router.push(`/${worldKey}?game=${gameKey}`)
      // if (!locked) {
      //   router.push(`/${worldKey}?game=${gameKey}`)
      // } else {
      //   setIsOpen(true);
      //   console.log('k')
      // }
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
        router.push(`/${worldKey}?game=${gameKey}`)
        // if (!locked) {
        //   router.push(`/${worldKey}?game=${gameKey}`)
        // } else {
        //   setIsOpen(true);
        // }
      }}
      scale={scale}
    >
      {/* {isOpen && (
        <Html distanceFactor={8} className="w-200" position={[0,50,0]}>
          <div className="w-400 text-wrap break-keep text-8xl leading-[1.7em] p-20 bg-[#ff000050] rounded-4xl backdrop-blur-2xl">
            느낌표 이미지가 달려 있는 npc를 클릭해 이번 스테이지의 게임을 먼저 하고 오세요!
          </div>
        </Html>
      )} */}
      <primitive object={gltf} />
    </group>
  )
}