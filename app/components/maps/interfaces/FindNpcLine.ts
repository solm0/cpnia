import { mapNpcLines } from "@/app/lib/data/lines/mapNpcLines";
import { useNpcConfigStore } from "@/app/lib/state/npcConfigState";

export default function FindNpcLine(name: string, worldKey: string){
  const npcConfig = useNpcConfigStore(state => state.npcConfig);
  
  const npcLines = mapNpcLines[worldKey]?.['map']?.[name];
  if (!npcLines) return ['npc 데이터를 찾을 수 없습니다']

  const {formality, verbosity, warmth } = npcConfig;
  if (!formality || !verbosity || !warmth) return ['npc 데이터를 찾을 수 없습니다'];

  return npcLines?.[formality]?.[verbosity]?.[warmth]
    ?? ['npc 대사를 찾을 수 없습니다']
}