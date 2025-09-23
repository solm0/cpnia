import { defaultNpcLines } from "@/app/lib/data/npc-default-lines";
import { useNpcConfigStore } from "@/app/lib/state/npcConfigState";

export default function FindNpcLine({
  name, worldKey
}: {
  name: string;
  worldKey: string
}){
  const npcConfig = useNpcConfigStore(state => state.npcConfig);
  
  const npcLines = defaultNpcLines[worldKey]?.['map']?.[name];
  if (!npcLines) return <div>npc 데이터를 찾을 수 없습니다</div>

  const formality = npcConfig.formality;
  const verbosity = npcConfig.verbosity;
  const warmth = npcConfig.warmth;
  if (!formality || !verbosity || !warmth) return;

  return (
    <p>
      {npcLines?.[formality]?.[verbosity]?.[warmth]?.[0]
        ?? 'npc 대사를 찾을 수 없습니다'}
    </p>
  )
}