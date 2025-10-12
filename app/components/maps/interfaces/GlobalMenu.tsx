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

  function calculateWidth(param: string, value: string) {
    let width;

    if (param === 'formality') {
      switch(value) {
        case '하십시오체':
          width = 'w-full'
          break;
        case '해요체':
          width = 'w-2/3'
          break;
        case '해체':
          width = 'w-1/3'
          break;
        default:
          width = 'w-2'
      }
    } else if (param === 'verbosity') {
      switch(value) {
        case '투머치토커':
          width = 'w-full'
          break;
        case '평범':
          width = 'w-2/3'
          break;
        case '단답':
          width = 'w-1/3'
          break;
        default:
          width = 'w-2'
      }
    } else if (param === 'warmth') {
      switch(value) {
        case '친근한':
          width = 'w-full'
          break;
        case '중립적인':
          width = 'w-2/3'
          break;
        case '적대적인':
          width = 'w-1/3'
          break;
        default:
          width = 'w-2'
      }
    }
    return width
  }

  return (
    <div className="pointer-events-none absolute w-screen h-screen top-0 left-0">

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

        <div className="relative w-auto h-auto z-0 backdrop-blur-sm flex flex-col">
          <div className="absolute w-full h-full -z-10 opacity-10 rounded-lg p-4 border border-white"></div>
          
          <div className="p-4 w-full h-auto flex flex-col gap-2">
            {Object.entries(npcConfig).map(([key, value]) => (
              <div key={key} className="flex gap-2 w-full items-center">
                <div className="shrink-0 w-10 h-10 border-1 border-[#ffffff70] rounded-full"></div>
                <div className="relative grow-1 h-4">
                  <div className="absolute w-full h-full border border-white rounded-full opacity-30"></div>
                  <div className="absolute w-full h-full border-2 border-white rounded-full blur-xs opacity-70"></div>
                  <div className="absolute p-1 w-full">
                    <div className={`${calculateWidth(key, value ?? '')} bg-white rounded-full h-2 opacity-70`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-50 h-44">
            <SmallScene>
              <Model
                src="/models/avatar-default.glb"
                scale={2.5}
                position={[0,-0.8,0]}
              />
              <ambientLight intensity={1} position={[0,10,10]}  />
              <directionalLight position={[0,50,10]} intensity={2} />
              <directionalLight position={[0,50,80]} intensity={1} />
              <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 2} maxPolarAngle={0} />
            </SmallScene>
          </div>
        </div>
      </div>

      {/* 아래쪽 */}
      <GameStateModal worldKey={worldKey} />
    </div>
  )
}