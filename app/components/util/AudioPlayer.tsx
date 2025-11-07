'use client'

import { RefObject, useEffect } from "react";

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

    audio.play()
      .catch(err => console.error("Audio play failed:", err));
  }, [audioRef]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.load();
      }
    };
  }, []);


  return (
    <audio
      src={src}
      ref={audioRef}
      preload="auto"
      loop
    />
  );
}