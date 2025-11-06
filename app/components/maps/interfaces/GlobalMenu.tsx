'use client'

import { worldPortals } from "../../../lib/data/positions/worldPortals";
import { useNpcConfigStore } from "../../../lib/state/npcConfigState";
import { GameStateModal } from "./GameStateModal";
import SmallScene from "../../util/SmallScene";
import Model from "../../util/Model";
import { OrbitControls, useGLTF } from "@react-three/drei";
import PausedScreen from "../../util/PausedScreen";
import AudioPlayer from "../../util/AudioPlayer";
import { useRef } from "react";
import { House} from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "../../util/Button";

export default function GlobalMenu({worldKey}: {worldKey: string}) {
  const npcConfig = useNpcConfigStore(state => state.npcConfig)
  const worldPortal = worldPortals.find(portal => portal.worldKey === worldKey);
  const router = useRouter();
  const head = useGLTF("/models/avatars/head.glb").scene;

  function calculateWidth(param: string, value: string) {
    let width;

    if (param === 'formality') {
      switch(value) {
        case '하십시오체':
          width = 'bg-[conic-gradient(#ffffff_0deg_360deg,#ffffff00_360deg_360deg)]'
          break;
        case '해요체':
          width = 'bg-[conic-gradient(#ffffff_0deg_240deg,#ffffff00_240deg_360deg)]'
          break;
        case '해체':
          width = 'bg-[conic-gradient(#ffffff_0deg_120deg,#ffffff00_120deg_360deg)]'
          break;
        default:
          width = 'w-2'
      }
    } else if (param === 'verbosity') {
      switch(value) {
        case '투머치토커':
          width = 'bg-[conic-gradient(#ffffff_0deg_360deg,#ffffff00_360deg_360deg)]'
          break;
        case '평범':
           width = 'bg-[conic-gradient(#ffffff_0deg_240deg,#ffffff00_240deg_360deg)]'
          break;
        case '단답':
          width = 'bg-[conic-gradient(#ffffff_0deg_120deg,#ffffff00_120deg_360deg)]'
          break;
        default:
          width = 'w-2'
      }
    } else if (param === 'warmth') {
      switch(value) {
        case '친근한':
          width = 'bg-[conic-gradient(#ffffff_0deg_360deg,#ffffff00_360deg_360deg)]'
          break;
        case '중립적인':
          width = 'bg-[conic-gradient(#ffffff_0deg_240deg,#ffffff00_240deg_360deg)]'
          break;
        case '적대적인':
          width = 'bg-[conic-gradient(#ffffff_0deg_120deg,#ffffff00_120deg_360deg)]'
          break;
        default:
          width = 'w-2'
      }
    }
    return width
  }

  const audioRef = useRef<HTMLAudioElement>(null);

  if (!worldPortal) return;

  return (
    <div className="pointer-events-none absolute w-screen h-screen top-0 left-0">

      {/* 왼쪽 */}
      <div className="absolute w-auto h-auto top-5 left-8 text-white flex flex-col">
        <div className="relative w-70 flex justify-center">    
          <img src={`/images/${worldKey}-logo.png`} alt="world logo"/>
        </div>

        <div className="relative w-50 h-auto z-0 flex rounded-lg p-4 items-center gap-4">
          <div className="bg-[#00000099] blur-md w-50 h-40 absolute rounded-full"></div>
          <div className="w-25 h-30">
            <SmallScene>
              <Model
                scene={head}
                scale={3.9}
                position={[0,0,0]}
              />
              <directionalLight position={[0,50,10]} intensity={10} />
              <directionalLight position={[0,50,80]} intensity={2} />
              <OrbitControls
                enableZoom={false}
                minPolarAngle={Math.PI / 2 - 0.2} // look up a little
                maxPolarAngle={Math.PI / 2 + 0.2} // look down a little
                minAzimuthAngle={-0.3} // small left yaw
                maxAzimuthAngle={0.3}
              />
            </SmallScene>
          </div>

          <div className="w-full h-auto flex flex-col gap-2">
            {Object.entries(npcConfig).map(([key, value], index) => {
              const pl = index%2 === 1 ? 'pl-12' : 'pl-0'

              return (
                <div key={key} className={`flex gap-2 w-full h-12 items-center justify-center relative ${pl}`}>
                  <div className="w-12 h-12 absolute rounded-full border-[1px] opacity-50"></div>
                  <div className="w-7.5 h-7.5 absolute rounded-full border-[1px] opacity-50"></div>
                  <div className={`
                    absolute w-12 h-12 rounded-full mask-[radial-gradient(closest-side,transparent_calc(100%_-_10px),black_calc(100%_-_10px))]
                    ${calculateWidth(key, value ?? '')}
                  `}/>
                  <p className="text-xl absolute">{key.slice(0,1)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 오른쪽 */}
      <div className="absolute w-auto h-auto top-8 right-8 text-white">
        <div className="w-auto items-center hover:opacity-50 transition-opacity -translate-x-14 hidden">
          <Button
            id='3-1-0'
            onClick={() => {}}
            label={<></>}
            worldKey={worldKey}
          />
        </div>
        {/* 홈버튼 */}
        <div className="flex flex-col gap-2 w-auto items-center hover:opacity-50 transition-opacity -translate-x-14">
          <Button
            id='3-1-1'
            onClick={() => router.push('/')}
            label={<House className="w-7 h-7 -mx-2 text-white" />}
            worldKey={worldKey}
          />
        </div>
        {/* 일시정지 버튼 (아래에있음) */}
      </div>

      {/* 아래쪽 */}
      <GameStateModal worldKey={worldKey} />

      {/* 일시정지 */}
      <PausedScreen
        worldKey={worldKey}
        isInMap={true}
      />

      {/* 시작 */}
      <AudioPlayer
        src={worldPortal.bgm}
        worldKey={worldKey}
        audioRef={audioRef}
      />
    </div>
  )
}