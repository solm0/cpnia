import { RefObject, useState } from "react";
import { gameRefProp } from "../W1G1";
import { ConfirmModal } from "./CofirmModal";
import Button from "@/app/components/util/Button";
import UiCoinPile from "./UiCoinPile";
import { Object3D } from "three";

export function BetInput({
  minNum, gameRef, betChips, turn, worldKey,
  bet, currentNum, setHasBet, motionPhase,
  coin,
}: {
  minNum: number;
  gameRef: RefObject<gameRefProp[]>;
  turn: number;
  betChips: number;
  worldKey: string;
  motionPhase: RefObject<'idle' | 'bet' | 'npcFail' | 'npcWin'>;
  bet: (num: number, turn: number) => void;
  currentNum: RefObject<number | null>;
  setHasBet: (hasBet: boolean) => void;
  coin: Object3D;
}) {
  const [num, setNum] = useState(minNum);
  const [modal, setModal] = useState<string | null>(null);
  const lack = gameRef.current[0].leftChips < minNum;

  if (lack) {
    setNum(gameRef.current[0].leftChips);

    return (
      <ConfirmModal
        worldKey={worldKey}
        setHasBet={setHasBet}
        motionPhase={motionPhase}
        bet={bet}
        currentNum={currentNum}
        num={num}
        turn={turn}
        behavior={'allIn'}
        setModal={setModal}
        betChips={betChips}
      />
    )
  } else {
    return (
      <>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <span>콜: 상대방과 같은 양을 베팅합니다. 카드를 오픈해 승자를 가릅니다.</span>
            <span>레이즈: 상대방보다 올려 베팅합니다. 베팅을 지속합니다.</span>
            <span>폴드: 게임을 포기합니다. 베팅된 칩 {betChips}개는 상대의 것이 됩니다.</span>
          </div>
  
          <div className="flex flex-col gap-2">
            <span>남은 칩: {gameRef.current[turn % 2].leftChips}개</span>
            <span>베팅할 경우 남은 칩: {gameRef.current[turn % 2].leftChips - num}개</span>
            <span>베팅한 칩: {gameRef.current[turn % 2].betChips}개</span>
            <div>최소 베팅가능 칩 갯수: {minNum}</div>
          </div>
  
          {turn % 2 === 0 && (
            // 인풋
            <div className="flex flex-col gap-2">
              <div>내가 베팅할 칩 갯수: {num}</div>
              <div className="flex gap-2">
                <Button
                  label="+"
                  onClick={() => {
                    if (num < gameRef.current[0].leftChips) {
                      setNum(prev => prev + 1);
                    }
                  }}
                  disabled={num >= gameRef.current[0].leftChips ? true : false}
                  worldKey={worldKey}
                />
                <Button
                  label="-"
                  onClick={() => {
                    if (num > minNum) {
                      setNum(prev => prev - 1);
                    }
                  }}
                  disabled={num <= minNum ? true : false}
                  worldKey={worldKey}
                />
                <Button
                  label="올인"
                  onClick={() => setNum(gameRef.current[0].leftChips)}
                  worldKey={worldKey}
                />
              </div>
  
              <div className="flex gap-2">
                <Button
                  label="베팅"
                  worldKey={worldKey}
                  autoFocus={true}
                  onClick={() => setModal('bet')}
                />
                <Button
                  label="폴드"
                  worldKey={worldKey}
                  autoFocus={true}
                  onClick={() => setModal('fold')}
                />
              </div>
            </div>
          )}

          <UiCoinPile
            coin={coin}
            count={gameRef.current[0].leftChips}
            tmpCount={num}
          />
        </div>
  
        {modal &&
          <ConfirmModal
            worldKey={worldKey}
            setHasBet={setHasBet}
            motionPhase={motionPhase}
            bet={bet}
            currentNum={currentNum}
            num={num}
            turn={turn}
            behavior={modal}
            setModal={setModal}
            betChips={betChips}
          />
        }
      </>
    )
  }
}