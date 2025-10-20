import { RefObject, useEffect, useState } from "react";
import { gameRefProp } from "../W1G1";
import Button from "@/app/components/util/Button";
import { useRouter } from "next/navigation";

function ConfirmModal({
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

function BetInput({
  minNum, gameRef, betChips, turn, worldKey,
  bet, currentNum, setHasBet, motionPhase,
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

export default function Ui({
  hasPicked, pickCard, gameRef, turn, minNum,
  currentNum,
  onGameEnd,
  motionPhase, bet,
  npcWaitSec,
}: {
  hasPicked: boolean;
  pickCard: () => void;
  gameRef: RefObject<gameRefProp[]>;
  turn: RefObject<number>;
  minNum: RefObject<number>;
  currentNum: RefObject<number | null>;
  onGameEnd: (success: boolean) => void;
  motionPhase: RefObject<'idle' | 'bet' | 'npcFail' | 'npcWin'>;
  bet: (num: number, turn: number) => void;
  npcWaitSec: number;
}) {
  const worldKey = 'time';
  const router = useRouter();

  // turn 바뀔때 재렌더링, 필요한 것 초기화
  const [, setVersion] = useState(0);

  const [hasBet, setHasBet] = useState(false);

  useEffect(() => {
    currentNum.current = null;
    setHasBet(false);
    console.log('currentNum', currentNum.current, 'minNum', minNum.current, 'hasBet', hasBet)

    const interval = setInterval(() => {
      if (turn.current !== null) {
        setVersion(v => v + 1);
      }
    }, 16);
    return () => clearInterval(interval);
  }, []);

  // npc의 베팅
  function decideNpcBet() {
    const playerCard = gameRef.current[0].card;
    const npcCard = gameRef.current[1].card;
    if (!playerCard || !npcCard) return 0;

    let raise = 0;
    if (playerCard === 10) return 0; // 폴드
    else if (playerCard >= 7) raise = 3 + Math.floor(Math.random() * 2);
    else if (playerCard >= 4) raise = 5 + Math.floor(Math.random() * 3);
    else raise = 8 + Math.floor(Math.random() * 3);

    if (minNum.current >= raise) return minNum.current;
    return raise + minNum.current;
  }

  useEffect(() => {
    if (turn.current % 2 === 1 && !hasBet) {
      const timeout = setTimeout(() => {
        const npcNum = decideNpcBet();
        console.log('NPC decided to bet', npcNum);
  
        bet(npcNum, turn.current);
        setHasBet(true);
        motionPhase.current = 'bet';
      }, npcWaitSec);
  
      return () => clearTimeout(timeout);
    }
  }, [turn.current, hasBet]);

  if (!hasPicked) {
    // --- 게임 시작 ---
    return (
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
          worldKey={worldKey}
          autoFocus={true}
        />
      </>
    )
  } else {
    // --- 턴 1/2: 베팅 전 ---
    if (!hasBet) {
      // 최초
      if (turn.current === 0) {
        return (
          <div>
            <p>모두 칩 하나씩 베팅합니다.</p>
            <Button
              worldKey={worldKey}
              onClick={() => {
                bet(1, turn.current);
                setHasBet(true);
                motionPhase.current = 'bet';
              }}
              label="확인"
              autoFocus={true}
            />
          </div>
        )
      } else {
        // 내차례
        if (turn.current % 2 === 0) {
          currentNum.current = null;

          return (
            <BetInput
              minNum={minNum.current}
              gameRef={gameRef}
              turn={turn.current}
              betChips={gameRef.current[0].betChips + gameRef.current[1].betChips}
              worldKey={worldKey}
              motionPhase={motionPhase}
              bet={bet}
              currentNum={currentNum}
              setHasBet={setHasBet}
            />
          )
          // 상대 차례
        } else {
          return <div>상대가 베팅 중입니다...</div>
        }
      }
      // --- 턴 2/2: 베팅 후 ---
    } else {
      if (currentNum.current === null || currentNum.current === undefined) return <p>베팅된 칩 몇갠지 찾을수없음</p>
      if (!gameRef.current[0].card || !gameRef.current[1].card) {
        return (
          <div>
            <p>엥.. npc랑 플레이어 중 한명의 카드가 없어졌다.</p>
            <p>아마 당신이 버그를 발견한듯. 어케한거..? 일단 축하함..</p>
            <Button
              label="월드로 돌아가기"
              onClick={() => router.push(`/${worldKey}`)}
              autoFocus={true}
              worldKey={worldKey}
            />
          </div>
        )
      }

      // 최초
      if (turn.current === 0) {
        return (
          <div>
            <p>잘했어요</p>
            <Button
              label="다음"
              onClick={() => {
                turn.current += 1;
                setHasBet(false);
                currentNum.current = null;
              }}
              worldKey={worldKey}
              autoFocus={true}
            />
          </div>
        )
      } else {
        // 1. 폴드
        if (currentNum.current === 0) {
          // 그게 나일경우
          if (turn.current % 2 === 0) {
            return (
              <div className="flex flex-col">
                <div>게임을 포기하셨습니다. 베팅한 돈을 전부 잃었습니다.</div>
                <Button
                  label="확인"
                  worldKey={worldKey}
                  onClick={() => {
                    onGameEnd(false);
                    motionPhase.current = 'npcWin'
                  }}
                />
              </div>
            )
            // 그게 상대일경우
          } else {
            return (
              <div className="flex flex-col">
                <div>상대가 게임을 포기했습니다. 테이블의 칩은 당신의 것</div>
                <Button
                  label="확인"
                  worldKey={worldKey}
                  onClick={() => {
                    onGameEnd(true);
                    motionPhase.current = 'npcFail'
                  }}
                />
              </div>
            )
          }
          // 2. 콜
        } else if (currentNum.current != null && currentNum.current === minNum.current) {
          const success = gameRef.current[1].card < gameRef.current[0].card;

          if (turn.current % 2 === 0) {
            return (
              <div>
                <p>상대와 같은 갯수 {currentNum.current}를 베팅했습니다. 베팅을 종료합니다.</p>
                <p>결과 확인하기:</p>

                {/* 카드 오픈 */}
                <p>내 카드: {gameRef.current[0].card}</p>
                <p>상대 카드: {gameRef.current[1].card}</p>
                {/* <SmallScene>
                  <Card
                  <Card
                </SmallScene> */}

                <p>{success ? '니가 이겼다' : '너 졌다'}</p>

                <Button
                  label="확인"
                  onClick={() => onGameEnd(success)}
                  worldKey={worldKey}
                  autoFocus={true}
                />
              </div>
            )
          } else {
            return (
              <div>
                <p>상대가 당신과 같은 갯수 {currentNum.current}를 베팅했습니다. 베팅을 종료합니다.</p>
                <p>결과 확인하기:</p>

                {/* 카드 오픈 */}
                <p>내 카드: {gameRef.current[0].card}</p>
                <p>상대 카드: {gameRef.current[1].card}</p>
                {/* <SmallScene>
                  <Card
                  <Card
                </SmallScene> */}

                <p>{success ? '니가 이겼다' : '너 졌다'}</p>

                <Button
                  label="확인"
                  onClick={() => onGameEnd(success)}
                  worldKey={worldKey}
                  autoFocus={true}
                />
              </div>
            )
          }
          // 3. 레이즈
        } else if (currentNum.current > minNum.current) {
          // 나
          if (turn.current % 2 === 0) {
            return (
              <div>
                <p>당신은 {currentNum.current}를 베팅했습니다.</p>
                <Button
                  autoFocus={true}
                  worldKey={worldKey}
                  label="확인"
                  onClick={() => {
                    turn.current += 1;
                    if (currentNum.current !== null && currentNum.current > minNum.current) {
                      minNum.current = currentNum.current;
                    }
                    setHasBet(false);
                  }}
                />
              </div>
            )
            // 상대
          } else {
            return (
              <div>
                <p>상대가 {currentNum.current}를 베팅했습니다.</p>
                <Button
                  autoFocus={true}
                  worldKey={worldKey}
                  label="확인"
                  onClick={() => {
                    turn.current += 1;
                    if (currentNum.current !== null && currentNum.current > minNum.current) {
                      minNum.current = currentNum.current;
                    }
                    setHasBet(false);
                  }}
                />
              </div>
            )
          }
        } else {
          console.log('올인', 'currentNum', currentNum.current, 'minNum', minNum);
          const success = gameRef.current[1].card < gameRef.current[0].card;

          if (turn.current % 2 === 0) {
            return (
              <div>
                <p>당신의 칩이 부족해 모든 칩 {currentNum.current}를 베팅했습니다.</p>
                <p>결과 확인하기:</p>
  
                  {/* 카드 오픈 */}
                  <p>내 카드: {gameRef.current[0].card}</p>
                  <p>상대 카드: {gameRef.current[1].card}</p>
                  {/* <SmallScene>
                    <Card
                    <Card
                  </SmallScene> */}
  
                  <p>{success ? '니가 이겼다' : '너 졌다'}</p>
  
                  <Button
                    label="확인"
                    onClick={() => onGameEnd(success)}
                    worldKey={worldKey}
                    autoFocus={true}
                  />
              </div>
            )
          } else {
            return (
              <div>
                <p>상대의 칩이 부족해 모든 칩 {currentNum.current}를 베팅했습니다.</p>
                <Button
                  autoFocus={true}
                  worldKey={worldKey}
                  label="확인"
                  onClick={() => {
                    turn.current += 1;
                    if (currentNum.current !== null && currentNum.current > minNum.current) {
                      minNum.current = currentNum.current;
                    }
                    setHasBet(false);
                  }}
                />
              </div>
            )
          }
        }
      }
    }
  }
}