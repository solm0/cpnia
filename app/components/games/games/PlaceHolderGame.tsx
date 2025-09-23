import { Html } from "@react-three/drei";
import { useState } from "react";
import Button from "../../util/Button";

export default function PlaceHolderGame({
  onGameEnd
}: {
  onGameEnd: (success: boolean) => void;
}) {
  const [click, setClick] = useState(0);

  return (
    <Html className="absolute left-1/2 -translate-x-1/2 w-96 break-keep text-gray-700 flex flex-col gap-2 items-center text-sm">
      <p className="w-full">PlaceHolder 게임 성공 조건: 5점을 넘기고 종료 버튼을 누르세요.</p>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setClick(click + 1)}
          label="클릭!"
        />
        <p>{click}점</p>
      </div>
      <button
        onClick={() => {
          const success = click >= 5;
          onGameEnd(success)
        }}
        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
      >
        게임 종료
      </button>
    </Html>
  )
}