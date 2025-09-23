import PlaceHolderGame from "./PlaceHolderGame";

export default function W1G1({
  onGameEnd
}: {
  onGameEnd: (success: boolean) => void;
}) {
  // 게임마다 다른 게임 상태 저장. 점수만 Game으로 올려줌.
  
  return (
    <>
      {/* Game */}
      <PlaceHolderGame onGameEnd={onGameEnd} />
    </>
  )
}