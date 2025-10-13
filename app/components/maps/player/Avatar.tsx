import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AnimationAction, AnimationMixer, LoopRepeat, Mesh } from "three";
import { useGLTF } from "@react-three/drei";
import { useAnimGltf } from "@/app/lib/hooks/useAnimGltf";

export function Avatar({
  animIndex,
}: {
  animIndex?: number;
}) {
  const actionsRef = useRef<AnimationAction | null>(null);
  const mixer = useRef<AnimationMixer | null>(null);

  const charGltf = useGLTF("/models/avatars/default.glb");
  const animGltf = useAnimGltf();
  const anim = animGltf[animIndex ?? 0];

  // set up mixer once
  useEffect(() => {
    if (charGltf) {
      mixer.current = new AnimationMixer(charGltf.scene);
      charGltf.scene.traverse((child) => {
        if ((child as Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }

    return () => {
      mixer.current?.stopAllAction();
      mixer.current = null;
    };
  }, [charGltf]);

  // switch animation when actionKey changes
  useEffect(() => {
    if (!mixer.current || !anim.animations.length) return;

    const clip = anim.animations[0];
    console.log('anim', clip.name)

    if (actionsRef.current) {
      actionsRef.current.fadeOut(0.2);
    }

    const action = mixer.current.clipAction(clip);
    action.reset().fadeIn(0.2).setLoop(LoopRepeat, Infinity).play();
    actionsRef.current = action;
  }, [animIndex]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <group>
      <primitive
        object={charGltf.scene}
        scale={8}
        position={[0, 0, 0]}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
}