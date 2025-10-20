'use client'

import { RefObject, useState } from "react";
import Button from "./Button";
import FullScreenModal from "./FullScreenModal";

export default function AudioPlayer({
  src,
  worldKey,
  audioRef
}: {
  src: string;
  worldKey: string;
  audioRef: RefObject<HTMLAudioElement | null>;
}) {
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.play().then(() => {
      setStarted(true);
    }).catch(err => {
      console.error("Audio play failed:", err);
    });
  };

  return (
    <>
      {!started && (
        <FullScreenModal>
          <div className="relative w-auto h-full flex flex-col items-center justify-center gap-2 text-white">
            <div>조작법, 캐릭터 성격설명</div>
            <Button
              label="시작하기"
              onClick={handleStart}
              worldKey={worldKey}
              autoFocus={true}
            />
          </div>
        </FullScreenModal>
      )}

      <audio
        src={src}
        ref={audioRef}
        preload="auto"
        loop
      />
    </>
  );
}