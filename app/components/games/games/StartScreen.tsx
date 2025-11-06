import { useState } from "react";
import FullScreenModal from "../../util/FullScreenModal";
import Button from "../../util/Button";
import { nanumGothicCoding } from "@/app/lib/fonts";

export default function StartScreen({
  worldKey, gameKey, handleStart, desc, buttonLabel, style
}: {
  worldKey: string;
  gameKey: string;
  handleStart:() => void;
  desc: string;
  buttonLabel: string;
  style?: string;
}) {
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <>
      {!hasStarted &&
        <FullScreenModal>
          <div className={`
            ${nanumGothicCoding.className} ${style} flex justify-center gap-8 w-[25rem] h-auto break-keep text-center items-center
          `}>
              <div className="flex flex-col gap-4 bg-white rounded-2xl p-4 mt-20">
                <p className="font-bold text-2xl">{worldKey} 퀘스트 {gameKey.slice(-1)}</p>
                <p>{desc}</p>
              </div>
          </div>
          <div className="absolute top-1/2 scale-150">
            <Button
              onClick={() => {
                handleStart();
                setHasStarted(true);
              }}
              label={buttonLabel}
              worldKey={worldKey}
              id='6-1'
              important={true}
            />
          </div>
        </FullScreenModal>
      }
    </>
  )
}