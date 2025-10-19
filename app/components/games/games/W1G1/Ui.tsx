import { RefObject, useEffect, useState } from "react";
import { gameRefProp } from "../W1G1";
import Button from "@/app/components/util/Button";
import { useRouter } from "next/navigation";
import SmallScene from "@/app/components/util/SmallScene";

export default function Ui({
  hasPicked, pickCard, gameRef, turn, minNum,
  currentNum,
  onGameEnd,
  motionPhase, bet
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
}) {
  const worldKey = 'time';
  const router = useRouter();

  // turn 바뀔때 재렌더링, 필요한 것 초기화
  const [, setVersion] = useState(0);

  const [hasBet, setHasBet] = useState(false);
  const [num, setNum] = useState(minNum.current);

  useEffect(() => {
    const interval = setInterval(() => {
      if (turn.current !== null) {
        currentNum.current = null;

        setVersion(v => v + 1);
      }
    }, 16); // 60fps
    return () => clearInterval(interval);
  }, []);

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
      if (turn.current === 0) {
        return (
          <div>
            <p>모두 칩 하나씩 베팅합니다.</p>
            <Button
              worldKey={worldKey}
              onClick={() => {
                bet(10, turn.current);
                turn.current += 1;
              }}
              label="확인"
              autoFocus={true}
            />
          </div>
        )
      } else {
        // 내차례
        if (turn.current % 2 === 0) {
          

          return (
            <>
              <span>남은 칩: {gameRef.current[turn.current % 2].leftChips}개</span>
              <span>베팅한 칩: {gameRef.current[turn.current % 2].betChips}개</span>
              <div>최소 베팅가능 칩 갯수: {minNum.current}</div>
              {turn.current % 2 === 0 && (
                // 인풋
                <div>
                  <div>내가 베팅할 칩 갯수: {currentNum.current}</div>
                  <div>+</div>
                  <div>-</div>
                  <Button
                    label="확인"
                    onClick={() => {
                      bet(num, turn.current); // minNum, currentNum 업데이트
                      setHasBet(true); // ui 업데이트
                      motionPhase.current = 'bet'; // 모션 flag
                    }}
                  />
                  <div>확인</div>
                </div>
              )}
            </>
          )
          // 상대 차례
        } else {
          // 상대 베팅 전
          if (currentNum.current === null) {
            return <div>상대가 베팅 중입니다</div>
            // 상대 베팅 결과 보기
          } else if (currentNum.current > 0) {
            return (
              <div>
                <p>상대가 칩 {currentNum.current}개를 베팅했습니다.</p>
                <Button
                  label="확인"
                  onClick={() => turn.current += 1}
                  worldKey={worldKey}
                  autoFocus={true}
                />
              </div>
            )
          }
        }
      }
      // --- 턴 2/2: 베팅 후 ---
    } else {
      if (!currentNum.current) return;

      // 폴드
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
        // 콜
      } else if (currentNum.current === minNum.current) {
        if (gameRef.current[0].card && gameRef.current[1].card) {
          const success = gameRef.current[1].card < gameRef.current[0].card;
          return (
            <div>
              <p>{success ? '니가 이겼다' : '너 졌다'}</p>

              {/* <SmallScene>
                <Model
              </SmallScene> */}

              <Button
                label="확인"
                onClick={() => onGameEnd(success)}
                worldKey={worldKey}
                autoFocus={true}
              />
            </div>
          )
        } else return (
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
        // 레이즈
      } else if (currentNum.current > minNum.current) {
        // 아니 근데 npc가 베팅 끝낸건 어케알아?
        <div>
          <p>상대가 {currentNum.current}를 베팅했습니다.</p>
          <Button
            autoFocus={true}
            worldKey={worldKey}
            label="확인"
            onClick={() => turn.current += 1}
          />
        </div>
      }
    }
  }
}