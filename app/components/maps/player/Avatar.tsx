import Model from "../../util/Model";

export function Avatar() {
  return (
    <group>
      <Model
        src="/models/avatar.glb"
        scale={8}
        position={[0,0,0]}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
}