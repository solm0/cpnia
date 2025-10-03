import Model from "../util/Model";
import SmallScene from "../util/SmallScene";
import { useNpcConfigStore } from "@/app/lib/state/npcConfigState";
import { lineProp } from "@/app/lib/data/lines/mapNpcLines";

export default function GameNpc({
  npcData
}: {
  npcData: Record<string, lineProp>;
}) {
  const npcName = Object.keys(npcData)[0];

  const npcConfig = useNpcConfigStore(state => state.npcConfig);
  const formality = npcConfig.formality;
  const verbosity = npcConfig.verbosity;
  const warmth = npcConfig.warmth;
  if (!formality || !verbosity || !warmth) return;

  const npcLine = npcData[npcName]?.[formality]?.[verbosity]?.[warmth]?.[0]
    ?? 'npc 대사를 찾을 수 없습니다';

  
  return (
    <div className="absolute left-0 bottom-0 w-full h-52 z-10 flex gap-2 items-center p-4">
      <div className="w-52">
        <SmallScene>
          <Model
            src="/models/avatar.glb"
            scale={3.6}
            position={[0, -0.9, 0]}
            rotation={[0, Math.PI, 0]}
          />
        </SmallScene>
      </div>
      <div className="text-sm text-gray-700 break-keep flex flex-col gap-2 max-w-[40rem]">
        <p>{npcName} says:</p>
        <p>{npcLine}</p>
      </div>
    </div>
  )
}