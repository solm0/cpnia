import { Html } from "@react-three/drei";
import { Color } from "three";

export default function CoreLabel({
  label,
  maxClicks = 20,
}: {
  label: {
    id: number;
    leftClicks: number;
    position: { x: number; y: number; z: number };
    isVisible: boolean;
  };
  maxClicks?: number;
}) {
  const color = new Color();
  const ratio = Math.min(label.leftClicks / maxClicks, 1);

  // 색상 보간 (초록 → 빨강)
  const barColor = color
    .setHex(0xff3333)
    .lerp(new Color(0x33ff66), ratio)
    .getStyle(); // CSS용 색상 문자열

  return (
    <Html
      position={[label.position.x, label.position.y + 2, label.position.z]}
      center
      style={{
        display: label.isVisible ? "block" : "none",
        width: "100px",
        height: "20px",
        border: "2px solid white",
        borderRadius: "10px",
        background: "rgba(0,0,0,0.5)",
        overflow: "hidden",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        style={{
          width: `${ratio * 100}%`,
          height: "100%",
          background: barColor,
          transition: "width 0.1s linear, background 0.1s linear",
        }}
      />
    </Html>
  );
}