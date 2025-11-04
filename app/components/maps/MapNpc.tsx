import { useEffect, useMemo, useRef } from "react";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { AnimationMixer, Mesh, MeshStandardMaterial, Object3D } from "three";
import { useAnimGltf } from "@/app/lib/hooks/useAnimGltf";
import { useFrame } from "@react-three/fiber";
import { FlickeringPointLight } from "./interview/InterviewScene";
import { use3dFocusStore } from "@/app/lib/gamepad/inputManager";

export default function MapNpc({
  worldKey, name,
  hoveredNpc, setHoveredNpc,
  activeNpc, setActiveNpc,
  model,
  closeIsChatOpen,
}: {
  worldKey: string;
  name: string;
  hoveredNpc: string | null;
  setHoveredNpc: (name: string | null) => void;
  activeNpc: string | null;
  setActiveNpc: (name: string) => void;
  model: Object3D;
  closeIsChatOpen: (isChatOpen: boolean) => void;
}) {
  const mixer = useRef<AnimationMixer | null>(null);
  const id = `${worldKey}-npc-${name}`;
  const focusedId = use3dFocusStore((s) => s.focusedObj?.id);

  let actionIdx;
  if (name === '파친코 위에서 발견한 주민') actionIdx = 2
  else if (name === '마야' || name === '니코') actionIdx = 3
  else actionIdx = 0

  const animGltf = useAnimGltf()[actionIdx];
  const clonedScene = useMemo(() => clone(model), [model]);
  clonedScene.userData = {
    id: id,
    onClick: () => {
      setActiveNpc(name);
      closeIsChatOpen(false);
    },
  }
  // console.log(id, focusedId, clonedScene.userData);
  
  // inject shader only once
  useMemo(() => {
    clonedScene.traverse((child) => {
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
    });
  }, [clonedScene]);

  // update highlight uniform based on hoveredNpc (shared across all NPCs)
  useMemo(() => {
    clonedScene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const shader = child.userData.shader;
        if (shader?.uniforms?.uHighlight) {
          shader.uniforms.uHighlight.value = hoveredNpc === name
            ? 1
            : activeNpc === name 
              ? 1
              : focusedId === id
                ? 1 : 0;
        }
      }
    });
  }, [clonedScene, hoveredNpc, activeNpc, name, focusedId]);

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
      {(name === '마야' || name === '니코') &&
        <FlickeringPointLight
          pos={[0.2, 0.6, 0.2]}
          intensity={100}
          dur={0.5}
          color="yellow"
        />
      }
      <primitive
        object={clonedScene}
        scale={1}
        position={[0,0,0]}
      />
    </group>
  )
}