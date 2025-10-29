/* eslint-disable @typescript-eslint/no-explicit-any */

import { useFrame, } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Mesh, MeshStandardMaterial, AnimationAction, AnimationMixer, LoopRepeat, Object3D } from "three";
import { usePlayerStore } from "@/app/lib/state/playerStore";
import { Billboard, Image, Text, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { Euler, Quaternion } from "three";
import { useAnimGltf } from "@/app/lib/hooks/useAnimGltf";

export function ChatNpcAvatar({
  name,
  hoveredNpc, setHoveredNpc,
  setIsChatOpen,
  closeActiveNpc,
  actionKey = 0,
  model,
}: {
  name: string;
  hoveredNpc: string | null;
  setHoveredNpc: (name: string | null) => void;
  setIsChatOpen: (isChatOpen: boolean) => void;
  closeActiveNpc: (name: string | null) => void;
  actionKey: number;
  model: Object3D;
}){
  const actionsRef = useRef<AnimationAction | null>(null);
  const mixer = useRef<AnimationMixer | null>(null);
  const animGltf = useAnimGltf();

  useEffect(() => {
    if (model) {
      mixer.current = new AnimationMixer(model);

      model.traverse((child) => {
        if ((child as Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

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
      })
    }

    return () => {
      mixer.current?.stopAllAction();
      mixer.current = null;
    }
  }, [model]);

  useFrame(() => {
    if (!model) return;
    model.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const shader = child.userData.shader;
        if (shader?.uniforms?.uHighlight) {
          shader.uniforms.uHighlight.value = hoveredNpc === name ? 1 : 0;
        }
      }
    });
  });

  // switch animation when actionKey changes
  useEffect(() => {
    if (!mixer.current || !animGltf[0].animations.length || !animGltf[1].animations.length) return;

    const clip = animGltf[actionKey].animations[0];

    if (actionsRef.current) {
      actionsRef.current.fadeOut(0.2);
    }

    const action = mixer.current.clipAction(clip);
    action.reset().fadeIn(0.2).setLoop(LoopRepeat, Infinity).play();
    actionsRef.current = action;
  }, [actionKey, animGltf]); 

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return (
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
      <primitive object={model} />
    </group>
  )
}

export default function ChatNpc({
  name,
  hoveredNpc, setHoveredNpc,
  setIsChatOpen,
  closeActiveNpc,
  model,
}: {
  name: string;
  hoveredNpc: string | null;
  setHoveredNpc: (name: string | null) => void;
  setIsChatOpen: (isChatOpen: boolean) => void;
  closeActiveNpc: (name: string | null) => void;
  model: Object3D;
}) {
  // --- player가 움직이면 그 옆으로 따라가기
  const body = useRef<any>(null);
  const isMoving = usePlayerStore((s) => s.isMoving);
  const currentPos = useRef({ x: 0, y: 0, z: 0 });
  const speed = 1;

  const prevPos = useRef({ x: 0, y: 0, z: 0 });
  const [chatNpcIsMoving, setChatNpcIsMoving] = useState(false);

  // initialize currentPos once
  useEffect(() => {
    if (body.current) {
      const t = body.current.translation();
      currentPos.current = { x: t.x, y: t.y, z: t.z };
      prevPos.current = { ...currentPos.current };
    }
  }, []);

  useFrame((_, delta) => {
    if (!body.current) return;

    const playerPos = usePlayerStore.getState().position;
    const target = { x: playerPos.x + 8, y: playerPos.y, z: playerPos.z -5 };

    // lerp smoothly
    const lerpFactor = speed * delta;
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

    // --- Detect if NPC is moving
    const dx = currentPos.current.x - prevPos.current.x;
    const dy = currentPos.current.y - prevPos.current.y;
    const dz = currentPos.current.z - prevPos.current.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // Consider small threshold to avoid floating jitter
    const isMovingNow = distance > 0.07;
    if (isMovingNow !== chatNpcIsMoving) {
      setChatNpcIsMoving(isMovingNow);
    }

    prevPos.current = { ...currentPos.current };
  });

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
          <Image
            url="/images/y.png"
            scale={[1,1]}
            position={[0,1.5,0]}
            transparent
          />
        </Billboard>
        
        <ChatNpcAvatar
          name={name}
          hoveredNpc={hoveredNpc}
          setHoveredNpc={setHoveredNpc}
          setIsChatOpen={setIsChatOpen}
          closeActiveNpc={closeActiveNpc}
          actionKey={chatNpcIsMoving ? 1 : 0}
          model={model}
        />
      </RigidBody>
    </>
  )
}