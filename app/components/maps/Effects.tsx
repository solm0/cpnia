import { Environment } from "@react-three/drei";
import { EffectComposer, DepthOfField, Bloom, Noise, Pixelation, Vignette, ChromaticAberration, BrightnessContrast} from "@react-three/postprocessing";
import { BlendFunction } from 'postprocessing'
import { radToDeg } from "three/src/math/MathUtils.js";

export function HomeEffects() {
  return (
    <>
      <Environment files={'/hdri/sky.hdr'} background={true} backgroundIntensity={0.5} backgroundRotation={[0,radToDeg(90),0]}  />
      <EffectComposer>
        <Bloom luminanceThreshold={0.8} luminanceSmoothing={1} height={300} blendFunction={BlendFunction.ADD} />
        <DepthOfField focusDistance={0} focalLength={0.2} bokehScale={2} height={480} />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL} // blend mode
          offset={[0.001, 0.001]} // color offset
        />
        <BrightnessContrast opacity={0.4} blendFunction={BlendFunction.LINEAR_DODGE} />

      </EffectComposer>
    </>
  )
}

export function TimeEffects() {
  return (
    <>
      <color attach="background" args={["#101010"]} />
      <Environment files={'/hdri/bay.hdr'} background={false} environmentIntensity={0.01} />
      <EffectComposer>
        <DepthOfField focusDistance={0} focalLength={0.6} bokehScale={2} height={480} />
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={1} />
        <Pixelation granularity={3} />
      </EffectComposer>
    </>
  )
}

export function SacrificeEffects() {
  return (
    <>
      <color attach="background" args={["blue"]} />
      <Environment files={'/hdri/kitchen.hdr'} background={false} environmentIntensity={0.05} />
      <EffectComposer>
        <DepthOfField focusDistance={0} focalLength={0.6} bokehScale={8} height={480} />
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} blendFunction={BlendFunction.ADD} />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={0.8} />
      </EffectComposer>
    </>
  )
}

export function EntropyEffects() {
  return (
    <>
      <color attach="background" args={["#101010"]} />
    </>
  )
}