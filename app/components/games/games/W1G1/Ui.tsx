import { RefObject } from "react";
import { gameRefProp } from "../W1G1";
import Button from "@/app/components/util/Button";

export default function Ui({
  hasPicked, pickCard, gameRef, turn, lastBetChipNum, currentNum
}: {
  hasPicked: boolean;
  pickCard: () => void;
  gameRef: RefObject<gameRefProp[]>;
  turn: RefObject<number>;
  lastBetChipNum: RefObject<number>;
  currentNum: RefObject<number>;
}) {

  return (
    <div className="flex flex-col items-center justify-center gap-2 h-screen bg-[#00000007] pointer-events-none absolute right-0 top-0 w-1/2">
      {!hasPicked ?
        <>
          <div className="flex flex-col gap-8">
            <p>인디언포커 설명:</p>
            <p>자기카드는 못보고 상대카드만 볼수있어요</p>
            <p>베팅이 끝나고 카드를 깠을때 높은숫자인 사람이 칩을 다 가져가요</p>
            <p>당신의 카드가 상대보다 높은 것 같나요? 그럼 상대가 계속 베팅하도록 긴장한 척 연기하세요.</p>
            <p>상대 카드가 당신보다 높은 것 같나요? 그럼 상대가 포기하도록 자신만만한 척 연기하세요.</p>
            <p>준비 되셨나요?</p>
          </div>
          <Button
            label="카드 뽑기"
            onClick={pickCard}
            worldKey='time'
            autoFocus={true}
          />
        </>
        :
        <>
          <div>{turn.current % 2 === 0 ? '내차례' : '쟤 차례'}</div>
          <div>턴: {turn.current}</div>
          <span>남은 칩: {gameRef.current[turn.current % 2].leftChips}개</span>
          <span>베팅한 칩: {gameRef.current[turn.current % 2].betChips}개</span>
          <div>최소 베팅가능 칩 갯수: {lastBetChipNum.current}</div>
          {turn.current % 2 === 0 && (
            // 인풋
            <div>
              <div>내가 베팅할 칩 갯수: {currentNum.current}</div>
              <div>+</div>
              <div>-</div>
              <div>확인</div>
            </div>
          )}
        </>
      }
    </div>
  )
}