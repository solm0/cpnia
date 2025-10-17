import { AnimationAction, AnimationMixer, LoopOnce, LoopRepeat, Object3D } from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimGltf } from "@/app/lib/hooks/useAnimGltf";

export default function CrowdChar({
  model,
  position,
  animTerm,
  scale = 3,
}: {
  model: Object3D;
  position: [number, number, number];
  animTerm: number;
  scale?: number;
}) {
  const char = useMemo(() => model.clone(), [model]);
  const mixer = useRef<AnimationMixer | null>(null);
  const [actionKey, setActionKey] = useState(0);
  const actionsRef = useRef<AnimationAction | null>(null);
  const animGltf = useAnimGltf();

  // create mixer
  useEffect(() => {
    mixer.current = new AnimationMixer(char);
    return () => {
      mixer.current?.stopAllAction();
    };
  }, [char]);

  // cycle between animations
  useEffect(() => {
    const interval = setInterval(() => {
      setActionKey((prev) => (prev === 0 ? 2 : 0)); // alternate
    }, animTerm);
    return () => clearInterval(interval);
  }, []);

  // play animation on change
  useEffect(() => {
    if (!mixer.current) return;
    const anim = animGltf[actionKey]?.animations?.[0];
    if (!anim) return;
  
    // fade out previous action
    if (actionsRef.current) {
      actionsRef.current.fadeOut(0.2);
    }
  
    const action = mixer.current.clipAction(anim);
    action
      .reset()
      .fadeIn(0.2)
      .setLoop(
        actionKey === 2 ? LoopOnce : LoopRepeat, // ✅ play once if key=2
        Infinity
      )
      .play();
  
    // if LoopOnce, make sure it stays at the last frame
    if (actionKey === 2) {
      action.clampWhenFinished = true;
    }
  
    actionsRef.current = action;
  }, [actionKey, animGltf]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <primitive object={char} position={position} scale={scale} />
  );
}