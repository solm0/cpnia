'use client'

import { RefObject, useEffect, useState } from "react";
import Button from "./Button";
import FullScreenModal from "./FullScreenModal";

export default function AudioPlayer({
  src,
  worldKey,
  audioRef
}: {
  src: string;
  worldKey?: string;
  audioRef: RefObject<HTMLAudioElement | null>;
}) {
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    console.log(audio);

    audio.play()
      .catch(err => console.error("Audio play failed:", err));
  }, [audioRef]);


  return (
    <audio
      src={src}
      ref={audioRef}
      preload="auto"
      loop
    />
  );
}