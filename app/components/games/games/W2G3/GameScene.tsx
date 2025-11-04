import Player from "./Player";
import { Physics } from "@react-three/rapier";
import { Boundary } from "@/app/components/maps/player/clampToBoundary";
import { BoxHelper } from "../W1G1/BoxHelper";
import Fugitive from "./Fugitive";
import { DoubleSide, Object3D, Vector3 } from "three";
import { useGLTF } from "@react-three/drei";
import { memo } from "react";

export const GameScene = memo(function GameScene({
  setIsOpen,
  avatar,
}: {
  setIsOpen: (isOpen: boolean) => void;
  avatar: Object3D;
}) {
  const map = useGLTF('/models/w2g3.glb').scene;
  const initialPos = new Vector3(0,0,0);
  const mapPos = new Vector3(
    initialPos.x - 70,
    initialPos.y,
    initialPos.z - 17
  );
  const mapScale = 3;
  const fugitivePos = new Vector3(
    initialPos.x - 50 * mapScale,
    0,
    initialPos.z - 25 * mapScale,
  )
  const mapArea: Boundary = {
    type: "rect",
    center: [mapPos.x, mapPos.z],
    size: [
      mapScale*74,
      mapScale*43,
    ]
  }

  const config: {
    playerPos: Vector3,
    playerRot: Vector3,
    camYRot: number,
    camYPos: number,
    camZPos: number,
  } = {
    playerPos: new Vector3(
      20,0,35
    ),
    playerRot: new Vector3(0, -Math.PI, 0),
    camYRot: 0,
    camYPos: 5,
    camZPos: 10,
  }

  return (
    <Physics>
      <group onClick={() => setIsOpen(true)}>
        <Fugitive
          position={fugitivePos}
          scale={mapScale*2.7}
          setIsOpen={setIsOpen}
        />
      </group>

      {/* 맵 */}
      <primitive
        object={map}
        scale={mapScale}
        position={mapPos}
      />
      {/* <BoxHelper
        width={mapArea.size?.[0] ?? 0}
        depth={mapArea.size?.[1] ?? 0}
        center={new Vector3(
          mapArea.center[0],
          0,
          mapArea.center[1],
        )}
        color="green"
      /> */}

      {/* 바닥, 천장 */}
      <mesh rotation-x={-Math.PI / 2} position={mapPos} receiveShadow>
        <planeGeometry
          args={[
            mapArea.size?.[0] ?? 0,
            mapArea.size?.[1] ?? 0
          ]}
        />
        <meshStandardMaterial color="green" />
      </mesh>
      {/* <mesh rotation-x={Math.PI / 2} position={[
        mapPos.x,
        mapPos.y + mapScale*7.4,
        mapPos.z
      ]} receiveShadow>
        <planeGeometry
          args={[
            mapArea.size?.[0] ?? 0,
            mapArea.size?.[1] ?? 0
          ]}
        />
        <meshStandardMaterial color="yellow" side={DoubleSide} />
      </mesh> */}

      {/* 카메라, 컨트롤 */}
      <Player
        avatar={avatar}
        config={config}
        rectArea={[mapArea]}
      />
      {/* <OrbitControls /> */}

      {/* 조명, 색 */}
      <directionalLight intensity={1} position={[20,10,30]} color={'white'} />
      <directionalLight intensity={2} position={[0,10,0]} color={'orange'} castShadow/>
    </Physics>
  )
}
) 