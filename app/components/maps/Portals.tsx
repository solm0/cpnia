import { RigidBody } from "@react-three/rapier";
import { gamePortals } from "@/app/lib/data/positions/gamePortals";
import PlaceHolder from "../util/PlaceHolder";
import { useGameStore } from "@/app/lib/state/gameState";
import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import { Mesh, MeshStandardMaterial } from "three";
import { useFrame } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import GamePortalLabel from "./interfaces/GamePortalLabel";

export function GamePortal({
  modelSrc, locked, worldKey, gameKey, scale = 1
}: {
  modelSrc: string;
  locked: boolean;
  worldKey: string;
  gameKey: string;
  scale?: number;
}) {
  const gltf = useGLTF(modelSrc);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  console.log(locked, modelSrc)

  useEffect(() => {
    if (gltf) {

      gltf.scene.traverse((child) => {
        if ((child as Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          const mesh = child as Mesh

          // clone the material so each NPC is independent
          mesh.material = (mesh.material as MeshStandardMaterial).clone();

          const mat = mesh.material as MeshStandardMaterial;
          mat.onBeforeCompile = (shader) => {
            shader.uniforms.uHighlight = { value: 0 };

            shader.fragmentShader = `
              uniform float uHighlight;
            ` + shader.fragmentShader;

            shader.fragmentShader = shader.fragmentShader.replace(
              `#include <dithering_fragment>`,
              `
                #include <dithering_fragment>
                if (uHighlight > 0.5) {
                  gl_FragColor.rgb += vec3(0.2, 0.2, 0.2);
                }
              `
            );

            mesh.userData.shader = shader;
          };
        }
      })
    }
  }, [gltf]);

  useFrame(() => {
    if (!gltf.scene) return;
    gltf.scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const shader = child.userData.shader;
        if (shader?.uniforms?.uHighlight) {
          shader.uniforms.uHighlight.value = hovered ? 1 : 0;
        }
      }
    });
  });

  return (
    <group
      onPointerEnter={(e: MouseEvent) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerLeave={(e: MouseEvent) => {
        e.stopPropagation();
        setHovered(false);
      }}
      onClick={(e: MouseEvent) => {
        e.stopPropagation();
        if (!locked) {
          router.push(`/${worldKey}?game=${gameKey}`)
        }
      }}
      scale={scale}
    >
      <primitive object={gltf.scene} />
    </group>
  )
}


export default function Portals({
  worldKey,
}: {
  worldKey: string;
}) {
  const visibleGamePortals = gamePortals[worldKey].filter(portal => portal.position != null && portal.rotation != null);

  const gameState = useGameStore(state => state.worlds[worldKey].games)

  let stage: string;
  if (gameState['game1'] === false) {
    stage = 'game1';
  } else if (gameState['game2'] === false) {
    stage = 'game2'
  } else if (gameState['game3'] === false) {
    stage = 'game3'
  } else {
    stage = 'unknown';
  }

  function isLocked(gameKey: string, stage:string) {
    return Number(gameKey.slice(-1)) > Number(stage.slice(-1))
  }

  return (
    <>
      {/* 게임 포탈 */}
      {visibleGamePortals.map((game) => 
        <RigidBody
          key={game.gameKey}
          position={game.position}
          rotation={game.rotation}
          type="fixed"
        >
          <GamePortalLabel
            label={game.label}
            worldKey={worldKey}
            gameKey={game.gameKey}
            locked={Number(game.gameKey.slice(-1)) > Number(stage.slice(-1))}
            y={45}
          />

          {game.model ? (
            <GamePortal
              modelSrc={game.model}
              locked={isLocked(game.gameKey, stage)}
              worldKey={worldKey}
              gameKey={game.gameKey}
              scale={game.scale}
            />
          ): (
            <PlaceHolder />
          )}
        </RigidBody>
      )}
    </>
  )
}