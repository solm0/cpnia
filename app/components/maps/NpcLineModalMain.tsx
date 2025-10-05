import { useNpcConfigStore } from "@/app/lib/state/npcConfigState";
import { useGameStore } from "@/app/lib/state/gameState";
import { PizzaCutterLineModal } from "./interfaces/NpcLineModals";

export default function NpcLineModalMain({
  name, setActiveNpc, worldKey
}: {
  name: string;
  setActiveNpc: (name: string | null) => void;
  worldKey: string;
}) {
  const gameState = useGameStore(state => state.worlds[worldKey].games)
  
  const { formality, verbosity, warmth } = useNpcConfigStore(state => state.npcConfig);
  if (!formality || !verbosity || !warmth) return;

  let stage;
  if (gameState['game1'] === false) {
    stage = 'game1';
  } else if (gameState['game2'] === false) {
    stage = 'game2'
  } else if (gameState['game3'] === false) {
    stage = 'game3'
  }
  if (!stage) return;

  return (
    <PizzaCutterLineModal
      name={name}
      setActiveNpc={setActiveNpc}
      stage={stage}
    />
  )
}