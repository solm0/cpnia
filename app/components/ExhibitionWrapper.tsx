"use client";
import { useEffect, useRef, useState } from "react";

export default function ExhibitionWrapper({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const videos = [
    '/video/video1.mp4',
    '/video/video2.mp4',
    '/video/video3.mp4',
    '/video/video4.mp4',
    '/video/video5.mp4',
    '/video/video6.mp4',
    '/video/video7.mp4',
    '/video/video8.mp4',
    '/video/video9.mp4',
    '/video/video10.mp4',
    '/video/video11.mp4',
    '/video/video12.mp4',
    '/video/video13.mp4',
  ];

  const [currentVideo, setCurrentVideo] = useState(videos[0]);

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

  // 비디오 끝나면 다음 영상 재생
  const handleVideoEnd = () => {
    const nextVideo = getRandomVideo(currentVideo);
    setCurrentVideo(nextVideo);
    // 새 src로 바꾸고 play 호출
    if (videoRef.current) {
      videoRef.current.src = nextVideo;
      setTimeout(() => {
        videoRef.current?.play().catch(() => {
          // 브라우저 자동재생 정책으로 play가 실패할 수 있음
          console.log("비디오 자동재생 실패, muted 확인 필요");
        });
      }, 50);
    }
  };

  console.log(videoRef.current?.muted, videoRef.current?.paused);

  return (
    <>
      {!active ? (
        <div className="bg-black flex items-center justify-center">
          <video
            onCanPlayThrough={() => videoRef.current?.play()}
            ref={videoRef}
            src={currentVideo}
            autoPlay
            loop={false}
            muted={true}
            playsInline
            preload="auto"
            disablePictureInPicture
            controls={false}
            className="w-90vw h-auto"
            style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
            onEnded={handleVideoEnd}
          />
        </div>
      ) : (
        children
      )}
    </>
  );
}