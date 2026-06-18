'use client'

import { RefObject, useEffect } from "react";
import { useAudioStore } from "@/app/lib/state/audioState";

export default function AudioPlayer(props: {
  src: string;
  worldKey?: string;
  audioRef: RefObject<HTMLAudioElement | null>;
}) {
  const { src, audioRef } = props;
  const isBgmEnabled = useAudioStore((state) => state.isBgmEnabled);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isBgmEnabled) {
      audio.pause();
      audio.currentTime = 0;
      return;
    }

    audio.play().catch((err) => console.error("Audio play failed:", err));
  }, [audioRef, isBgmEnabled, src]);

  useEffect(() => {
    const audio = audioRef.current;

    return () => {
      if (audio) {
        audio.pause();
      }
    };
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
