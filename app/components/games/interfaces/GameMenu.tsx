import { gamePortals } from "@/app/lib/data/positions/gamePortals";

export default function GameMenu({
  worldKey, gameKey, score
}: {
  worldKey: string;
  gameKey: string;
  score: number;
}) {
  const rule = gamePortals[worldKey].find(game => game.gameKey === gameKey)?.rule

  return (
    <div className="absolute top-0 left-0 w-screen h-screen pointer-events-none">
      <div className="absolute left-1/2 -translate-x-1/2 w-96 h-auto break-keep text-gray-700 flex flex-col gap-2 items-center pointer-events-auto mt-12 font-bold">
        <p>{score}점</p>
        <p>{rule ?? ''}</p>
      </div>
    </div>
  )
}