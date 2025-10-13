/* eslint-disable @typescript-eslint/no-explicit-any */

import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { Mesh, MeshStandardMaterial } from "three";
import { usePlayerStore } from "@/app/lib/state/playerStore";
import { Billboard, Image, Text } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { Euler, Quaternion } from "three";

export default function ChatNpc({
  name,
  hoveredNpc, setHoveredNpc,
  setIsChatOpen,
  closeActiveNpc,
}: {
  name: string;
  hoveredNpc: string | null;
  setHoveredNpc: (name: string | null) => void;
  setIsChatOpen: (isChatOpen: boolean) => void;
  closeActiveNpc: (name: string | null) => void;
}) {
  const gltf = useLoader(GLTFLoader, '/models/chat-npc.glb');
  const clonedScene = useMemo(() => clone(gltf.scene), [gltf.scene]);

  // --- player가 움직이면 그 옆으로 따라가기
  const body = useRef<any>(null);
  const isMoving = usePlayerStore((s) => s.isMoving);
  const currentPos = useRef({ x: 0, y: 0, z: 0 });

  // initialize currentPos once
  useEffect(() => {
    if (body.current) {
      const t = body.current.translation();
      currentPos.current = { x: t.x, y: t.y, z: t.z };
    }
  }, []);
  
  useEffect(() => {
    if (!isMoving && body.current) {
      const playerPos = usePlayerStore.getState().position;
      const target = {
        x: playerPos.x + 8,
        y: playerPos.y,
        z: playerPos.z -5,
      };
      body.current.setNextKinematicTranslation(target);
    }
  }, [isMoving])

  useFrame((_, delta) => {
    if (!body.current) return;

    const playerPos = usePlayerStore.getState().position;
    const target = { x: playerPos.x + 8, y: playerPos.y, z: playerPos.z -5 };

    // lerp smoothly
    const lerpFactor = 5 * delta;
    currentPos.current.x += (target.x - currentPos.current.x) * lerpFactor;
    currentPos.current.y += (target.y - currentPos.current.y) * lerpFactor;
    currentPos.current.z += (target.z - currentPos.current.z) * lerpFactor;

    setTimeout(() => {
      body.current.setNextKinematicTranslation(currentPos.current);
    }, 1)

    // rotation
    const dirX = target.x - currentPos.current.x;
    const dirZ = target.z - currentPos.current.z;
    const targetAngle = Math.atan2(dirX, dirZ);

    const currentQuat = body.current.rotation();
    const currentEuler = new Euler().setFromQuaternion(
      new Quaternion(currentQuat.x, currentQuat.y, currentQuat.z, currentQuat.w),
      "YXZ"
    );

    // lerp y rotation
    currentEuler.y += (targetAngle - currentEuler.y) * lerpFactor;

    const nextQuat = new Quaternion().setFromEuler(currentEuler);
    body.current.setNextKinematicRotation(nextQuat);
  });
  
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
          shader.uniforms.uHighlight.value = hoveredNpc === name ? 1 : 0;
        }
      }
    });
  }, [clonedScene, hoveredNpc, name]);

  return (
    <>
      <RigidBody
        ref={body}
        position={[0,0,0]}
        colliders={'cuboid'}
        type="kinematicPosition"
      >
        <Billboard position={[0,7.5,0]}>
          <Text fontSize={0.4}>{name}</Text>
        </Billboard>
        <group
          scale={8}
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
            setIsChatOpen(true);
            closeActiveNpc(null);
          }}
        >
          <primitive object={clonedScene} />
        </group>
      </RigidBody>
    </>
  )
}