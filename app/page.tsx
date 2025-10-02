/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import SceneWithRef from "./components/util/SceneWithRef";
import { worldPortals } from "./lib/data/worldPortals";
import WorldPortal from "./components/home/interfaces/WorldPortal";
import HomeMenu from "./components/home/interfaces/HomeMenu";
import { useNpcConfigStore } from "@/app/lib/state/npcConfigState";
import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import Button from "./components/util/Button";
import { useRouter } from "next/navigation";
import { HomeEffects } from "./components/maps/Effects";

export default function Home() {
  const router = useRouter();

  const defaultNpcConfig = {
    formality: '하십시오체',
    verbosity: '투머치토커',
    warmth: '적대적인',
  }
  const setNpcConfig = useNpcConfigStore(state => state.setNpcConfig);

  useEffect(() => {
    const savedConfig = localStorage.getItem('npc-config')
    if (!savedConfig) {
      setNpcConfig(defaultNpcConfig);
    }
  }, []);

  const sceneRef = useRef<any>(null);
  const focusPortal = (
    position?: [number, number, number],
    rotation?: [number, number, number],
  ) => {
    if (position && rotation) {
      sceneRef.current?.focusOn(position, rotation, 20);
    }
  }

  const unFocusPortal = () => {
    sceneRef.current?.focusOn([-5,0,0], [0,0,0], 30);
  }

  const [isFocused, setIsFocused] = useState(false);
  const [focusedWorld, setFocusedWorld] = useState<string | null>(null);

  return (
    <main className="relative w-full h-full">
      <div className="w-full h-full relative z-0">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }} frameloop="always">
        <SceneWithRef
          ref={sceneRef}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
        >
          {worldPortals.map(world => 
            <WorldPortal
              key={world.worldKey}
              label={world.label}
              worldKey={world.worldKey}
              position={world.position}
              rotation={world.rotation}
              onFocus={focusPortal}
              setFocusedWorld={setFocusedWorld}
            />
          )}

          {/* 효과 */}
          <HomeEffects />
        </SceneWithRef>
      </Canvas>
      </div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {!isFocused && <HomeMenu />}
        {isFocused &&
          <div className="absolute left-3/5 w-96 break-keep text-gray-700 text-center h-full flex flex-col justify-center gap-12 items-center pointer-events-auto">
            <p className="font-bold">{worldPortals.find(world => world.worldKey === focusedWorld)?.description}</p>
            <div className="flex">
              <Button
                label="<"
                onClick={() => {
                  const currentIndex = worldPortals.findIndex(world => world.worldKey === focusedWorld);
                  const prevIndex = (currentIndex - 1 + worldPortals.length) % worldPortals.length;
                  
                  focusPortal(worldPortals[prevIndex].position, worldPortals[prevIndex].rotation);
                  const prevWorldKey = worldPortals[prevIndex].worldKey;
                  setFocusedWorld(prevWorldKey);
                }}
                small={true}
              />
              <Button
                label=">"
                onClick={() => {
                  const currentIndex = worldPortals.findIndex(world => world.worldKey === focusedWorld);
                  const nextIndex = (currentIndex + 1) % worldPortals.length;
                  
                  focusPortal(worldPortals[nextIndex].position, worldPortals[nextIndex].rotation);
                  const nextWorldKey = worldPortals[nextIndex].worldKey;
                  setFocusedWorld(nextWorldKey);
                }}
                small={true}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Button
                  label="입장하기"
                  onClick={() => router.push(`/interview?to=${focusedWorld}`)}
                />
              <Button
                label="뒤로"
                onClick={() => {
                  unFocusPortal();
                  setIsFocused(false);
                }}
              />
            </div>
          </div>}
      </div>
    </main>
  );
}
