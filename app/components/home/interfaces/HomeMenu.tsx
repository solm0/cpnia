'use client'

import Button from "../../util/Button";
import { useState } from "react";
import { useGameStore } from "@/app/lib/state/gameState"
import FullScreenModal from "../../util/FullScreenModal";
import UserNameForm from "./UserNameForm";
import SmallScene from "../../util/SmallScene";
import Model from "../../util/Model";
import { OrbitControls } from "@react-three/drei";
import CardModel from "./CardModel";

export default function HomeMenu() {
  const [isPurseOpen, setIsPurseOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const timeCompleted = useGameStore(state => state.isWorldCompleted('time'));
  const sacrificeCompleted = useGameStore(state => state.isWorldCompleted('sacrifice'));
  const entropyCompleted = useGameStore(state => state.isWorldCompleted('entropy'));

  return (
    <>
      {/* 버튼들 */}
      <div className="relative top-3/5 flex flex-col items-center gap-8 h-auto w-auto pointer-events-auto">
        <h1 className="text-center text-black text-5xl w-[20em] break-keep select-none font-bold">Cpnia</h1>

        <div className="flex flex-col gap-2">
          <Button
            onClick={() => setIsPurseOpen(true)}
            label="지갑"
          />
          <Button
            onClick={() => setIsAboutOpen(true)}
            label="게임에 대해서"
          />
        </div>

        <UserNameForm />
      </div>

      {/* 모달들 */}

      {isPurseOpen &&
        <FullScreenModal
          title="지갑"
          handleClose={setIsPurseOpen}
        >
          <div className="flex flex-col gap-0">
            <div className="flex h-auto">
              <CardModel worldKey="time" isCompleted={timeCompleted} />
              <CardModel worldKey="sacrifice" isCompleted={sacrificeCompleted} />
              <CardModel worldKey="entropy" isCompleted={entropyCompleted} />
            </div>
            <div className="flex h-10 font-bold text-white">
              <div className="rounded-lg w-[23rem] flex justify-center">{timeCompleted ? '시간기반체제 시민권' : '???'}</div>
              <div className="rounded-lg w-[23rem] flex justify-center">{sacrificeCompleted ? '피자슛 시민권' : '???'}</div>
              <div className="rounded-lg w-[23rem] flex justify-center">{entropyCompleted ? '엔트로피체제 시민권': '???'}</div>
            </div>
          </div>
        </FullScreenModal>
      }

      {isAboutOpen &&
        <FullScreenModal
          title="게임에 대해서"
          handleClose={setIsAboutOpen}
        >
          <div className="flex flex-col gap-4 w-96 text-center">
            <h3 className="text-white font-bold">About</h3>
            <p className="text-white break-keep w-max-[35rem]">
              Cpnia에는 인간과 ai의 합작으로 만들어진 3개의 사회와 그 시민들이 있습니다. 오픈 월드를 돌아다니고 퀘스트를 풀면서 각 사회에 대한 정보를 모으고, 시민권을 획득해 보세요.
            </p>
          </div>
          <div className="flex flex-col gap-4 w-auto text-center">
            <h3 className="text-white font-bold">Credit</h3>
            <p className="text-white break-keep w-auto flex flex-col gap-2">
              <span className="w-full">제18회 조형전 시각디자인학과 기획전 A팀</span>
              <span className="w-full">백채민, 오서연, 정솔미, 남진영, 배경진, 안정원, 한예원</span>
            </p>

          </div>
        </FullScreenModal>
      }
    </>
  )
}