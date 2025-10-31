import { mapNpcLines } from "@/app/lib/data/lines/mapNpcLines";
import { useNpcConfigStore } from "@/app/lib/state/npcConfigState";
import { pizzaCutterLines } from "@/app/lib/data/lines/pizzaCutterLine";
import { fugitiveLines } from "@/app/lib/data/lines/fugitiveLine";
import { timeSpecialLines } from "@/app/lib/data/lines/timeSpecialLine";

export function FindNpcLine(name: string, worldKey: string ){
  const npcConfig = useNpcConfigStore(state => state.npcConfig);

  const {formality, verbosity, warmth } = npcConfig;
  if (!formality || !verbosity || !warmth) return ['npc 데이터를 찾을 수 없습니다 npcConfig없음'];

  const npcLines = mapNpcLines[worldKey]?.[name];
  if (!npcLines) return ['npc 데이터를 찾을 수 없습니다 npcLine없음'];

  // TODO
  if (name === "카드게임장에서 발견한 주민" || name ===  "파친코 위에서 발견한 주민") {
    return npcLines?.['해체']?.['평범']?.['친근한']
    ?? [{ line: 'npc 대사를 찾을 수 없습니다' }]
  } else {
    return npcLines?.[formality]?.[verbosity]?.[warmth]
      ?? ['npc 대사를 찾을 수 없습니다 ㄹㄹ']
  }
}

export function FindTimeSpecialLine(name: string) {
  const npcConfig = useNpcConfigStore(state => state.npcConfig);

  const {formality, verbosity, warmth } = npcConfig;
  if (!formality || !verbosity || !warmth) return [{ line: 'npc 데이터를 찾을 수 없습니다' }]

  const npcLines = timeSpecialLines[name];
  if (!npcLines) return [{ line: 'npc 데이터를 찾을 수 없습니다ㄹㅇㄹ' }]

  // TODO
  return npcLines?.['해체']?.['평범']?.['친근한']
    ?? [{ line: 'npc 대사를 찾을 수 없습니다' }]
}

export function FindPizzaCutterLine(stage: string) {
  const npcConfig = useNpcConfigStore(state => state.npcConfig);

  const {formality, verbosity, warmth } = npcConfig;
  if (!formality || !verbosity || !warmth) return [{ line: 'npc 데이터를 찾을 수 없습니다' }]

  const npcLines = pizzaCutterLines[stage];
  if (!npcLines) return [{ line: 'npc 데이터를 찾을 수 없습니다ㄹㅇㄹ' }]

  // TODO
  return npcLines?.['해체']?.['평범']?.['친근한']
    ?? [{ line: 'npc 대사를 찾을 수 없습니다' }]
}

export function FindFugitiveLine(round: number) {
  const npcConfig = useNpcConfigStore(state => state.npcConfig);

  const {formality, verbosity, warmth } = npcConfig;
  if (!formality || !verbosity || !warmth) return { line: 'npc 데이터를 찾을 수ㅇㄹㅇㄴ 없습니다', options: [
    { answer: '좋은답변', score: 5 },
    { answer: '보통답변', score: 2 },
    { answer: '나쁜답변', score: -2 }
  ] }

  const npcLines = fugitiveLines[round];
  if (!npcLines) return { line: 'npc 데이터를 찾을 수 ㄹㄹㄹ없습니다', options: [
    { answer: '좋은답변', score: 5 },
    { answer: '보통답변', score: 2 },
    { answer: '나쁜답변', score: -2 }
  ] }

  // TODO
  return npcLines?.['해체']?.['평범']?.['친근한']
    ?? [{ line: 'npc 대사를 찾을 수 없습니다' }]
}