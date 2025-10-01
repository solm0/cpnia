import { PizzaCutterLines } from "@/app/lib/data/pizzaCutterLine";
import Button from "../util/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStageStore } from "@/app/lib/state/SacrificeStageStore";

// TODO: 9개의 변주

export default function NpcLineModalMain({
  name, setActiveNpc, worldKey
}: {
  name: string;
  setActiveNpc: (name: string | null) => void;
  worldKey: string;
}) {
  const stage = useStageStore((s) => s.stage);
  const setStage = useStageStore((s) => s.setStage);

  const lines = PizzaCutterLines[stage] ?? '';
  const [index, setIndex] = useState(0);

  const router = useRouter();
  const gameKeymap: Record<number, string> = {
    0: 'game1',
    1: 'game2',
    2: 'game3',
  }

  console.log(stage)
  stage === 4 && setStage(0)

  return (
    <div className="flex flex-col gap-2 w-full items-center">
        <p className="z-10">{name} says:</p>
        <p className="z-10">{lines[index] ?? 'no npc line'}</p>

        {index+1 === lines.length ? (
          // 마지막 대사면
          <div className="flex gap-2 z-10">
            <Button
              onClick={() => {
                setStage(stage+1);
                if (stage === 2) {
                  // 세번째게임은 재료통으로 가서 직접 게임포탈을 찾아야됨.
                  //setStage도 게임에서 해야됨.
                  setActiveNpc(null)
                } else {
                  router.push(`/${worldKey}?game=${gameKeymap[stage]}`)
                }
              }}
              label="응"
            />
            <Button
              onClick={() => {
                if (stage === 3) {
                  setStage(9);
                }
                setActiveNpc(null)
              }}
              label="아니"
            />
          </div>
        ): (
          // 마지막 대사가 아니면
          <div className="flex gap-2 z-10">
            <Button
              onClick={() => setIndex(index+1)}
              label="다음"
            />
            <Button
              onClick={() => setActiveNpc(null)}
              label="닫기"
            />
          </div>
        )}
    </div>
  )
}