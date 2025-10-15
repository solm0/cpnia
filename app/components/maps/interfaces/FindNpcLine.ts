import { mapNpcLines } from "@/app/lib/data/lines/mapNpcLines";
import { useNpcConfigStore } from "@/app/lib/state/npcConfigState";
import { pizzaCutterLines } from "@/app/lib/data/lines/pizzaCutterLine";

export function FindNpcLine(name: string, worldKey: string ){
  const npcConfig = useNpcConfigStore(state => state.npcConfig);

  const {formality, verbosity, warmth } = npcConfig;
  if (!formality || !verbosity || !warmth) return ['npc 데이터를 찾을 수 없습니다'];

  const npcLines = mapNpcLines[worldKey]?.['map']?.[name];
  if (!npcLines) return ['npc 데이터를 찾을 수 없습니다'];

  return npcLines?.[formality]?.[verbosity]?.[warmth]
    ?? ['npc 대사를 찾을 수 없습니다']
}

export function FindPizzaCutterLine(stage: string) {
  const npcConfig = useNpcConfigStore(state => state.npcConfig);

  const {formality, verbosity, warmth } = npcConfig;
  if (!formality || !verbosity || !warmth) return [{ line: 'npc 데이터를 찾을 수 없습니다' }]

  const npcLines = pizzaCutterLines[stage];
  if (!npcLines) return [{ line: 'npc 데이터를 찾을 수 없습니다' }]

  // TODO
  return npcLines?.['해체']?.['평범']?.['친근한']
    ?? [{ line: 'npc 대사를 찾을 수 없습니다' }]
}