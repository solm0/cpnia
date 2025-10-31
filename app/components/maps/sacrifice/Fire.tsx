import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react";
import { AnimationAction, AnimationMixer, LoopRepeat } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

useGLTF.preload("/models/fire/scene.gltf");

export default function Fire(){
  const { scene, animations } = useGLTF("/models/fire/scene.gltf");
  const mixer = useRef<AnimationMixer | null>(null);
  const actionsRef = useRef<AnimationAction[]>([]);

  useEffect(() => {
    if (!animations || animations.length === 0) return;

    mixer.current = new AnimationMixer(scene);
    actionsRef.current = animations.map(clip => {
      const action = mixer.current!.clipAction(clip);
      action.setLoop(LoopRepeat, Infinity);
      action.play();
      return action;
    })

    return () => {
      // stop and uncache to free memory
      actionsRef.current.forEach(a => a.stop());
      mixer.current?.stopAllAction();
      mixer.current?.uncacheRoot(scene);
      mixer.current = null;
      actionsRef.current = [];
    }
  }, [scene, animations]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <primitive
      position={[-160,-30,30]}
      rotation={[0,degToRad(90),0]}
      scale={200}
      object={scene}
    />
  )
}