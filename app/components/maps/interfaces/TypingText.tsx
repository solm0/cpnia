import { useEffect, useState } from "react";

export function TypingText({
  text,
  speed = 50, // ms per char
}: {
  text: string;
  speed?: number;
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    // 초기화
    setDisplayed("");
    setDone(false);
    if (!text) {
      setDone(true);
      return;
    }

    // 모든 timeout id를 모아두고 언마운트/텍스트 변경 시 클리어
    const timeouts: number[] = [];

    // 각 문자마다 i * speed 밀리초 뒤에 추가 (i=0이면 즉시(다음 tick)에 실행)
    for (let i = 0; i < text.length; i++) {
      const id = window.setTimeout(() => {
        setDisplayed((prev) => prev + text[i]);
      }, i * speed);
      timeouts.push(id);
    }

    // 타이핑 끝났을 때 커서 숨기기 등 처리
    const finishId = window.setTimeout(() => {
      setDone(true);
    }, text.length * speed);
    timeouts.push(finishId);

    return () => {
      timeouts.forEach(window.clearTimeout);
    };
  }, [text, speed]);

  return <span className="scale-x-50">{displayed}{!done && "▊"}</span>;
}