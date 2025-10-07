import { useFrame, useLoader } from "@react-three/fiber"
import { useEffect, useRef } from "react";
import { AnimationMixer } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { degToRad } from "three/src/math/MathUtils.js";

export default function Fire(){
  const gltf = useLoader(GLTFLoader, "/models/fire/scene.gltf");
  const mixer = useRef<AnimationMixer>(null);

  useEffect(() => {
    if (gltf.animations.length > 0) {
      mixer.current = new AnimationMixer(gltf.scene);
      gltf.animations.forEach((clip) => {
        mixer.current!.clipAction(clip).play()
      });
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