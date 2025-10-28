'use client'

import { RefObject, useEffect, useRef, useState } from "react";
import { gameRefProp } from "../W1G1";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { AnimationAction, AnimationMixer, LoopOnce, LoopRepeat, Object3D, Vector3 } from "three";
import { BoxHelper } from "./BoxHelper";
import { degToRad, MathUtils } from "three/src/math/MathUtils.js";
import { PosHelper } from "../W2G2/AnchorHelper";
import { CoinPileOnTable, CoinPileOnTableWRef } from "./CoinPile";
import { useAnimGltf } from "@/app/lib/hooks/useAnimGltf";

function Npc({
  avatarPos, avatarScale, motionPhase
}: {
  avatarPos: Vector3;
  avatarScale: number;
  motionPhase: RefObject<'idle' | 'pick' | 'bet' | 'npcFail' | 'npcWin'>
}) {
  // useEffect(() => {
  //   useGLTF.preload("/models/table.glb");
  //   useGLTF.preload("/models/avatars/time-npc.glb");
  //   useGLTF.preload("/models/cardPile.glb");
  // }, []);

  const avatar = useGLTF('/models/avatars/time-npc.glb').scene;
  const mixer = useRef<AnimationMixer | null>(null);
  const actionsRef = useRef<AnimationAction | null>(null);
  const animGltf = useAnimGltf();
  const [localPhase, setLocalPhase] = useState<'idle' | 'pick' | 'bet' | 'npcFail' | 'npcWin'>('idle');

  useEffect(() => {
    mixer.current = new AnimationMixer(avatar);
    return () => {
      mixer.current?.stopAllAction();
    };
  }, [avatar]);

  useFrame((_, delta) => {
    if (motionPhase.current !== localPhase) {
      setLocalPhase(motionPhase.current);
    }
    mixer.current?.update(delta);
  });

  useEffect(() => {
    if (!mixer.current) return;
    const actionKey = motionPhase.current === 'npcWin' ? 2 : 0

    const anim = animGltf[actionKey]?.animations?.[0];
    if (!anim) return;
  
    // fade out previous action
    if (actionsRef.current) {
      actionsRef.current.fadeOut(0.2);
    }
  
    const action = mixer.current.clipAction(anim);
    action
      .reset()
      .fadeIn(0.2)
      .setLoop(
        LoopRepeat, actionKey === 2 ? 3 : Infinity
      )
      .play();

    if (actionKey === 2) {
      action.clampWhenFinished = true;
    }
  
    actionsRef.current = action;
  }, [localPhase, animGltf]);

  return (
    <primitive
      object={avatar}
      position={avatarPos}
      scale={avatarScale}
    />
  )
}

export default function Table({
  hasPicked, gameRef, turn, currentNum, cards, coin,
  motionPhase,
}: {
  hasPicked: boolean;
  gameRef: RefObject<gameRefProp[]>;
  turn: RefObject<number>;
  currentNum: RefObject<number | null>;
  cards: Record<number, Object3D>;
  coin: Object3D;
  motionPhase: RefObject<'idle' | 'pick' | 'bet' | 'npcFail' | 'npcWin'>;
}) {
  const table = useGLTF('/models/table.glb').scene;
  const cardPile = useGLTF("/models/cardPile.glb").scene;

  const tableScale = 5;
  const tableSurface = {
    center: new Vector3(0, tableScale * 0.73, 0),
    sizeZ: 5
  }

  const avatarPos = new Vector3(0, tableScale * 0.3, -tableScale);
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

  const [version, setVersion] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCount = gameRef.current[0].betChips + gameRef.current[1].betChips;
      setVersion(newCount);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const movingCoinRef = useRef<Object3D>(null);
  const movingCoinProg = useRef(0);
  const centerCoinRef = useRef<Object3D>(null);
  const centerCoinProg = useRef(0);

  useFrame(() => {
    if (!movingCoinRef.current) return;
    if (motionPhase.current === "bet") {
      const isDoubleMotion = turn.current === 0;
      const progress = movingCoinProg.current;
      const currentPhase = isDoubleMotion && progress >= 1 ? 1 : 0;
    
      const startZ = currentPhase === 0
        ? turn.current % 2 === 0
          ? playerChipPos.z
            : npcChipPos.z : npcChipPos.z;
      const endZ = tableSurface.center.z;
    
      // increment progress
      movingCoinProg.current += 0.01;
    
      // compute local t for each phase
      const t = isDoubleMotion
        ? currentPhase === 0
          ? Math.min(progress, 1)
          : Math.min(progress - 1, 1)
        : Math.min(progress, 1);
    
      // move coin smoothly
      movingCoinRef.current.position.z = MathUtils.lerp(startZ, endZ, t);
    
      // handle transitions
      if (isDoubleMotion) {
        // just finished first motion → reposition to player chip start *once*
        if (progress < 1.01 && movingCoinProg.current >= 1.01) {
          movingCoinRef.current.position.z = playerChipPos.z;
        }
    
        // both motions finished → reset
        if (movingCoinProg.current >= 2) {
          motionPhase.current = "idle";
          movingCoinProg.current = 0;
        }
      } else {
        if (movingCoinProg.current >= 1) {
          motionPhase.current = "idle";
          movingCoinProg.current = 0;
        }
      }
    }

    if (motionPhase.current === 'pick') {
      
    }

    if (motionPhase.current === 'npcWin') {
      if (!centerCoinRef.current) return;
      console.log('npcwin')

      // 코인이 npcChipPos로 이동
      const startZ = tableSurface.center.z;
      const endZ = npcChipPos.z;

      centerCoinProg.current += 0.01;

      centerCoinRef.current.position.z = MathUtils.lerp(startZ, endZ, Math.min(centerCoinProg.current, 1))
      
      if (centerCoinProg.current >= 1) {
        motionPhase.current = "idle";
        centerCoinProg.current = 0;
      }
    }

    if (motionPhase.current === 'npcFail') {
      if (!centerCoinRef.current) return;

      // 코인이 playerChipPos로 이동
      const startZ = tableSurface.center.z;
      const endZ = playerChipPos.z;

      centerCoinProg.current += 0.01;

      centerCoinRef.current.position.z = MathUtils.lerp(startZ, endZ, Math.min(centerCoinProg.current, 1));
      
      if (centerCoinProg.current >= 1) {
        motionPhase.current = "idle";
        centerCoinProg.current = 0;
      }
    }

  });

  return (
    <>
      {/* npc */}
      <Npc
        avatarPos={avatarPos}
        avatarScale={avatarScale}
        motionPhase={motionPhase}
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

      {/* 각자의 칩 */}
      <PosHelper
        pos={npcChipPos}
        size={0.1}
      />
      {/* <PosHelper
        pos={playerChipPos}
        size={0.1}
      /> */}
      <CoinPileOnTable
        coin={coin.clone()}
        count={gameRef.current[1].leftChips}
        position={npcChipPos}
      />

      {/* 테이블 중앙 */}
      {!hasPicked ? (
        <primitive
          object={cardPile}
          position={[
            tableSurface.center.x,
            tableSurface.center.y + 0.01,
            tableSurface.center.z
          ]}
          scale={tableScale * 0.15}
        />
      ): (
        <group
          position={new Vector3(
            tableSurface.center.x,
            tableSurface.center.y + 0.01,
            tableSurface.center.z
          )}
          ref={centerCoinRef}
        >
          <CoinPileOnTable
            key={version}
            coin={coin.clone()}
            count={gameRef.current[0].betChips + gameRef.current[1].betChips}
            position={new Vector3(0,0,0)}
          />
        </group>
      )}

      {/* 이동하는 코인 */}
      {/* 현재 currentNum이 0이어도 동전 1개임. motionPhase가 'idle'이어도 안 없어짐. */}
      {motionPhase.current === 'bet' &&
        <CoinPileOnTableWRef
          ref={movingCoinRef}
          coin={coin.clone()}
          count={currentNum.current ?? 0}
          position={turn.current % 2 === 0 ? playerChipPos : npcChipPos}
        />
      }

      {/* <OrbitControls /> */}
      <directionalLight intensity={3} position={[0, 10, 5]} />
    </>
  )
}