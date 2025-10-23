import { RefObject, useEffect, useState } from "react";
import { gameRefProp } from "../W1G1";
import Button from "@/app/components/util/Button";
import { useRouter } from "next/navigation";
import { BetInput } from "./BetInput";
import { Object3D } from "three";
import UiCoinPile from "./UiCoinPile";
import SmallScene from "@/app/components/util/SmallScene";
import CardTurn from "./CardTurn";

export default function Ui({
  hasPicked, pickCard, gameRef, turn, minNum,
  currentNum,
  onGameEnd,
  motionPhase, bet,
  npcWaitSec, coin, cards
}: {
  hasPicked: boolean;
  pickCard: () => void;
  gameRef: RefObject<gameRefProp[]>;
  turn: RefObject<number>;
  minNum: RefObject<number>;
  currentNum: RefObject<number | null>;
  onGameEnd: (success: boolean) => void;
  motionPhase: RefObject<'idle' | 'pick' | 'bet' | 'npcFail' | 'npcWin'>;
  bet: (num: number, turn: number) => void;
  npcWaitSec: number;
  coin: Object3D;
  cards: Record<number, Object3D>;
}) {
  const worldKey = 'time';
  const router = useRouter();

  const [hasBet, setHasBet] = useState(false);
  const [cardTurned, setCardTurned] = useState(false);

  useEffect(() => {
    currentNum.current = null;
    setHasBet(false);
    console.log('currentNum', currentNum.current, 'minNum', minNum.current, 'hasBet', hasBet);
  }, [turn.current]);

  // npc의 베팅
  function decideNpcBet() {
    const playerCard = gameRef.current[0].card;
    const npcCard = gameRef.current[1].card;
    if (!playerCard || !npcCard) return 0;

    let raise = 0;

    if (gameRef.current[1].leftChips < minNum.current) {
      return gameRef.current[1].leftChips;
    } else {
      if (playerCard === 10) return 0; // 폴드
      else if (playerCard >= 7) raise = 3 + Math.floor(Math.random() * 2);
      else if (playerCard >= 4) raise = 5 + Math.floor(Math.random() * 3);
      else raise = 8 + Math.floor(Math.random() * 3);
  
      if (minNum.current >= raise) return minNum.current;
      return raise + minNum.current;
    }
  }

  useEffect(() => {
    if (turn.current % 2 === 1 && !hasBet) {
      const timeout = setTimeout(() => {
        const npcNum = decideNpcBet();
        console.log('NPC decided to bet', npcNum);
  
        if (!hasBet) { // guard
          motionPhase.current = 'bet';
          setTimeout(() => {
            bet(npcNum, turn.current);
            console.log(npcNum)
            setHasBet(true);
          }, 1000)
        }
      }, npcWaitSec);
  
      return () => clearTimeout(timeout);
    }
  }, [hasBet, npcWaitSec]);

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
        <UiCoinPile
          coin={coin}
          count={gameRef.current[0].leftChips}
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
            <UiCoinPile
              coin={coin}
              count={gameRef.current[0].leftChips}
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
              coin={coin}
            />
          )
          // 상대 차례
        } else {
          return (
            <>
              <div>상대가 베팅 중입니다...</div>
              <UiCoinPile
                coin={coin}
                count={gameRef.current[0].leftChips}
              />
            </>
          )
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
            <UiCoinPile
              coin={coin}
              count={gameRef.current[0].leftChips}
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
                <UiCoinPile
                  coin={coin}
                  count={gameRef.current[0].leftChips}
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
                <UiCoinPile
                  coin={coin}
                  count={gameRef.current[0].leftChips}
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
                <p>결과를 확인하려면 카드를 클릭하세요.</p>

                {/* 카드 오픈 */}
                <div
                  className="w-96 h-50"
                  onClick={() => {
                    setCardTurned(true);
                    motionPhase.current = success ? 'npcFail' : 'npcWin';
                  }}
                  tabIndex={-1}
                >
                  <SmallScene>
                    <CardTurn cardTurned={cardTurned} object={cards[gameRef.current[0].card]} />
                    <directionalLight intensity={5} position={[0,5,5]} />
                  </SmallScene>
                </div>

                {cardTurned &&
                  <div className="flex flex-col gap-2 items-start">
                    <p>내 카드: {gameRef.current[0].card}</p>
                    <p>상대 카드: {gameRef.current[1].card}</p>
                    <p>{success ? '당신의 승리입니다.' : '상대의 승리입니다.'}</p>
                    <Button
                      label="확인"
                      onClick={() => onGameEnd(success)}
                      worldKey={worldKey}
                      autoFocus={true}
                    />
                  </div>
                }

                <UiCoinPile
                  coin={coin}
                  count={gameRef.current[0].leftChips}
                />
              </div>
            )
          } else {
            return (
              <div>
                <p>상대가 당신과 같은 갯수 {currentNum.current}를 베팅했습니다. 베팅을 종료합니다.</p>
                <p>결과를 확인하려면 카드를 클릭하세요.</p>

                {/* 카드 오픈 */}
                <div
                  className="w-96 h-50"
                  onClick={() => {
                    setCardTurned(true);
                    motionPhase.current = success ? 'npcFail' : 'npcWin';
                  }}
                >
                  <SmallScene>
                    <CardTurn cardTurned={cardTurned} object={cards[gameRef.current[0].card]} />
                    <directionalLight intensity={5} position={[0,5,5]} />
                  </SmallScene>
                </div>

                {cardTurned &&
                  <div className="flex flex-col gap-2 items-start">
                    <p>내 카드: {gameRef.current[0].card}</p>
                    <p>상대 카드: {gameRef.current[1].card}</p>
                    <p>{success ? '당신의 승리입니다.' : '상대의 승리입니다.'}</p>
                    <Button
                      label="확인"
                      onClick={() => onGameEnd(success)}
                      worldKey={worldKey}
                      autoFocus={true}
                    />
                  </div>
                }

                <UiCoinPile
                  coin={coin}
                  count={gameRef.current[0].leftChips}
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

              <UiCoinPile
                coin={coin}
                count={gameRef.current[0].leftChips}
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
                <UiCoinPile
                  coin={coin}
                  count={gameRef.current[0].leftChips}
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
                <UiCoinPile
                  coin={coin}
                  count={gameRef.current[0].leftChips}
                />
              </div>
            )
          } else {
            return (
              <div>
                <p>상대의 칩이 부족해 모든 칩 {currentNum.current}를 베팅했습니다.</p>
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
                <UiCoinPile
                  coin={coin}
                  count={gameRef.current[0].leftChips}
                />
              </div>
            )
          }
        }
      }
    }
  }
}