import { RefObject, useEffect } from "react";
import { gameRefProp } from "../W1G1";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Object3D, Vector3 } from "three";
import { BoxHelper } from "./BoxHelper";
import { degToRad } from "three/src/math/MathUtils.js";
import { PosHelper } from "../W2G2/AnchorHelper";

useGLTF.preload("/models/table.glb");
useGLTF.preload("/models/avatars/default.glb");

export default function Table({
  hasPicked, gameRef, turn, currentNum, cards, coin
}: {
  hasPicked: boolean;
  gameRef: RefObject<gameRefProp[]>;
  turn: RefObject<number>;
  currentNum: RefObject<number | null>;
  cards: Record<number, Object3D>;
  coin: Object3D;
}) {
  const table = useGLTF('/models/table.glb').scene;
  const avatar = useGLTF('/models/avatars/default.glb').scene;

  const tableScale = 5;
  const tableSurface = {
    center: new Vector3(0, tableScale * 0.73, 0),
    sizeZ: 5
  }

  const avatarPos = new Vector3(0, tableScale * 0.4, -tableScale);
  const avatarScale = tableScale * 0.8;
  
  const cardPos = new Vector3(
    0,
    tableScale * 1,
    -tableScale * 0.8,
  );
  const cardScale = tableScale * 0.01;
  const cardRot = [degToRad(90), 0, 0]
  
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 6.5, 4.8);
    camera.rotation.set(0,0,0);
    camera.lookAt(tableSurface.center);
  }, [camera, hasPicked]);

  const npcCard = gameRef.current[1].card;

  const npcChipPos = new Vector3(
    tableSurface.center.x,
    tableSurface.center.y,
    tableSurface.center.z - tableSurface.sizeZ + 3
  );
  const playerChipPos = new Vector3(
    tableSurface.center.x,
    tableSurface.center.y,
    tableSurface.center.z + tableSurface.sizeZ - 3
  );

  return (
    <>
      {/* npc */}
      <primitive
        object={avatar}
        position={avatarPos}
        scale={avatarScale}
      />
      {npcCard &&
        <primitive
          object={cards[npcCard]}
          position={cardPos}
          scale={cardScale}
          rotation={cardRot}
        />
      }

      {/* 테이블 */}
      <primitive
        object={table}
        position={[0,0,0]}
        scale={tableScale}
      />
      <BoxHelper
        width={1}
        depth={tableSurface.sizeZ}
        center={tableSurface.center}
        color="green"
      />

      {/* 각자의 칩 위치 */}
      <PosHelper
        pos={npcChipPos}
        size={0.1}
      />
      <PosHelper
        pos={playerChipPos}
        size={0.1}
      />


      {/* <OrbitControls /> */}
      {/* Pick에서 setHasPicked */}
      <directionalLight intensity={3} position={[0, 10, 5]} />
    </>
  )
}