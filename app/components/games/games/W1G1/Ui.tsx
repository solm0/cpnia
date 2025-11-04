import { ReactNode, RefObject, useEffect, useState } from "react";
import { gameRefProp } from "../W1G1";
import Button from "@/app/components/util/Button";
import { useRouter } from "next/navigation";
import { BetInput } from "./BetInput";
import { Object3D } from "three";
import UiCoinPile from "./UiCoinPile";
import SmallScene from "@/app/components/util/SmallScene";
import CardTurn from "./CardTurn";

export function Box({
  line, children, bubble = false
}: {
  line: string;
  children: ReactNode;
  bubble?: boolean;
}) {
  return (
    <div className="absolute top-30 flex flex-col gap-8 w-96 bg-white rounded-2xl p-4 shadow-2xl items-start ">
      {bubble &&
        <div className="absolute top-8 left-0 border-solid border-l-white border-l-40 border-y-transparent border-y-16 border-r-0 rotate-180 -translate-x-8"/>
      }
      <p className="font-bold break-keep">{line}</p>
      {children}
    </div>
  )
}

function Introduction({
  pickCard, 
}: {
  pickCard: () => void;
}) {
  const lines = [
    ['On Time 퀘스트 1', '인디언포커 한 판을 이겨라!'],
    ['규칙 설명을 해주지!'],
    ['카드를 한 장씩 뽑을거야. 자기 카드는 못 보고 상대 카드만 볼 수 있어.'],
    ['그 후 돌아가면서 베팅을 할거야. 나중에 카드를 깠을때 숫자가 더 높은 사람이 베팅된 칩을 다 가져가.'],
    ['네 카드가 상대보다 높은 것 같다면, 상대가 계속 베팅하도록 긴장한 척 연기해야 해.', '반대로 상대 카드가 당신보다 높은 것 같다면 상대가 포기하도록 자신만만한 척 연기해.'],
    ['쉽지? 이제 시작하자. 카드를 한 장 뽑아.'],
  ]
  const [index, setIndex] = useState(0);
  return (
    <div className="absolute top-30 flex flex-col gap-8 w-96 bg-white rounded-2xl p-4 shadow-2xl">
      {index !== 0 &&
        <div className="absolute top-8 left-0 border-solid border-l-white border-l-40 border-y-transparent border-y-16 border-r-0 rotate-180 -translate-x-8"/>
      }
      {index === 0 ?
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-col gap-2">
            {lines[index].map((line, i) =>
              <p className={`${i === 0 && 'font-bold'}`} key={line}>{line}</p>
            )}
          </div>
          <Button
            label="시작"
            onClick={() => setIndex(prev => prev+1)}
            worldKey='time'
            id='w1g1-1'
            important={true}
          />
        </div>
        :
        <div className="flex flex-col gap-4 items-start">
          {lines[index].map(line => 
            <p key={line} className="break-keep font-bold leading-7">{line}</p>
          )}
          {index === lines.length-1 ?
            <Button
              label="카드 뽑기"
              onClick={pickCard}
              worldKey='time'
              id='w1g1-1'
              important={true}
            />
          :
            <Button
              label="다음"
              onClick={() => setIndex(prev => prev+1)}
              worldKey='time'
              id='w1g1-1'
              important={true}
            />
          }
        </div>
      }
    </div>
  )
}

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
        <Introduction pickCard={pickCard} />
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
          <>
            <Box line="카드를 뽑아 각자 이마에 붙였습니다. 이제 모두 칩을 하나씩 베팅합니다.">
              <Button
                worldKey={worldKey}
                onClick={() => {
                  bet(1, turn.current);
                  setHasBet(true);
                  motionPhase.current = 'bet';
                }}
                label="베팅하기"
                id='w1g1-1'
                important={true}
              />
            </Box>
            <UiCoinPile
              coin={coin}
              count={gameRef.current[0].leftChips}
            />
          </>
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
              <Box line="상대가 베팅 중입니다...">
                <></>
              </Box>
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
              id='w1g1-1'
              worldKey={worldKey}
            />
          </div>
        )
      }

      // 최초
      if (turn.current === 0) {
        return (
          <>
            <Box line="잘했어. 이어서 내가 먼저 베팅할게." bubble={true}>
              <Button
                label="그러든가"
                onClick={() => {
                  turn.current += 1;
                  setHasBet(false);
                  currentNum.current = null;
                }}
                worldKey={worldKey}
                id='w1g1-1'
                important={true}
              />
            </Box>
            <UiCoinPile
              coin={coin}
              count={gameRef.current[0].leftChips}
            />
          </>
        )
      } else {
        // 1. 폴드
        if (currentNum.current === 0) {
          // 그게 나일경우
          if (turn.current % 2 === 0) {
            return (
              <>
                <Box line="게임을 포기하셨습니다. 베팅한 돈을 전부 잃었습니다.">
                  <Button
                    label="확인"
                    worldKey={worldKey}
                    onClick={() => {
                      onGameEnd(false);
                      motionPhase.current = 'npcWin'
                    }}
                    id={'tempId'}
                  />
                </Box>
                <UiCoinPile
                  coin={coin}
                  count={gameRef.current[0].leftChips}
                />
              </>
            )
            // 그게 상대일경우
          } else {
            return (
              <>
                <Box line="상대가 게임을 포기했습니다. 테이블의 칩은 당신의 것">
                  <Button
                    label="확인"
                    worldKey={worldKey}
                    onClick={() => {
                      onGameEnd(true);
                      motionPhase.current = 'npcFail'
                    }}
                    id='w1g1-1'
                  />
                </Box>
                <UiCoinPile
                  coin={coin}
                  count={gameRef.current[0].leftChips}
                />
              </>
            )
          }
          // 2. 콜
        } else if (currentNum.current != null && currentNum.current === minNum.current) {
          const success = gameRef.current[1].card < gameRef.current[0].card;

          if (turn.current % 2 === 0) {
            return (
              <>
                <Box line={`상대와 같은 갯수의 칩 ${currentNum.current}개를 베팅했습니다. 베팅을 종료합니다. 과연 당신의 숫자는 무엇이었을까요?`}>
                  <Button
                    label="내 카드 오픈"
                    id='w1g1-1'
                    important={true}
                    onClick={() => {
                      setCardTurned(true);
                      motionPhase.current = success ? 'npcFail' : 'npcWin';
                    }}
                  />
                  <div className="w-full h-50">
                    <SmallScene>
                      <CardTurn cardTurned={cardTurned} object={cards[gameRef.current[0].card]} />
                      <directionalLight intensity={5} position={[0,5,5]} />
                    </SmallScene>
                  </div>
                  {cardTurned &&
                    <div className="flex flex-col gap-4 items-start">
                      <p className="font-bold break-keep">{success ? '상대의 카드보다 큰 숫자이군요. 당신의 승리입니다!' : '상대의 카드보다 작군요. 상대의 승리입니다.'}</p>
                      <Button
                        label="확인"
                        onClick={() => onGameEnd(success)}
                        worldKey={worldKey}
                        id='w1g1-2'
                        important={true}
                      />
                    </div>
                  }
                </Box>
                <UiCoinPile
                  coin={coin}
                  count={gameRef.current[0].leftChips}
                />
              </>
            )
          } else {
            return (
              <>
                <Box line={`상대가 당신과 같은 갯수의 칩 ${currentNum.current}개를 베팅했습니다. 베팅을 종료합니다. 과연 당신의 숫자는 무엇이었을까요?`}>
                  <Button
                    label="내 카드 오픈"
                    id='w1g1-1'
                    important={true}
                    onClick={() => {
                      setCardTurned(true);
                      motionPhase.current = success ? 'npcFail' : 'npcWin';
                    }}
                  />
                  <div className="w-full h-50">
                    <SmallScene>
                      <CardTurn cardTurned={cardTurned} object={cards[gameRef.current[0].card]} />
                      <directionalLight intensity={5} position={[0,5,5]} />
                    </SmallScene>
                  </div>
                  {cardTurned &&
                    <div className="flex flex-col gap-4 items-start">
                      <p className="font-bold break-keep">{success ? '상대의 카드보다 큰 숫자이군요. 당신의 승리입니다!' : '상대의 카드보다 작군요. 상대의 승리입니다.'}</p>
                      <Button
                        label="확인"
                        onClick={() => onGameEnd(success)}
                        worldKey={worldKey}
                        id='w1g1-2'
                        important={true}
                      />
                    </div>
                  }
                </Box>

                <UiCoinPile
                  coin={coin}
                  count={gameRef.current[0].leftChips}
                />
              </>
            )
          }
          // 3. 레이즈
        } else if (currentNum.current > minNum.current) {
          // 나
          if (turn.current % 2 === 0) {
            return (
              <>
                <Box line={`당신은 칩 ${currentNum.current}개를 베팅했습니다.`}>
                  <Button
                    id='w1g1-1'
                    worldKey={worldKey}
                    label="확인"
                    onClick={() => {
                      turn.current += 1;
                      if (currentNum.current !== null && currentNum.current > minNum.current) {
                        minNum.current = currentNum.current;
                      }
                      setHasBet(false);
                    }}
                    important={true}
                  />
                </Box>
                <UiCoinPile
                  coin={coin}
                  count={gameRef.current[0].leftChips}
                />
              </>
            )
            // 상대
          } else {
            return (
              <>
                <Box line={`상대가 칩 ${currentNum.current}개를 베팅했습니다.`}>
                  <Button
                    id='w1g1-1'
                    worldKey={worldKey}
                    label="확인"
                    onClick={() => {
                      turn.current += 1;
                      if (currentNum.current !== null && currentNum.current > minNum.current) {
                        minNum.current = currentNum.current;
                      }
                      setHasBet(false);
                    }}
                    important={true}
                  />
                </Box>
                <UiCoinPile
                  coin={coin}
                  count={gameRef.current[0].leftChips}
                />
              </>
            )
          }
        } else {
          console.log('올인', 'currentNum', currentNum.current, 'minNum', minNum);
          const success = gameRef.current[1].card < gameRef.current[0].card;

          if (turn.current % 2 === 0) {
            return (
              <>
                <Box line={`당신의 칩이 부족해 모든 칩 ${currentNum.current}개를 베팅했습니다. 베팅을 종료합니다. 과연 당신의 숫자는 무엇이었을까요?`}>
                  <Button
                    label="내 카드 오픈"
                    id='w1g1-1'
                    important={true}
                    onClick={() => {
                      setCardTurned(true);
                      motionPhase.current = success ? 'npcFail' : 'npcWin';
                    }}
                  />
                  <div className="w-full h-50">
                    <SmallScene>
                      <CardTurn cardTurned={cardTurned} object={cards[gameRef.current[0].card]} />
                      <directionalLight intensity={5} position={[0,5,5]} />
                    </SmallScene>
                  </div>
                  {cardTurned &&
                    <div className="flex flex-col gap-4 items-start">
                      <p className="font-bold break-keep">{success ? '상대의 카드보다 큰 숫자이군요. 당신의 승리입니다!' : '상대의 카드보다 작군요. 상대의 승리입니다.'}</p>
                      <Button
                        label="확인"
                        onClick={() => onGameEnd(success)}
                        worldKey={worldKey}
                        id='w1g1-2'
                        important={true}
                      />
                    </div>
                  }
                </Box>
                <UiCoinPile
                  coin={coin}
                  count={gameRef.current[0].leftChips}
                />
              </>
            )
          } else {
            return (
              <>
                <Box line={`상대의 칩이 부족해 모든 칩 ${currentNum.current}개를 베팅했습니다. 베팅을 종료합니다. 과연 당신의 숫자는 무엇이었을까요?`}>
                  <Button
                      label="내 카드 오픈"
                      id='w1g1-1'
                      important={true}
                      onClick={() => {
                        setCardTurned(true);
                        motionPhase.current = success ? 'npcFail' : 'npcWin';
                      }}
                    />
                    <div className="w-full h-50">
                      <SmallScene>
                        <CardTurn cardTurned={cardTurned} object={cards[gameRef.current[0].card]} />
                        <directionalLight intensity={5} position={[0,5,5]} />
                      </SmallScene>
                    </div>
                    {cardTurned &&
                      <div className="flex flex-col gap-4 items-start">
                        <p className="font-bold break-keep">{success ? '상대의 카드보다 큰 숫자이군요. 당신의 승리입니다!' : '상대의 카드보다 작군요. 상대의 승리입니다.'}</p>
                        <Button
                          label="확인"
                          onClick={() => onGameEnd(success)}
                          worldKey={worldKey}
                          id='w1g1-2'
                          important={true}
                        />
                      </div>
                    }
                </Box>
                <UiCoinPile
                  coin={coin}
                  count={gameRef.current[0].leftChips}
                />
              </>
            )
          }
        }
      }
    }
  }
}