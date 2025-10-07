'use client'

import { useRouter } from "next/navigation";
import { worldPortals } from "../../../lib/data/positions/worldPortals";
import { useNpcConfigStore } from "../../../lib/state/npcConfigState";
import { GameStateModal } from "./GameStateModal";
import SmallScene from "../../util/SmallScene";
import Model from "../../util/Model";
import PlaceHolder from "../../util/PlaceHolder";
import { OrbitControls } from "@react-three/drei";

export default function GlobalMenu({worldKey}: {worldKey: string}) {
  const router = useRouter();
  const npcConfig = useNpcConfigStore(state => state.npcConfig)
  const { formality, verbosity, warmth } = npcConfig;

  return (
    <div className="pointer-events-none absolute w-screen h-screen top-0 left-0">
      {/* 헤더 */}
      {/* <div className="absolute w-screen top-0 left-0 h-12 flex items-center">

        <div className="justify-self-start flex items-center px-3 gap-2">
          <AudioPlayer title="entropy_bg.mp3" />
          <div
            onClick={() => router.push('/')}
            className="flex items-center justify-center w-8 h-8 hover:opacity-50 transition-opacity"
          >
            <House className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 items-center justify-center w-auto h-auto text-white">
          <p>{worldPortals.find(portal => portal.worldKey === worldKey)?.worldName}</p>
          <p className="text-sm opacity-80">{worldPortals.find(portal => portal.worldKey === worldKey)?.label}</p>
        </div>
      </div> */}

      {/* 왼쪽 */}
      <div className="absolute w-auto h-auto top-8 left-8 text-white flex flex-col gap-4">
        <div className="w-50 h-auto flex flex-col gap-2">
          <div>
            <SmallScene>
              <PlaceHolder
                scale={0.7}
              />
              <ambientLight intensity={1} position={[0,10,10]}  />
              <directionalLight position={[0,50,10]} intensity={2} />
              <directionalLight position={[0,50,80]} intensity={1} />
              <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 2} maxPolarAngle={0} />
            </SmallScene>
          </div>
          <div className="absolute flex flex-col items-center text-center top-14 pointer-events-none">
            <p>국가 3d로고가 올 자리</p>
            <p>{worldPortals.find(portal => portal.worldKey === worldKey)?.worldName}~~!!!</p>
          </div>
        </div>

        <div className="relative w-auto h-auto z-0 backdrop-blur-sm">
          <div className="absolute w-full h-full bg-black -z-10 opacity-10 rounded-lg p-4 border border-white"></div>
          
          <div className="w-60 h-60">
            <SmallScene>
              <Model 
                src="/models/avatar-default.glb"
                scale={2}
                position={[0,-1,0]}
              />
              <ambientLight intensity={1} position={[0,10,10]}  />
              <directionalLight position={[0,50,10]} intensity={2} />
              <directionalLight position={[0,50,80]} intensity={1} />
              <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 2} maxPolarAngle={0} />
            </SmallScene>
          </div>
          <p className="absolute top-4 left-4 pointer-events-none text-xs">{formality} / {verbosity} / {warmth}</p>
        </div>
      </div>

      {/* 아래쪽 */}
      <GameStateModal worldKey={worldKey} />
    </div>
  )
}