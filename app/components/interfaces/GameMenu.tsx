import { gameIcons } from "@/app/lib/data/gameIcons"
import Button from "../util/Button";
import { useRouter } from "next/navigation";
import GameNpc from "../models/GameNpc";
import { lineProp } from "@/app/lib/data/npc-default-lines";

export default function GameMenu({
  worldKey, gameKey, npcData
}: {
  worldKey: string;
  gameKey: string;
  npcData: Record<string, lineProp>;
}) {
  const gameName = gameIcons[worldKey].find(game => game.gameKey === gameKey)?.label;
  const router = useRouter();

  // 게임 상태 - 일시정지 버튼, 점수
  return (
    <div className="flex flex-col gap-2">
      <h1>{gameName}</h1>
      <p>점수: </p>
      <p>일시정지</p>
      <Button
        onClick={() => router.push(`/${worldKey}`)}
        label="월드로 돌아가기"
      />
      <GameNpc npcData={npcData} />
    </div>
  )
}