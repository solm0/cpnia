import { RefObject, useEffect, useState } from "react";
import { Color } from "three";

export default function Health({
  healthRef
}: {
  healthRef: RefObject<number>;
}) {
  const [, setVersion] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (healthRef.current !== null) {
        setVersion(v => v + 1);
      }
    }, 16); // 60fps
    return () => clearInterval(interval);
  }, []);

  const color = new Color();
  const ratio = Math.min(healthRef.current / 10, 1);

  const barColor = color
    .setHex(0xff3333)
    .lerp(new Color(0x33ff66), ratio)
    .getStyle();

  return (
    <>
      <div className="absolute top-8 left-8 w-72 h-10 border-2 border-white rounded-full bg-white overflow-hidden">
        <div
          style={{
            width: `${ratio * 100}%`,
            height: "100%",
            background: barColor,
            transition: "width 0.1s linear, background 0.1s linear",
          }}
        />
      </div>
      <div className="absolute top-22 left-8 bg-white p-2 text-black">키보드 조작: WASD로 xz축 이동, 위아래 방향키로 y축 이동</div>
    </>
  )
}