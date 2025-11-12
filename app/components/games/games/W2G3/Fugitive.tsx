import { useFrame, } from "@react-three/fiber";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { useMemo, useEffect, useState, useRef } from "react";
import { Mesh, MeshStandardMaterial, Group, Vector3 } from "three";
import { useGLTF } from "@react-three/drei";
import { use3dFocusStore } from "@/app/lib/gamepad/inputManager";

useGLTF.preload("/models/avatars/redpap.gltf");

export default function Fugitive({
  scale = 1,
  position,
  setIsOpen,
}: {
  scale?: number;
  position?: Vector3;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const gltf = useGLTF("/models/avatars/redpap.gltf");
  const clonedScene = useMemo(() => clone(gltf.scene), [gltf.scene]);
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<Group>(null);

  const focusedId = use3dFocusStore((s) => s.focusedObj?.id);
  const id = 'fugitive'

  // shader highlight setup
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.userData = {
          id: id,
          onClick: () => {
            setIsOpen(true);
          },
        }

        const mesh = child as Mesh;
        mesh.material = (mesh.material as MeshStandardMaterial).clone();

        const mat = mesh.material as MeshStandardMaterial;
        mat.onBeforeCompile = (shader) => {
          shader.uniforms.uHighlight = { value: 0 };
          shader.fragmentShader =
            `uniform float uHighlight;\n` + shader.fragmentShader;

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

  // hover shader update
  useFrame(() => {
    clonedScene.traverse((child) => {
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

    if (groupRef.current) {
      const time = performance.now() / 30; // tweak this speed
      const intensity = 0.05; // how much to shake
      groupRef.current.rotation.x = Math.sin(time) * intensity;
      groupRef.current.rotation.y = Math.cos(time * 1.3) * intensity;
      groupRef.current.rotation.z = Math.sin(time * 0.7) * intensity;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
      scale={scale}
      position={position}
    >
      <primitive object={clonedScene} />
    </group>
  );
}