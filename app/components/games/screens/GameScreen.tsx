// 게임 컴포넌트의 선택, 각 게임의 npc 데이터를 골라주는 컴포넌트

import { defaultNpcLines } from "@/app/lib/data/npc-default-lines";
import W1G1 from "../W1G1";
import W1G2 from "../W1G2";
import W1G3 from "../W1G3";
import W2G1 from "../W2G1";
import W2G2 from "../W2G2";
import W2G3 from "../W2G3";
import W3G1 from "../W3G1";
import W3G2 from "../W3G2";
import W3G3 from "../W3G3";
import Scene from "../../util/Scene";
import GameMenu from "../../interfaces/GameMenu";

export default function GameScreen({
  worldKey, gameKey, handleGameEnd
}: {
  worldKey: string;
  gameKey: string;
  handleGameEnd: (result: boolean) => void;
}) {
  type GameComponent = React.FC<{
    onGameEnd: (success: boolean) => void
  }>
  type GameEntry = {
    game: GameComponent;
    npcName: string;
  }
  const gameMap: Record<string, Record<string, GameEntry>> = {
    time: {
      game1: { game: W1G1, npcName: '베라' },
      game2: { game: W1G2, npcName: '조엘' },
      game3: { game: W1G3, npcName: '엘라' },
    },
    sacrifice: {
      game1: { game: W2G1, npcName: '엘리' },
      game2: { game: W2G2, npcName: '루루' },
      game3: { game: W2G3, npcName: '세라' },
    },
    entropy: {
      game1: { game: W3G1, npcName: '카일' },
      game2: { game: W3G2, npcName: '리나' },
      game3: { game: W3G3, npcName: '제드' },
    },
  };

  const SelectedGame = gameMap[worldKey]?.[gameKey].game;
  if (!SelectedGame) return <div>게임을 찾을 수 없습니다</div>
  
  const npcName = gameMap[worldKey]?.[gameKey].npcName;
  const npcLines = defaultNpcLines[worldKey]?.['game']?.[npcName];
  if (!npcName || !npcLines) return <div>npc 데이터를 찾을 수 없습니다</div>
  const npcData = { [npcName]: npcLines }

  return (
    <main className="w-full h-full">
      {/* 게임 */}
      <Scene>
        <SelectedGame onGameEnd={handleGameEnd} />
      </Scene>

      {/* 게임 대시보드 */}
      <GameMenu worldKey={worldKey} gameKey={gameKey} npcData={npcData} />
    </main>
  )
}