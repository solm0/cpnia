'use client'

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AudioPlayer({title}: {title: string}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused === false) {
      const audio = ref.current;
      if (!audio) return;
      audio.muted = false;
      audio.play();
      setPaused(false);
    }
  }, [])

  const togglePlay = async() => {
    const audio = ref.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        audio.muted = false;
        await audio.play();
        setPaused(false);
      } catch(err) {
        alert(`음악틀기문제발생😭: ${err}`);
      }
    } else {
      audio.pause();
      setPaused(true);
    }
  };

  return (
    <>
      <audio src={`/audio/${title}`} ref={ref} preload="auto" autoPlay loop />
      <button onClick={togglePlay} className="w-8 h-8 flex items-center justify-center hover:opacity-50 transition-opacity">
        {paused ? <VolumeX className="w-6 h-6 text-white"/> : <Volume2 className="w-6 h-6 text-white"/>}
      </button>
    </>
  )
}