"use client";
import { useEffect, useRef, useState } from "react";

export default function ExhibitionWrapper({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  // 영상 파일 목록
  const videos = [
    'https://res.cloudinary.com/dz3ocjmfw/video/upload/v1762574308/7_%E1%84%92%E1%85%B4%E1%84%89%E1%85%A2%E1%86%BC_%E1%84%80%E1%85%A6%E1%84%8B%E1%85%B5%E1%86%B73_compressed_ank0ee.mp4',
    'https://res.cloudinary.com/dz3ocjmfw/video/upload/v1762574303/3_%E1%84%89%E1%85%B5%E1%84%80%E1%85%A1%E1%86%AB_%E1%84%80%E1%85%A6%E1%84%8B%E1%85%B5%E1%86%B71_compressed_mfx0di.mp4',
    'https://res.cloudinary.com/dz3ocjmfw/video/upload/v1762574299/1_%E1%84%92%E1%85%A9%E1%86%B7%E1%84%92%E1%85%AA%E1%84%86%E1%85%A7%E1%86%AB_compressed_yujcnj.mp4',
    'https://res.cloudinary.com/dz3ocjmfw/video/upload/v1762574297/2_%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%90%E1%85%A5%E1%84%87%E1%85%B2_compressed_w6156w.mp4',
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