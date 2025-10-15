/* eslint-disable @typescript-eslint/no-explicit-any */

import { AnimationMixer, Mesh, MeshStandardMaterial, Object3D, Object3DEventMap } from "three";
import { BodyData } from "../W2G1";
import { useAnimGltf } from "@/app/lib/hooks/useAnimGltf";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Body({
  gltfMap, body, bodiesRef, i
}: {
  gltfMap: Record<string, Object3D>;
  body: BodyData;
  bodiesRef: React.RefObject<(Object3D<Object3DEventMap> | null)[]>;
  i: number
}) {
  const ref = useRef<Object3D>(null);
  const clonedScene = gltfMap[body.ingr].clone();
  const animGltf = useAnimGltf()[1];
  const highlightTargets = useRef<{shader: any}[]>([]);

  useEffect(() => {
    bodiesRef.current[i] = ref.current;
    if (ref.current) {
      ref.current.userData.ingr = body.ingr;
      ref.current.userData.isTargeted = false;
    }
  }, []);

  // shader 심어놓기
  useEffect(() => {
    const targets: { shader: any }[] = [];

    clonedScene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

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

          targets.push({ shader });
        };
      }
    });
    highlightTargets.current = targets;
  }, [clonedScene]);

  // isTargeted flag에 매 frame마다 반응
  useFrame(() => {
    if (!ref.current) return;
    const isOn = ref.current.userData.isTargeted ? 1 : 0;


    highlightTargets.current.forEach(({ shader }) => {
      if (shader.uniforms.uHighlight) {
        shader.uniforms.uHighlight.value = isOn;
      }
    });
  })

  return (
    <primitive
      object={clonedScene}
      position={body.pos}
      ref={(el: Object3D | null) => {
        ref.current = el;
        if (!el) return;
    
        // assign userData here, after el exists
        if (!el.userData.ingr) el.userData.ingr = body.ingr;
        if (!('isTargeted' in el.userData)) el.userData.isTargeted = false;
    
        bodiesRef.current[i] = el;
    
        if (!animGltf || !animGltf.animations?.length) return;
    
        if (!el.userData.mixer) {
          const root = el.children[0] || el; // use first child if exists
          const mixer = new AnimationMixer(root);
          el.userData.mixer = mixer;
    
          const clip = animGltf.animations[0];
          const action = mixer.clipAction(clip);
          action.play();
        }
      }}
    />
  )
}