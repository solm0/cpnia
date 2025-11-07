"use client";
import { useEffect, useRef, useState } from "react";

export default function ExhibitionWrapper({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  // 영상 파일 목록
  const videos = [
    "/video/video.mp4",
  ];

  const [currentVideo, setCurrentVideo] = useState(videos[0]);

  // 랜덤 비디오 선택 (바로 이전 영상 제외)
  const getRandomVideo = (prev: string) => {
    let next;
    do {
      next = videos[Math.floor(Math.random() * videos.length)];
    } while (next === prev);
    return next;
  };

  useEffect(() => {
    const handleInteraction = () => {
      if (!active) setActive(true);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(() => setActive(false), 50000);
    };

    window.addEventListener("keydown", handleInteraction);
    window.addEventListener("gamepadconnected", handleInteraction);
    window.addEventListener("mousemove", handleInteraction);
    return () => {
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("gamepadconnected", handleInteraction);
      window.removeEventListener("mousemove", handleInteraction);
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [active]);

  return (
    <>
      {!active ? (
        <video
          key={currentVideo}
          src={currentVideo}
          autoPlay
          loop={false}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          controls={false}
          style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
          onEnded={() => setCurrentVideo(prev => getRandomVideo(prev))}
        />
      ) : (
        children
      )}
    </>
  );
}