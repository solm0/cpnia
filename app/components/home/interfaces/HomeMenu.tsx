'use client'

import Button from "../../util/Button";
import { useState } from "react";
import { useGameStore } from "@/app/lib/state/gameState"
import FullScreenModal from "../../util/FullScreenModal";
import UserNameForm from "./UserNameForm";
import CardModel from "./CardModel";
import { worldPortals } from "@/app/lib/data/positions/worldPortals";
import { jersey15, nanumGothicCoding, nanumGothicCodingBold } from "@/app/lib/fonts";
import Logo from "./Logo";
import LogoType from "./Logo";

export default function HomeMenu() {
  const [isPurseOpen, setIsPurseOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const timeCompleted = useGameStore(state => state.isWorldCompleted('time'));
  const sacrificeCompleted = useGameStore(state => state.isWorldCompleted('sacrifice'));
  const entropyCompleted = useGameStore(state => state.isWorldCompleted('entropy'));

  const timeWorldName = worldPortals.find(portal => portal.worldKey === 'time')?.worldName;
  const sacrificeWorldName = worldPortals.find(portal => portal.worldKey === 'sacrifice')?.worldName;
  const entropyWorldName = worldPortals.find(portal => portal.worldKey === 'entropy')?.worldName;

  return (
    <>
      {/* 버튼들 */}
      <div className={`${jersey15.className} relative top-3/5 flex flex-col items-center gap-8 h-auto w-auto`}>
        <LogoType anim={true} />

        <div className="flex flex-col gap-2 pointer-events-auto items-center">
          <Button
            onClick={() => setIsPurseOpen(true)}
            label="WALLET"
            id='1-1-1'
          />
          <Button
            onClick={() => setIsAboutOpen(true)}
            label="ABOUT"
            id='1-1-2'
          />
          <UserNameForm />
        </div>

      </div>

      {/* 모달들 */}

      {isPurseOpen &&
        <FullScreenModal
          title="WALLET"
          handleClose={setIsPurseOpen}
        >
          <div className="flex flex-col gap-0">
            <div className="flex h-auto">
              <div className="w-[23rem] h-[35rem]">
                <CardModel worldKey="time" isCompleted={timeCompleted} />
              </div>
              <div className="w-[23rem] h-[35rem]">
                <CardModel worldKey="sacrifice" isCompleted={sacrificeCompleted} />
              </div>
              <div className="w-[23rem] h-[35rem]">
                <CardModel worldKey="entropy" isCompleted={entropyCompleted} />
              </div>
            </div>
            <div className="flex h-10 font-bold text-white">
              <div className="rounded-lg w-[23rem] flex justify-center">{timeCompleted ? `${timeWorldName} 시민권` : '???'}</div>
              <div className="rounded-lg w-[23rem] flex justify-center">{sacrificeCompleted ? `${sacrificeWorldName} 시민권` : '???'}</div>
              <div className="rounded-lg w-[23rem] flex justify-center">{entropyCompleted ? `${entropyWorldName} 시민권`: '???'}</div>
            </div>
          </div>
        </FullScreenModal>
      }

      {isAboutOpen &&
        <FullScreenModal
          handleClose={setIsAboutOpen}
        >
          <div className="flex flex-col gap-12 items-center h-full justify-center text-gray-800">
            <LogoType anim={true} />
            <div className="flex flex-col gap-4 w-96 text-center">
              <h3 className="text-4xl">About</h3>
              <p className={`${nanumGothicCodingBold.className} break-keep w-max-[35rem] leading-7`}>
                C.pnia에는 인간과 AI의 합작으로 만들어진<br/>
                3개의 국가와 그 시민들이 있습니다.<br/>
                오픈 월드를 탐험하고 퀘스트를 깨면서 각 국가에<br/>
                대한 정보를 모으고, 시민권을 획득해 보세요.
              </p>
            </div>
            <div className="flex flex-col gap-4 w-auto text-center">
              <h3 className="text-4xl">Credit</h3>
              <p className={`${nanumGothicCodingBold.className} break-keep w-max-[35rem] leading-7`}>
                제18회 조형전 시각디자인학과 기획전 A팀<br/>
                백채민, 오서연, 정솔미, 남진영, 배경진, 안정원, 한예원
              </p>
            </div>
          </div>
        </FullScreenModal>
      }
    </>
  )
}