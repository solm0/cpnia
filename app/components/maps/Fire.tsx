import { useFrame, useLoader } from "@react-three/fiber"
import { useEffect, useRef } from "react";
import { AnimationAction, AnimationMixer, LoopRepeat } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { degToRad } from "three/src/math/MathUtils.js";

export default function Fire(){
  const gltf = useLoader(GLTFLoader, "/models/fire/scene.gltf");
  const mixer = useRef<AnimationMixer | null>(null);
  const actionsRef = useRef<AnimationAction[]>([]);

  useEffect(() => {
    if (!gltf || !gltf.animations.length) return;

    mixer.current = new AnimationMixer(gltf.scene);
    actionsRef.current = gltf.animations.map(clip => {
      const action = mixer.current!.clipAction(clip);

      // configure action defaults
      action.setLoop(LoopRepeat, Infinity);
      action.play();
      return action;
    })

    return () => {
      // stop and uncache to free memory
      actionsRef.current.forEach(a => a.stop());
      mixer.current?.stopAllAction();
      mixer.current?.uncacheRoot(gltf.scene);
      mixer.current = null;
      actionsRef.current = [];
    }
  }, [gltf]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <primitive
      position={[-160,-30,30]}
      rotation={[0,degToRad(90),0]}
      scale={200}
      object={gltf.scene}
    />
  )
}