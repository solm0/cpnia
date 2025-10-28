import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AnimationAction, AnimationMixer, LoopRepeat, Mesh, Object3D } from "three";
import { useAnimGltf } from "@/app/lib/hooks/useAnimGltf";

export function Avatar({
  animIndex, avatar,
}: {
  animIndex?: number;
  avatar: Object3D;
}) {
  const actionsRef = useRef<AnimationAction | null>(null);
  const mixer = useRef<AnimationMixer | null>(null);
  const animGltf = useAnimGltf();
  const anim = animGltf[animIndex ?? 0];

  // set up mixer once
  useEffect(() => {
    if (avatar) {
      mixer.current = new AnimationMixer(avatar);
      avatar.traverse((child) => {
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
  }, [avatar]);

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

  let motionSpeed = 1;
  if (animIndex === 1) {
    motionSpeed = 1.5
  }

  useFrame((_, delta) => {
    mixer.current?.update(delta * motionSpeed);
  });

  return (
    <group>
      <primitive
        object={avatar}
        scale={8}
        position={[0, 0, 0]}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
}