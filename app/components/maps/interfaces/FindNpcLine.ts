import { defaultNpcLines } from "@/app/lib/data/npc-default-lines";
import { useNpcConfigStore } from "@/app/lib/state/npcConfigState";

export default function FindNpcLine(name: string, worldKey: string){
  const npcConfig = useNpcConfigStore(state => state.npcConfig);
  
  const npcLines = defaultNpcLines[worldKey]?.['map']?.[name];
  if (!npcLines) return 'npc 데이터를 찾을 수 없습니다'

  const {formality, verbosity, warmth } = npcConfig;
  if (!formality || !verbosity || !warmth) return;

  return npcLines?.[formality]?.[verbosity]?.[warmth]?.[0]
    ?? 'npc 대사를 찾을 수 없습니다'
}