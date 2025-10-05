import { gamePortals } from "@/app/lib/data/positions/gamePortals"
import { useGameStore } from "@/app/lib/state/gameState";
import Button from "../../util/Button";

export function QuestList({
  worldKey, gameKey, index,
}: {
  worldKey: string; gameKey: string, index: number
}) {
  const completed = useGameStore(state => state.worlds[worldKey].games[gameKey]);
  const gameName = gamePortals[worldKey].find(game => game.gameKey === gameKey)?.gameName

  return (
    <div className="flex gap-1">
      <span>{index}.</span>
      <span className={`${completed ? 'line-through' : 'decoration-0'}`}>{gameName}</span>
      {completed && '✅'}
    </div>
  )
}

export function GameStateModal({
  worldKey
}: {
  worldKey: string;
}){
  const reset = useGameStore(state => state.reset);
  const isThereSomethingToDelete = useGameStore(state => Object.values(state.worlds[worldKey].games).some(Boolean));

  switch (worldKey) {
    case 'time':
      return (
        <div className="w-auto h-auto flex flex-col items-start gap-2 backdrop-blur-sm border-3 border-[#ffffff70] p-4">
          <div className="absolute top-0 left-0 -z-10 w-full h-full bg-[#00000090] border-3 border-[#ffffff] blur-sm" />
          <h3>퀘스트 진행도</h3>
          {gamePortals[worldKey].map((game, index) => (
            <QuestList key={index} index={index} gameKey={game.gameKey} worldKey={worldKey} />
          ))}
          {isThereSomethingToDelete &&
            <Button
              worldKey={worldKey}
              onClick={() => reset()}
              label="진행 상황 지우기"
            />
          }
        </div>
      )
    case 'sacrifice':
      return (
        <div className="w-auto h-auto flex flex-col items-start gap-2 rounded-4xl backdrop-blur-sm font-bold z-0 p-4">
          <div className="absolute top-0 left-0 -z-10 w-full h-full bg-[#ae4bff95] blur-sm rounded-4xl mix-blend-darken" />

          <h3>퀘스트 진행도</h3>
          {gamePortals[worldKey].map((game, index) => (
            <QuestList key={index} index={index+1} gameKey={game.gameKey} worldKey={worldKey} />
          ))}
          {isThereSomethingToDelete &&
            <Button
              worldKey={worldKey}
              onClick={() => reset()}
              label="진행 상황 지우기"
            />
          }
        </div>
      )
    case 'entropy':
      return (
        <div className="w-auto h-auto flex flex-col items-start gap-2 backdrop-blur-sm border-3 border-[#ffffff70] p-4">
          <div className="absolute top-0 left-0 -z-10 w-full h-full bg-[#00000090] border-3 border-[#ffffff] blur-sm" />
          <h3>퀘스트 진행도</h3>
          {gamePortals[worldKey].map((game, index) => (
            <QuestList key={index} index={index} gameKey={game.gameKey} worldKey={worldKey} />
          ))}
          {isThereSomethingToDelete &&
            <Button
              worldKey={worldKey}
              onClick={() => reset()}
              label="진행 상황 지우기"
            />
          }
        </div>
      )
  }
}