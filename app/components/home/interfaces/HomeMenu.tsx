'use client'

import Button from "../../util/Button";
import { useState } from "react";
import { useGameStore } from "@/app/lib/state/gameState"
import FullScreenModal from "../../util/FullScreenModal";
import { useRouter } from "next/navigation";
// import { temp } from "@/app/lib/ai/test";

export default function HomeMenu() {
  const router = useRouter();

  const [isPurseOpen, setIsPurseOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const timeCompleted = useGameStore(state => state.isWorldCompleted('time'));
  const sacrificeCompleted = useGameStore(state => state.isWorldCompleted('sacrifice'));
  const entropyCompleted = useGameStore(state => state.isWorldCompleted('entropy'));

  return (
    <>
      {/* 버튼들 */}

      <div className="relative top-2/3 flex flex-col items-center gap-4 h-auto w-auto pointer-events-auto">
        <h1 className="text-center text-black text-5xl w-[20em] break-keep font-mono select-none">Cpnia</h1>
        <Button
          onClick={() => setIsPurseOpen(true)}
          label="지갑"
        />
        <Button
          onClick={() => setIsAboutOpen(true)}
          label="게임에 대해서"
        />
        <Button
          onClick={() => router.push('/interview')}
          label="인터뷰"
        />
        {/* <Button
          onClick={() => temp()}
          label="openAI"
        /> */}
      </div>

      {/* 모달들 */}

      {isPurseOpen &&
        <FullScreenModal
          title="지갑"
          handleClose={setIsPurseOpen}
        >
          <div className="flex gap-2 z-80">
            <div className="bg-gray-200 rounded-lg w-56 h-32 flex items-center justify-center">{timeCompleted ? '시간기반체제 시민권' : '???'}</div>
            <div className="bg-gray-200 rounded-lg w-56 h-32 flex items-center justify-center">{sacrificeCompleted ? '희생기반체제 시민권' : '???'}</div>
            <div className="bg-gray-200 rounded-lg w-56 h-32 flex items-center justify-center">{entropyCompleted ? '엔트로피체제 시민권': '???'}</div>
          </div>
        </FullScreenModal>
      }

      {isAboutOpen &&
        <FullScreenModal
          title="게임에대해서"
          handleClose={setIsAboutOpen}
        >
          <div className="flex flex-col gap-2 w-96 text-center">
            <h3>About</h3>
            <p className="text-gray-700 break-keep w-max-[35rem]">
              돌아다니면서 사회에 대한 정보를 얻고, 퀘스트를 풀면서 시민들을 도와주고, 시민권을 얻어보세요
            </p>
          </div>
          <div className="flex flex-col gap-2 w-96 text-center">
            <h3>Credit</h3>
            <p className="text-gray-700 break-keep w-max-[35rem]">
              제18회 조형전 시각디자인학과 기획전 A팀
            </p>
            <p className="text-gray-700 break-keep w-max-[35rem]">
              백채민, 오서연, 정솔미, 남진영, 배경진, 안정원, 한예원
            </p>
          </div>
        </FullScreenModal>
      }
    </>
  )
}