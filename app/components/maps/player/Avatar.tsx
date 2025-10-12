import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AnimationAction, AnimationMixer, LoopRepeat, Mesh } from "three";
import { useGLTF } from "@react-three/drei";

export function Avatar({
  charGltfSrc = '/models/avatar-jump.glb',
  animGltfSrc = '/models/avatar-walk.glb',
  actionKey = 'idle',
}: {
  charGltfSrc?: string;
  animGltfSrc?: string;
  actionKey?: string;
}) {
  const actionsRef = useRef<AnimationAction | null>(null);
  const mixer = useRef<AnimationMixer | null>(null);

  const charGltf = useGLTF(charGltfSrc);
  const animGltf = useGLTF(animGltfSrc);

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
    if (!mixer.current || !animGltf.animations.length) return;

    const clip = animGltf.animations.find((a) => a.name === actionKey);
    if (!clip) {
      console.warn(`No animation found for key "${actionKey}"`);
      return;
    }

    // fade out old action
    if (actionsRef.current) {
      actionsRef.current.fadeOut(0.2);
    }

    const action = mixer.current.clipAction(clip);
    action.reset().fadeIn(0.2).setLoop(LoopRepeat, Infinity).play();
    actionsRef.current = action;
  }, [actionKey, animGltf]); // 👈 KEY: depend on actionKey!

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