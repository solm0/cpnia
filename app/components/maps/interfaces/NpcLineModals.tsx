import Button from "../../util/Button";
import { FindFugitiveLine, FindNpcLine, FindPizzaCutterLine, FindTimeSpecialLine } from "./FindNpcLine";
import { TypingText } from "./TypingText";
import { TimeOptionButton, SacrificeOptionButton, EntropyOptionButton } from "./OptionButtons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { nanumGothicCodingBold } from "@/app/lib/fonts";
import OptionButton from "../../util/OptionButton";
import { use3dFocusStore } from "@/app/lib/gamepad/inputManager";

export function TimeNpcLineModal({
  worldKey, name, setActiveNpc,
}: {
  worldKey: string;
  name: string;
  setActiveNpc: (name: string | null) => void;
}) {
  const [lineIndex, setLineIndex] = useState(0);
  let line;
  let options;
  let length;
  if (name === '카드게임장에서 발견한 주민' || name === '파친코 위에서 발견한 주민') {
    const lines = FindTimeSpecialLine(name);
    length = lines.length;
    line = lines[lineIndex].line;
    options = lines[lineIndex].options
  } else {
    console.log(name)
    const lines = FindNpcLine(name, worldKey);
    length = lines.length;
    line = lines[lineIndex];
  }

  const router = useRouter();

  const actions: Record<string, () => void> = {
    "goToGame": () => router.push(`
      /${worldKey}?game=${
        name === "카드게임장에서 발견한 주민" ? 'game1' : 'game2'
      }
    `),
    "closeModal": () => {
      setActiveNpc(null);
    }
  }

  return (
    <div className={`
      -translate-y-8 ml-8 mb-8 w-[60rem] h-[18rem] backdrop-blur-sm text-white flex flex-col items-start border-3 border-[#ffffff70]
      ${nanumGothicCodingBold.className}
    `}>
      <div className="absolute top-0 left-0 -z-10 w-full h-full bg-[#00000090] border-3 border-[#ffffff] blur-sm" />
      
      {/* 윗부분 */}
      <div className="flex h-14 w-full shrink-0 border-1 border-[#ffffff70] gap-4 items-center px-5">
        <div className="w-5 h-5 flex items-center justify-center">
          <div className="absolute w-3 h-3 bg-white rotate-45"/>
          <div className="w-5 h-5 bg-white opacity-50 rotate-45"/>
        </div>
        {name}
      </div>

      {/* 본문 */}
      <div className="w-full h-full border-1 border-[#ffffff70] py-4 px-5">
        <p className="max-w-[45rem] break-keep leading-7 overflow-y-scroll">
          <TypingText text={line ?? 'npc line이 없음'} />
        </p>

        {options ? (
          // 선택 버튼
          <div className="fixed right-8 bottom-16 h-auto w-72 flex flex-col gap-2">
            {options.map((option, idx) => 
              <div key={idx} className="flex gap-2 text-lime-400 hover:opacity-50 transition-opacity">
                <p>{`>`}</p>
                <TimeOptionButton
                  key={idx}
                  id={`3-2-${idx}`}
                  onClick={actions[option.action]}
                  label={option.answer}
                />
              </div>
            )}
          </div>
        ): (
          // 다음 또는 종료 버튼
          <OptionButton
            id='3-2'
            onClick={() => {
              if (length > lineIndex+1) {
                setLineIndex(lineIndex+1)
              } else {
                setActiveNpc(null);
              }}}
            label={
              <>
                <p className="absolute">&#9660;</p>
                <p className="absolute translate-y-5 opacity-50">&#9660;</p>
              </>
            }
            style="fixed bottom-13 right-20 h-auto w-10 text-6xl animate-pulse"
          />
        )}
      </div>
    </div>
  )
}

export function PizzaCutterLineModal({
  name, setActiveNpc, stage
}: {
  name: string;
  setActiveNpc: (name: string | null) => void;
  stage: string;
}) {
  const lines = FindPizzaCutterLine(stage);
  const [lineIndex, setLineIndex] = useState(0);
  const options = lines[lineIndex].options;

  const router = useRouter();

  const actions: Record<string, () => void> = {
    "goToGame": () => router.push(`/sacrifice?game=${stage}`),
    "closeModal": () => {
      setActiveNpc(null);
    }
  }

  return (
    <div className={`
      -translate-y-8 ml-8 rounded-4xl mb-8 w-[60rem] h-[18rem] backdrop-blur-sm font-bold text-white flex flex-col items-start p-4
      ${nanumGothicCodingBold.className}
    `}>
      <div className="absolute top-0 left-0 -z-10 w-full h-full bg-[#ae4bff95] blur-sm rounded-4xl mix-blend-darken" />
      
      {/* 윗부분 */}
      <div className="flex h-14 w-full shrink-0 gap-4 items-center px-5 rounded-t-4xl">
        <div className="w-5 h-5 flex items-center justify-center">
          <div className="absolute w-3 h-3 bg-yellow-300 rotate-45"/>
          <div className="w-5 h-5 bg-yellow-300 opacity-50 rotate-45"/>
        </div>
        {name}
      </div>

      <div className="border-b-5 border-yellow-300 w-full border-double" ></div>

      {/* 본문 */}
      <div className="w-full h-full py-4 px-5 rounded-b-4xl">
        <p className="max-w-[45rem] break-keep leading-7 overflow-y-scroll">
          <TypingText text={lines[lineIndex].line ?? 'npc line이 없음'} />
        </p>

        {options ? (
          // 선택 버튼
          <div className="fixed right-8 bottom-8 h-auto w-72 flex flex-col gap-2">
            {options.map((option, idx) => 
              <SacrificeOptionButton
                key={idx}
                id={`3-2-${idx}`}
                onClick={actions[option.action]}
                label={option.answer}
              />
            )}
          </div>
        ): (
          // 다음 또는 종료 버튼
          <OptionButton
            id='3-2'
            onClick={() => {
              if (lines.length > lineIndex+1) {
                setLineIndex(lineIndex+1)
              } else {
                setActiveNpc(null);
              }}}
            label={
              <>
                <p className="absolute text-yellow-300">&#9660;</p>
                <p className="absolute text-yellow-300 translate-y-5 opacity-50">&#9660;</p>
              </>
            }
            style="fixed bottom-13 right-20 h-auto w-10 text-6xl animate-pulse"
          />
        )}
      </div>
    </div>
  )
}

export function FugitiveLineModal({
  name, round, handleAnswerClick, setIsOpen
}: {
  name: string;
  round: number;
  handleAnswerClick: (point: number, round: number) => void;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const line = FindFugitiveLine(round);
  const options = line.options;

  const [isClicked, setIsClicked] = useState<number | null>(null);

  useEffect(() => {
    // 클릭되고 3초 후 null

    if (isClicked) {
      setTimeout(() => {
        setIsClicked(null);
      }, 3000)
    }
  }, [isClicked]);

  return (
    <div className={`
      -translate-y-8 ml-8 rounded-4xl mb-8 w-[60rem] h-[18rem] backdrop-blur-sm font-bold text-white flex flex-col items-start p-4
      ${nanumGothicCodingBold.className}
    `}>
      <div className="absolute top-0 left-0 -z-10 w-full h-full bg-[#ae4bff95] blur-sm rounded-4xl mix-blend-darken" />
      
      {/* 윗부분 */}
      <div className="flex h-14 w-full shrink-0 gap-4 items-center px-5 rounded-t-4xl">
        <div className="w-5 h-5 flex items-center justify-center">
          <div className="absolute w-3 h-3 bg-yellow-300 rotate-45"/>
          <div className="w-5 h-5 bg-yellow-300 opacity-50 rotate-45"/>
        </div>
        {name}
        <div className="absolute right-6 h-auto w-auto">
          <Button
            worldKey="sacrifice"
            label="닫기"
            onClick={() => {
              setIsOpen(false);
            }}
            id='w2g3-1'
          />
        </div>
      </div>

      <div className="border-b-5 border-yellow-300 w-full border-double" ></div>

      {/* 본문 */}
      <div className="w-full h-full py-4 px-5 rounded-b-4xl">
        <p className="max-w-[45rem] break-keep leading-7 overflow-y-scroll">
          <TypingText text={line.line ?? 'npc line이 없음'} />
        </p>

        <div className="fixed right-8 bottom-8 h-auto w-72 flex flex-col gap-2">
          {options.map((option, idx) => 
            <SacrificeOptionButton
              key={idx}
              id={`w2g3-2-${idx}`}
              onClick={() => handleAnswerClick(option.score, round)}
              label={option.answer}
              gainedScore={option.score}
              isClicked={isClicked}
              setIsClicked={setIsClicked}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export function SacrificeNpcLineModal({
  worldKey, name, setActiveNpc, options, stage
}: {
  worldKey: string;
  name: string;
  setActiveNpc: (name: string | null) => void;
  options?: {label: string, function: () => void}[];
  stage?: string;
}) {
  const lines = FindNpcLine(name, worldKey);
  const [lineIndex, setLineIndex] = useState(0);

  return (
    <div className={`
      -translate-y-8 ml-8 rounded-4xl mb-8 w-[60rem] h-[18rem] backdrop-blur-sm font-bold text-white flex flex-col items-start p-4
      ${nanumGothicCodingBold.className}
    `}>
      <div className="absolute top-0 left-0 -z-10 w-full h-full bg-[#ae4bff95] blur-sm rounded-4xl mix-blend-darken" />
      
      {/* 윗부분 */}
      <div className="flex h-14 w-full shrink-0 gap-4 items-center px-5 rounded-t-4xl">
        <div className="w-5 h-5 flex items-center justify-center">
          <div className="absolute w-3 h-3 bg-yellow-300 rotate-45"/>
          <div className="w-5 h-5 bg-yellow-300 opacity-50 rotate-45"/>
        </div>
        {name}
      </div>

      <div className="border-b-5 border-yellow-300 w-full border-double" ></div>

      {/* 본문 */}
      <div className="w-full h-full py-4 px-5 rounded-b-4xl">
        <p className="max-w-[45rem] break-keep leading-7 overflow-y-scroll">
          <TypingText text={lines[lineIndex] ?? 'npc line이 없음'} />
        </p>

        {options ? (
          // 선택 버튼
          options.map((option, idx) => 
            <SacrificeOptionButton
              key={idx}
              id={`3-2-${idx}`}
              onClick={option.function}
              label={option.label}
            />
          )
        ): (
          // 다음 또는 종료 버튼
          <OptionButton
            id='3-2'
            onClick={() => {
              if (lines.length > lineIndex+1) {
                setLineIndex(lineIndex+1)
              } else {
                setActiveNpc(null)
              }}}
            label={
              <>
                <p className="absolute text-yellow-300">&#9660;</p>
                <p className="absolute text-yellow-300 translate-y-5 opacity-50">&#9660;</p>
              </>
            }
            style="fixed bottom-13 right-20 h-auto w-10 text-6xl animate-pulse"
          />
        )}
      </div>
    </div>
  )
}

export function EntropyNpcLineModal({
  worldKey, name, setActiveNpc
}: {
  worldKey: string;
  name: string;
  setActiveNpc: (name: string | null) => void;
}) {
  const [lineIndex, setLineIndex] = useState(0);
  const lines = FindNpcLine(name, worldKey);
  const length = lines.length;
  const line = lines[lineIndex];
  
  return (
    <div className={`
      -translate-y-8 ml-8 mb-8 w-[60rem] h-[18rem] backdrop-blur-sm text-gray-900 flex flex-col items-start
      ${nanumGothicCodingBold.className}
      border-2 border-blue-600 bg-gray-400
    `}>
      
      {/* 윗부분 */}
      <div className="flex h-14 w-full shrink-0 border-1 border-blue-600 gap-4 items-center px-5">
        <div className="w-5 h-5 flex items-center justify-center">
          <div className="absolute w-3 h-3 bg-blue-600 rotate-45"/>
          <div className="w-5 h-5 bg-blue-600 opacity-50 rotate-45"/>
        </div>
        {name}
      </div>

      {/* 본문 */}
      <div className="w-full h-full border-1 border-blue-600 py-4 px-5">
        <p className="max-w-[45rem] break-keep leading-7 overflow-y-scroll">
          <TypingText text={line ?? 'npc line이 없음'} />
        </p>

        <OptionButton
          id='3-2'
          onClick={() => {
            if (length > lineIndex+1) {
              setLineIndex(lineIndex+1)
            } else {
              setActiveNpc(null)
            }}}
          label={
            <>
              <p className="absolute text-blue-600">&#9660;</p>
              <p className="absolute translate-y-5 opacity-50 text-blue-600">&#9660;</p>
            </>
          }
          style="fixed bottom-13 right-20 h-auto w-10 text-6xl animate-pulse"
        />
      </div>
    </div>
  )
}