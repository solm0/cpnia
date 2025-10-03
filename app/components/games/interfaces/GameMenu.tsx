import { gamePortals } from "@/app/lib/data/positions/gamePortals"
import Button from "../../util/Button";
import { useRouter } from "next/navigation";
import GameNpc from "../GameNpc";
import { lineProp } from "@/app/lib/data/lines/mapNpcLines";

export default function GameMenu({
  worldKey, gameKey, npcData, score
}: {
  worldKey: string;
  gameKey: string;
  npcData: Record<string, lineProp>;
  score: number;
}) {
  const gameName = gamePortals[worldKey].find(game => game.gameKey === gameKey)?.label;
  const router = useRouter();

  // 게임 상태 - 일시정지 버튼
  function PauseGame() {
    console.log('game pause')
  }

  return (
    <div className="absolute top-0 left-0 w-screen h-screen pointer-events-none">
      <div className="absolute left-1/2 -translate-x-1/2 w-96 h-auto break-keep text-gray-700 flex flex-col gap-2 items-center text-sm pointer-events-auto mt-12">
        <h1>게임: {gameName}</h1>
        <p className="w-full">PlaceHolder 게임 성공 조건: 5점을 넘기고 종료 버튼을 누르세요.</p>
        <Button
          label="일시정지"
          onClick={PauseGame}
        />
        <Button
          onClick={() => router.push(`/${worldKey}`)}
          label="월드로 돌아가기"
        />
        <p>{score}점</p>
      </div>

      <GameNpc npcData={npcData} />
    </div>
  )
}