import { Environment } from "@react-three/drei";
import { EffectComposer, DepthOfField, Bloom, Noise, Pixelation, Vignette, ChromaticAberration, BrightnessContrast} from "@react-three/postprocessing";
import { BlendFunction } from 'postprocessing'

export function HomeEffects() {
  return (
    <>
      <Environment files={'/hdri/sky.hdr'} background={true} backgroundIntensity={1} backgroundRotation={[0,-1,0]} />
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} blendFunction={BlendFunction.COLOR_DODGE} />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL} // blend mode
          offset={[0.001, 0.001]} // color offset
        />
        <BrightnessContrast opacity={1} blendFunction={BlendFunction.OVERLAY} />
      </EffectComposer>
    </>
  )
}

export function TimeEffects() {
  return (
    <>
      <color attach="background" args={["black"]} />
      <Environment files={'/hdri/bay.hdr'} background={false} environmentIntensity={0.01} />
      <EffectComposer>
        <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={1} />
        <Pixelation granularity={4} />
      </EffectComposer>
    </>
  )
}

export function SacrificeEffects() {
  return (
    <>
      <color attach="background" args={["magenta"]} />
      <Environment files={'/hdri/kitchen.hdr'} background={true} backgroundIntensity={0.2} environmentIntensity={0.5} />
      <EffectComposer>
        <DepthOfField focusDistance={0} focalLength={0.1} bokehScale={8} height={480} />
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} blendFunction={BlendFunction.ADD} />
        <Noise opacity={0.02} />
        <Vignette eskil={false} offset={0.1} darkness={0.8} />
      </EffectComposer>
    </>
  )
}

export function EntropyEffects() {
  return (
    <></>
  )
}