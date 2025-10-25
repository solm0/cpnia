import { Vector3 } from "three";
import { Fragment } from "./Fragment";
import { RigidBody } from "@react-three/rapier";

export default function Debris({
  scale = 1,
  position = new Vector3(0,0,0),
}: {
  scale?: number;
  position?: Vector3;
}) {
  return (
    <RigidBody type="dynamic" colliders={'cuboid'} gravityScale={0.5}>
      <group scale={scale} position={position}>
        <Fragment />
        <Fragment />
        <Fragment />
      </group>
    </RigidBody>
  )
}