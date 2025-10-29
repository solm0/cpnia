import { useEffect, useMemo, useRef } from "react";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { AnimationMixer, Mesh, MeshStandardMaterial, Object3D } from "three";
import { useAnimGltf } from "@/app/lib/hooks/useAnimGltf";
import { useFrame } from "@react-three/fiber";

export default function MapNpc({
  name,
  hoveredNpc, setHoveredNpc,
  activeNpc, setActiveNpc,
  model,
  closeIsChatOpen,
}: {
  name: string;
  hoveredNpc: string | null;
  setHoveredNpc: (name: string | null) => void;
  activeNpc: string | null;
  setActiveNpc: (name: string) => void;
  model: Object3D;
  closeIsChatOpen: (isChatOpen: boolean) => void;
}) {
  const mixer = useRef<AnimationMixer | null>(null);

  const animGltf = useAnimGltf()[0];
  const clonedScene = useMemo(() => clone(model), [model]);
  
  // inject shader only once
  useMemo(() => {
    clonedScene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        mesh.castShadow = mesh.receiveShadow = true;
  
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
          shader.uniforms.uHighlight.value = hoveredNpc === name ? 1 : activeNpc === name ? 1 : 0;
        }
      }
    });
  }, [clonedScene, hoveredNpc, name]);

  useEffect(() => {
    if (clonedScene) {
      mixer.current = new AnimationMixer(clonedScene);
      
      const action = mixer.current!.clipAction(animGltf.animations[0]);
      action.play();
    }
  }, [clonedScene, animGltf]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });
  
  return (
    <group
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
        closeIsChatOpen(false);
      }}
    >
      <primitive object={clonedScene} />
    </group>
  )
}