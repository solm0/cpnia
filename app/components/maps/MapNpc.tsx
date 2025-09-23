import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { Mesh, MeshStandardMaterial } from "three";

export default function MapNpc({
  name,
  scale = 1,
  position = [0, -0.9, 0],
  rotation = [0, 0, 0],
  hoveredNpc, setHoveredNpc,
  setActiveNpc,
}: {
  name: string;
  scale?: number
  position?: [number, number, number];
  rotation?: [number, number, number];
  hoveredNpc: string | null;
  setHoveredNpc: (name: string | null) => void;
  setActiveNpc: (name: string) => void;
}) {
  const gltf = useLoader(GLTFLoader, '/models/avatar.glb');
  const clonedScene = useMemo(() => clone(gltf.scene), [gltf.scene]);
  
  // inject shader only once
  useMemo(() => {
    clonedScene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
  
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

  // update highlight uniform based on hoveredNpc (shared across all NPCs)
  useMemo(() => {
    clonedScene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const shader = child.userData.shader;
        if (shader?.uniforms?.uHighlight) {
          shader.uniforms.uHighlight.value = hoveredNpc === name ? 1 : 0;
        }
      }
    });
  }, [clonedScene, hoveredNpc, name]);
  
  return (
    <group
      scale={scale}
      position={position}
      rotation={rotation}
      onPointerEnter={(e: MouseEvent) => {
        e.stopPropagation();
        setHoveredNpc(name);
      }}
      onPointerLeave={(e: MouseEvent) => {
        e.stopPropagation();
        setHoveredNpc(null);
      }}
      onClick={(e: MouseEvent) => {
        e.stopPropagation();
        setActiveNpc(name);
      }}
    >
      <primitive object={clonedScene} />
    </group>

  )
}