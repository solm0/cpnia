import { lineProp } from "@/app/lib/data/lines/mapNpcLines";

export default function GameMenu({
  worldKey, gameKey, score
}: {
  worldKey: string;
  gameKey: string;
  score: number;
}) {
  return (
    // 게임 룰?

    <div className="absolute top-0 left-0 w-screen h-screen pointer-events-none">
      <div className="absolute left-1/2 -translate-x-1/2 w-96 h-auto break-keep text-gray-700 flex flex-col gap-2 items-center pointer-events-auto mt-12 font-bold">
        <p>{score}점</p>
      </div>
    </div>
  )
}