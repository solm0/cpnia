'use client'

import { useEffect, useState } from "react";

export default function ScreenSizeBlocker() {
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    setIsBlocked(window.innerWidth < 768);
  }, []);

  if (!isBlocked) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-xl text-white flex-col gap-2">
      <p className="text-lg">더 큰 화면에서 만나요~</p>
      <p className="text-lg">PC 접속 중일 경우 화면 늘리고 새로고침</p>
    </div>
  );
}
