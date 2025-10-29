import { stagePositions } from "./time/TimeMap"

export function HomeLights() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight color={'white'} intensity={1} position={[-20,0,50]}/>
      <directionalLight color={'white'} intensity={1} position={[20,0,50]}/>
      <directionalLight color={'orange'} intensity={1} position={[10,0,-80]}/>
    </>
  )
}

export function TimeLights() {
  return (
    <>
      <ambientLight intensity={0.01} />
      <directionalLight
        intensity={5}
        position={[0, 10, 0]} // not directly above, set an angle
        color={'lime'}
        castShadow
        shadow-mapSize-width={2048}   // higher = sharper shadow
        shadow-mapSize-height={2048}
        shadow-camera-left={-500}      // expand shadow frustum
        shadow-camera-right={500}
        shadow-camera-top={500}
        shadow-camera-bottom={-500}
        shadow-camera-near={0.1}      // near/far clipping
        shadow-camera-far={1000}
      />
      <directionalLight
        intensity={10}
        position={[10, 0, 0]} // not directly above, set an angle
        color={'magenta'}
        castShadow
        shadow-mapSize-width={2048}   // higher = sharper shadow
        shadow-mapSize-height={2048}
        shadow-camera-left={-1000}      // expand shadow frustum
        shadow-camera-right={1000}
        shadow-camera-top={1000}
        shadow-camera-bottom={-1000}
        shadow-camera-near={0.1}      // near/far clipping
        shadow-camera-far={100}
      />
      <directionalLight
        intensity={5}
        position={[80, -10, 20]} // not directly above, set an angle
        color={'orange'}
        castShadow
        shadow-mapSize-width={2048}   // higher = sharper shadow
        shadow-mapSize-height={2048}
        shadow-camera-left={-1000}      // expand shadow frustum
        shadow-camera-right={1000}
        shadow-camera-top={1000}
        shadow-camera-bottom={-1000}
        shadow-camera-near={0.1}      // near/far clipping
        shadow-camera-far={100}
      />
      <spotLight
        position={[stagePositions.pachinko.x-2, stagePositions.pachinko.y+70, stagePositions.pachinko.z+12]}
        intensity={300}
        color="lime"
        angle={Math.PI}
        penumbra={0.4}
        distance={0}
        decay={2}
        castShadow
        target-position={[
          stagePositions.pachinko.x,
          stagePositions.pachinko.y,
          stagePositions.pachinko.z,
        ]}
      />
    </>
  )
}

export function SacrificeLights() {
  return (
    <>
      <ambientLight intensity={0.01} color={'orange'} />
      <directionalLight
        intensity={5}
        position={[150, 80, 50]} // not directly above, set an angle
        color={'purple'}
        castShadow
        shadow-mapSize-width={2048}   // higher = sharper shadow
        shadow-mapSize-height={2048}
        shadow-camera-left={-500}      // expand shadow frustum
        shadow-camera-right={500}
        shadow-camera-top={500}
        shadow-camera-bottom={-500}
        shadow-camera-near={0.1}      // near/far clipping
        shadow-camera-far={1000}
      />
      <directionalLight
        intensity={5}
        position={[10, 80, 50]} // not directly above, set an angle
        color={'orange'}
        castShadow
        shadow-mapSize-width={2048}   // higher = sharper shadow
        shadow-mapSize-height={2048}
        shadow-camera-left={-500}      // expand shadow frustum
        shadow-camera-right={500}
        shadow-camera-top={500}
        shadow-camera-bottom={-500}
        shadow-camera-near={0.1}      // near/far clipping
        shadow-camera-far={1000}
      />
    </>
  )
}

export function EntropyLights() {
  return (
    <></>
  )
}