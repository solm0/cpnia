'use client'

import SceneWithRef from "./components/util/SceneWithRef";
import { worldPortals } from "./lib/data/positions/worldPortals";
import WorldPortal from "./components/home/interfaces/WorldPortal";
import HomeMenu from "./components/home/interfaces/HomeMenu";
import { useNpcConfigStore } from "@/app/lib/state/npcConfigState";
import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import Button from "./components/util/Button";
import { useRouter } from "next/navigation";
import { HomeEffects } from "./components/maps/Effects";
import { HomeLights } from "./components/maps/Lights";
import { jersey15, nanumGothicCoding } from "./lib/fonts";
import { useGamepadControls } from "./lib/hooks/useGamepadControls";
import AudioPlayer from "./components/util/AudioPlayer";

export default function Home() {
  const router = useRouter();

  const defaultNpcConfig = {
    formality: '하십시오체',
    verbosity: '투머치토커',
    warmth: '적대적인',
  }
  const setNpcConfig = useNpcConfigStore(state => state.setNpcConfig);
  const gamepad = useGamepadControls();

  useEffect(() => {
    const savedConfig = localStorage.getItem('npc-config')
    if (!savedConfig) {
      setNpcConfig(defaultNpcConfig);
    }
  }, []);

  const sceneRef = useRef<{ focusOn: (target: [number, number, number], rotation: [number, number, number], zoomIn?: number) => void }>(null);
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

  const worldData = worldPortals.find(world => world.worldKey === focusedWorld);

  useEffect(() => {
    function checkPause() {
      if (gamepad?.current?.buttons[12]) {
        setIsFocused(true);
        focusPortal(worldPortals[0].position, worldPortals[0].rotation);
        setFocusedWorld(worldPortals[0].worldKey)
      } else if (gamepad?.current?.buttons[13]) {
        unFocusPortal();
        setIsFocused(false);
      }
    }
  
    const interval = setInterval(checkPause, 50); // check every 50ms
    return () => clearInterval(interval);
  }, [gamepad]);

  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <main className={`relative w-full h-full ${nanumGothicCoding.className}`}>
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
              src={world.src}
              label={world.worldName}
              worldKey={world.worldKey}
              position={world.position}
              rotation={world.rotation}
              scale={world.scale}
              rotationAxis={world.rotationAxis}
              rotationSpeed={world.rotationSpeed}
              onFocus={focusPortal}
              setFocusedWorld={setFocusedWorld}
            />
          )}

          {/* 빛, 효과 */}
          <HomeLights/>
          <HomeEffects />
        </SceneWithRef>
      </Canvas>
      
      </div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <p className="absolute top-20 text-sm left-1/2 -translate-x-1/2 text-white animate-pulse">
          {`게임패드: ${isFocused ? '▽ 눌러 뒤로가기' : '△ 눌러 월드 선택'}`}
        </p>
        {!isFocused && <HomeMenu />}
        {isFocused &&
          <>
            <div className="absolute top-1/2 -translate-y-1/2 left-4 scale-200">
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
            </div>

            <div className="absolute left-4/7 w-96 break-keep text-white text-center h-full flex flex-col justify-center gap-12 items-center pointer-events-auto">
              <h2 className={`text-5xl ${jersey15.className}`}>{worldData?.worldName}</h2>
              <p className="font-bold">{worldData?.label}</p>
              <p className="font-bold">{worldData?.description}</p>

              <div className="flex gap-2">
                <Button
                    label="ENTER WORLD"
                    onClick={() => router.push(`/interview?to=${focusedWorld}`)}
                  />
                <Button
                  label="BACK"
                  onClick={() => {
                    unFocusPortal();
                    setIsFocused(false);
                  }}
                />
              </div>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-4 scale-200">
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
          </>
        }
      </div>

      <AudioPlayer
        src={'/audio/home_bg.mp3'}
        audioRef={audioRef}
      />
    </main>
  );
}
