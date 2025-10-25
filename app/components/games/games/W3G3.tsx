import Scene from "../../util/Scene";
import GameMenu from "../interfaces/GameMenu";
import { useState } from "react";
import Debris from "./W3G3/Debris";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Bloom, BrightnessContrast, ChromaticAberration, DepthOfField, EffectComposer, Glitch, HueSaturation, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction, GlitchMode } from 'postprocessing'
import { Physics, RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";
import Planes from "./W3G3/Planes";
import Player from "./W3G3/Player";

export default function W3G3({
  worldKey, gameKey, onGameEnd
}: {
  worldKey: string;
  gameKey: string;
  onGameEnd: (success: boolean) => void;
}) {
  // 게임마다 다른 게임 상태 저장. 점수만 Game으로 올려줌.
  const [click, setClick] = useState(0);
  const avatar = useGLTF('/models/avatars/default.glb').scene;
  
  return (
    <main className="w-full h-full">
      {/* 게임 */}
      <Scene>
        {/* <Planes /> */}
        <Physics gravity={[0, 0.04, 0]}>
          <Debris
            scale={8}
            position={new Vector3(
              Math.random() * 10 - 5,
              Math.random() * 10 - 5,
              Math.random() * 10 - 5
            )}
          />
          <Debris
            scale={0.5 + Math.random() * 2.5}
            position={new Vector3(
              Math.random() * 10 - 5,
              Math.random() * 10 - 5,
              Math.random() * 10 - 5
            )}
          />
          <Debris
            scale={0.5 + Math.random() * 2.5}
            position={new Vector3(
              Math.random() * 10 - 5,
              Math.random() * 10 - 5,
              Math.random() * 10 - 5
            )}
          />
          <Debris
            scale={0.5 + Math.random() * 2.5}
            position={new Vector3(
              Math.random() * 10 - 5,
              Math.random() * 10 - 5,
              Math.random() * 10 - 5
            )}
          />
          <Debris
            scale={0.5 + Math.random() * 2.5}
            position={new Vector3(
              Math.random() * 10 - 5,
              Math.random() * 10 - 5,
              Math.random() * 10 - 5
            )}
          />
          <Debris
            scale={0.5 + Math.random() * 2.5}
            position={new Vector3(
              Math.random() * 10 - 5,
              Math.random() * 10 - 5,
              Math.random() * 10 - 5
            )}
          />
          <OrbitControls />
          <directionalLight intensity={10} position={[10,50,10]} />
        
          <Player />
        </Physics>

        
        <Environment files={'/hdri/cloudSky.hdr'} background={true} environmentIntensity={0.05} />
        <EffectComposer>
          <HueSaturation saturation={0.8} opacity={1} />
          <DepthOfField focusDistance={0} focalLength={0.3} bokehScale={8} height={480} />
          <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.02} height={300} blendFunction={BlendFunction.ADD} />
          <Noise opacity={0.2} />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL} // blend mode
            offset={[0.001, 0.001]} // color offset
          />
        </EffectComposer>
      </Scene>

      {/* 게임 인터페이스 */}
      <GameMenu
        worldKey={worldKey}
        gameKey={gameKey}
        score={click}
      />
    </main>
  )
}