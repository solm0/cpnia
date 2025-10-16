import { Object3D } from "three";
import { useMemo } from "react";
import CrowdChar from "./CrowdChar";

export default function Crowd({
  gltfMap
}: {
  gltfMap: Record<string, Object3D>;
}) {
  const field = {
    center: [0, 0, 0] as [number, number, number],
    sizeX: 40,
    sizeY: 3,
    gapX: 10,
  };

  const sideWidth = (field.sizeX - field.gapX) / 2;

  const placed = useMemo(() => {
    const usedX: number[] = [];
    const minDistance = 2; // minimum distance between characters
  
    return Object.entries(gltfMap).map(([key, model], index) => {
      const isLeft = Math.random() > 0.5;
      const halfCenterX =
        field.center[0] + (isLeft ? -1 : 1) * (field.gapX / 2 + sideWidth / 2);
  
      let randomX: number;
      let tries = 0;
  
      // keep generating randomX until it's not too close to previous ones
      do {
        randomX = halfCenterX + (Math.random() - 0.5) * sideWidth * 0.9;
        tries++;
      } while (
        usedX.some((x) => Math.abs(x - randomX) < minDistance) &&
        tries < 20
      );
  
      usedX.push(randomX);
  
      const randomZ =
        field.center[2] + (Math.random() - 0.5) * field.sizeY * 0.9;
  
      return (
        <CrowdChar
          key={key}
          model={model}
          animTerm={(index + 1) * 1000}
          position={[randomX, field.center[1], randomZ]}
        />
      );
    });
  }, [gltfMap, field, sideWidth]);

  return (
    <>
      {/* <mesh
        rotation-x={-Math.PI / 2}
        position={[
          field.center[0] - (field.gapX / 2 + sideWidth / 2),
          field.center[1],
          field.center[2],
        ]}
        receiveShadow
      >
        <planeGeometry args={[sideWidth, field.sizeY]} />
        <meshStandardMaterial color="white" />
      </mesh> */}
      {/* <mesh
        rotation-x={-Math.PI / 2}
        position={[
          field.center[0] + (field.gapX / 2 + sideWidth / 2),
          field.center[1],
          field.center[2],
        ]}
        receiveShadow
      >
        <planeGeometry args={[sideWidth, field.sizeY]} />
        <meshStandardMaterial color="white" />
      </mesh> */}

      {placed}
    </>
  );
}