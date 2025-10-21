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
  motionPhase: RefObject<'idle' | 'bet' | 'npcFail' | 'npcWin'>;
  num: number;
  turn: number;
  behavior: string;
  setModal: (modal: string | null) => void;
  betChips: number;
}) {
  let label;
  switch (behavior) {
    case 'bet': label = `${num}개의 칩을 베팅합니다.`; break;
    case 'fold': label = `폴드합니다. 베팅된 칩 ${betChips} 개는 상대의 것이 됩니다.`; break;
    case 'allIn': label = `칩이 부족하여 남은 칩 ${num}을 올인합니다`; break;
    default: label = 'behavior가 없습니다.'
  }
  
  return (
    <div className="absolute top-0 left-0 w-96 h-52 -translate-x-1/2 -translate-y-1/2 backdrop-blur-2xl flex flex-col gap-8 items-center justify-center">
      <p>{label}</p>
      <div className="flex gap-2">
        <Button
          worldKey={worldKey}
          label="예"
          autoFocus={true}
          onClick={() => {
            if (behavior === 'bet') {
              bet(num, turn); // minNum, currentNum 업데이트
              setHasBet(true); // ui 업데이트
              motionPhase.current = 'bet'; // 모션 flag
            } else if (behavior === 'fold') {
              currentNum.current = 0;
              setHasBet(true);
            } else if (behavior === 'allIn') {
              bet(num, turn);
              setHasBet(true);
              motionPhase.current = 'bet'
            }
          }}
        />
        <Button
          worldKey={worldKey}
          label="다시고를래요"
          onClick={() => {
            setModal(null);
          }}
        />
      </div>
    </div>
  )
}