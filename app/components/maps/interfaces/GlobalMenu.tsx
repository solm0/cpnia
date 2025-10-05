'use client'

import { useRouter } from "next/navigation";
import AudioPlayer from "../../util/AudioPlayer";
import { House } from "lucide-react";
import { worldPortals } from "../../../lib/data/positions/worldPortals";
import { useNpcConfigStore } from "../../../lib/state/npcConfigState";
import { GameStateModal } from "./GameStateModal";

export default function GlobalMenu({worldKey}: {worldKey: string}) {
  const router = useRouter();
  const npcConfig = useNpcConfigStore(state => state.npcConfig)
  const { formality, verbosity, warmth } = npcConfig;

  return (
    <>
      {/* 헤더 */}
      <div className="absolute w-screen top-0 left-0 h-12 flex items-center">

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
      </div>

      {/* 왼쪽 */}
      <div className="absolute w-auto h-auto top-14 left-4 text-white flex flex-col gap-4">
        <GameStateModal worldKey={worldKey} />

        <div className="relative w-auto h-auto flex flex-col items-start z-0">
          <div className="absolute w-full h-full bg-black -z-10 blur-sm opacity-50"></div>
          <h3>Npc 성격</h3>
          <div>formality: {formality}</div>
          <div>verbosity: {verbosity}</div>
          <div>warmth: {warmth}</div>
        </div>

        <div className="relative w-auto h-auto flex items-start flex-col z-0">
          <div className="absolute w-full h-full bg-black -z-10 blur-sm opacity-50"></div>
          <h3>키보드 조작법</h3>
          <p>wasd:아바타이동</p>
          <p>ijkl:카메라회전</p>
          <p>space:점프</p>
        </div>
      </div>
    </>
  )
}