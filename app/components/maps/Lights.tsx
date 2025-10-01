export function HomeLights() {
  return (
    <></>
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
      />
      <directionalLight
        intensity={10}
        position={[10, -10, 0]} // not directly above, set an angle
        color={'magenta'}
        castShadow
      />
      <directionalLight
        intensity={5}
        position={[80, -10, 20]} // not directly above, set an angle
        color={'orange'}
        castShadow
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
        position={[0, 10, 0]} // not directly above, set an angle
        color={'purple'}
        castShadow
      />
      <directionalLight
        intensity={5}
        position={[50, 10, 0]} // not directly above, set an angle
        color={'orange'}
        castShadow
      />
    </>
  )
}

export function EntropyLights() {
  return (
    <></>
  )
}