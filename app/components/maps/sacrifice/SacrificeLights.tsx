export default function SacrificeLights() {
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
      <group position={[0, 0, 0]} />
    </>
  )
}