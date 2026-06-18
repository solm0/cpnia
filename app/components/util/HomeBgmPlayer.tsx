'use client'

import { useRef } from "react";
import AudioPlayer from "./AudioPlayer";

export default function HomeBgmPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);

  return <AudioPlayer src="/audio/home_bg.mp3" audioRef={audioRef} />;
}
