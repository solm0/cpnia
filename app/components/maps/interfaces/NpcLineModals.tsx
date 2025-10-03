import Button from "../../util/Button";
import FindNpcLine from "./FindNpcLine";
import { TypingText } from "../../util/TypingText";

export function TimeNpcLineModal({
  worldKey, name, setActiveNpc, options,
}: {
  worldKey: string;
  name: string;
  setActiveNpc: (name: string | null) => void;
  options?: string[];
}) {
  const line = FindNpcLine(name, worldKey);

  return (
    <div className="-translate-y-8 ml-8 mb-8 w-[60rem] h-[18rem] backdrop-blur-sm text-white flex flex-col items-start border-3 border-[#ffffff70]">
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
          <div>옵션버튼</div>
        ): (
          <div
            className="fixed bottom-13 right-20 h-auto w-10 text-6xl animate-pulse"
            onClick={() => {console.log('click'); setActiveNpc(null)}}
          >
            <p className="absolute">&#9660;</p>
            <p className="absolute translate-y-5 opacity-50">&#9660;</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function SacrificeNpcLineModal({
  worldKey, name, setActiveNpc
}: {
  worldKey: string;
  name: string;
  setActiveNpc: (name: string | null) => void;
}) {
  const line = FindNpcLine(name, worldKey);

  return (
    <div className="flex flex-col gap-2 w-full items-start">
      <p>{name} says:</p>
      <TypingText text={line ?? 'npc line이 없음'} />
      <Button
        onClick={() => setActiveNpc(null)}
        label="닫기"
        worldKey={worldKey}
      />
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
  const line = FindNpcLine(name, worldKey);

  return (
    <div className="flex flex-col gap-2 w-full items-start">
      <p>{name} says:</p>
      <TypingText text={line ?? 'npc line이 없음'} />
      <Button
        onClick={() => setActiveNpc(null)}
        label="닫기"
        worldKey={worldKey}
      />
    </div>
  )
}