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
import Image from "next/image";

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
  
  function focusPortal(num: number, isMove: boolean) {
    setIsFocused(true);
    const currentIndex = worldPortals.findIndex(world => world.worldKey === focusedWorld);
    const index = isMove ? (currentIndex + num + worldPortals.length) % worldPortals.length : num
    const pos = worldPortals[index].position;
    const rot = worldPortals[index].rotation

    if (pos && rot) {
      sceneRef.current?.focusOn(pos, rot, 20);
    }

    const prevWorldKey = worldPortals[index].worldKey;
    setFocusedWorld(prevWorldKey);
  }

  function unFocusPortal() {
    sceneRef.current?.focusOn([-5,0,0], [0,0,0], 30);
    setIsFocused(false);
  }

  const [isFocused, setIsFocused] = useState(false);
  const [focusedWorld, setFocusedWorld] = useState<string | null>(null);
  const worldData = worldPortals.find(world => world.worldKey === focusedWorld);

  useEffect(() => {
    const interval = setInterval(() => {
      if (gamepad?.current?.buttons[2]) unFocusPortal()
      else if (gamepad?.current?.buttons[3]) focusPortal(1, false);
    }, 60);
    return () => clearInterval(interval);
  }, [gamepad, isFocused]);

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
          {worldPortals.map((world, i) => 
            <WorldPortal
              key={world.worldKey}
              src={world.src}
              worldKey={world.worldKey}
              position={world.position}
              rotation={world.rotation}
              scale={world.scale}
              rotationAxis={world.rotationAxis}
              rotationSpeed={world.rotationSpeed}
              onFocus={focusPortal}
              setFocusedWorld={setFocusedWorld}
              id={i}
            />
          )}

          {/* 빛, 효과 */}
          <HomeLights/>
          <HomeEffects />
        </SceneWithRef>
      </Canvas>
      
      </div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {!isFocused &&
          <div className="absolute top-20 left-1/2 -translate-x-1/2 text-white animate-pulse flex gap-2 items-center">
            <p>게임패드 조작 시</p>
            <div className="w-10 h-10">
              <Image
                src="/images/x.png"
                alt="button"
                width={100}
                height={100}
              />
            </div>
            <p>눌러 월드 선택</p>
          </div>
        }
        {!isFocused && <HomeMenu />}
        {isFocused &&
          <>
            <div className="absolute top-1/2 -translate-y-1/2 left-4 scale-200">
              <Button
                label="<"
                onClick={() => focusPortal(-1, true)}
                small={true}
                id={`1-2-1`}
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
                  id={`1-2-2`}
                />
                <Button
                  label="BACK"
                  onClick={() => unFocusPortal()}
                  id={`1-2-3`}
                />
              </div>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-4 scale-200">
              <Button
                label=">"
                onClick={() => focusPortal(1, true)}
                small={true}
                id={`1-2-4`}
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
