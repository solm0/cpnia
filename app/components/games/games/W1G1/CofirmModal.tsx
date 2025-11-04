import Button from "@/app/components/util/Button";
import { RefObject } from "react";

export function ConfirmModal({
  worldKey, setHasBet, motionPhase,
  bet, currentNum,
  num, turn,
  behavior, setModal,
  betChips,
}:{
  worldKey: string;
  bet: (num: number, turn: number) => void;
  currentNum: RefObject<number | null>;
  setHasBet: (hasBet: boolean) => void;
  motionPhase: RefObject<'idle' | 'pick' | 'bet' | 'npcFail' | 'npcWin'>;
  num: number;
  turn: number;
  behavior: string;
  setModal: (modal: string | null) => void;
  betChips: number;
}) {
  let label;
  switch (behavior) {
    case 'bet': label = `${num}개의 칩을 베팅합니다.`; break;
    case 'fold': label = `폴드합니다. 베팅된 칩 ${betChips}개는 상대의 것이 됩니다.`; break;
    case 'allIn': label = `칩이 부족하여 남은 칩 ${num}개를 올인합니다.`; break;
    default: label = 'behavior가 없습니다.'
  }
  
  return (
    <div className="gap-8 w-96 h-auto p-4 bg-yellow-600 text-white rounded-2xl font-bold flex flex-col items-center justify-center">
      <p className="text-7xl">!</p>
      <p>{label}</p>
      <div className="flex gap-2">
        <Button
          worldKey={worldKey}
          label="예"
          id='w1g1-6'
          onClick={() => {
            if (behavior === 'bet') {
              motionPhase.current = 'bet';
              setTimeout(() => {
                bet(num, turn);
                setHasBet(true);
              }, 1000)
            } else if (behavior === 'fold') {
              currentNum.current = 0;
              setHasBet(true);
            } else if (behavior === 'allIn') {
              motionPhase.current = 'bet'
              setTimeout(() => {
                bet(num, turn);
                setHasBet(true);
              }, 1000)
            }
          }}
          important={true}
        />
        <Button
          worldKey={worldKey}
          label="다시 고를래요"
          onClick={() => {
            setModal(null);
          }}
          id='w1g1-7'
        />
      </div>
    </div>
    
  )
}