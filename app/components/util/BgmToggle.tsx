'use client'

import { jersey15 } from "@/app/lib/fonts";
import { useAudioStore } from "@/app/lib/state/audioState";

export default function BgmToggle({
  className = "",
}: {
  className?: string;
}) {
  const isBgmEnabled = useAudioStore((state) => state.isBgmEnabled);
  const toggleBgm = useAudioStore((state) => state.toggleBgm);

  return (
    <button
      type="button"
      onClick={toggleBgm}
      className={`${jersey15.className} pointer-events-auto text-xl text-white/80 hover:opacity-50 transition-opacity ${className}`}
    >
      {isBgmEnabled ? "bgm on ))" : "bgm off"}
    </button>
  );
}
