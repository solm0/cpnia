import { RefObject, useState } from "react";
import { gameRefProp } from "../W1G1";
import { ConfirmModal } from "./CofirmModal";
import Button from "@/app/components/util/Button";
import UiCoinPile from "./UiCoinPile";
import { Object3D } from "three";
import { Box } from "./Ui";

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
  motionPhase: RefObject<'idle' | 'pick' | 'bet' | 'npcFail' | 'npcWin'>;
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
        <Box line={`내가 베팅한 ${minNum}개만큼, 또는 더 올려서 베팅할 수 있어. 단, 올리지 않는다면 게임을 종료하고 카드를 오픈하게 되지.`} bubble={true}>
          <></>
        </Box>

        <div className="flex flex-col gap-10 p-4 bg-neutral-800 text-white rounded-2xl font-bold">
          <span>{num}개 베팅할 경우 칩 {gameRef.current[turn % 2].leftChips - num}개 남음</span>

          {turn % 2 === 0 && (
            // 인풋
            <div className="flex flex-col gap-4 items-center">
              <div className="flex gap-2 items-center">
                <Button
                  label="-"
                  onClick={() => {
                    if (num > minNum) {
                      setNum(prev => prev - 1);
                    }
                  }}
                  disabled={num <= minNum ? true : false}
                  worldKey={worldKey}
                  id='w1g1-1'
                />
                <div className="p-4">{num}</div>
                <Button
                  label="+"
                  onClick={() => {
                    if (num < gameRef.current[0].leftChips) {
                      setNum(prev => prev + 1);
                    }
                  }}
                  disabled={num >= gameRef.current[0].leftChips ? true : false}
                  worldKey={worldKey}
                  id='w1g1-2'
                  />
              </div>
  
              <Button
                label="베팅하기"
                worldKey={worldKey}
                id='w1g1-3'
                onClick={() => setModal('bet')}
                important={true}
              />

              <div className="flex gap-2">
                <Button
                  label="올인"
                  onClick={() => setNum(gameRef.current[0].leftChips)}
                  worldKey={worldKey}
                  id='w1g1-4'
                />
                <Button
                  label="폴드"
                  worldKey={worldKey}
                  onClick={() => setModal('fold')}
                  id='w1g1-5'
                />
              </div>
            </div>
          )}

          <UiCoinPile
            coin={coin}
            count={gameRef.current[0].leftChips}
            tmpCount={gameRef.current[0].leftChips - num}
          />
          <UiCoinPile
            coin={coin}
            count={gameRef.current[0].leftChips}
            tmpCount={num}
            x={1.3}
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