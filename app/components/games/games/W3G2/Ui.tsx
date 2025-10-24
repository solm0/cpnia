export default function Ui({
  score, leftSec
}: {
  score: number;
  leftSec: number;
}) {
  return (
    <div className="absolute top-0 left-0 flex flex-col gap-2 text-white">
      <p>파괴한 코어: {score}개</p>
      <p>남은 시간: {leftSec}초</p>
    </div>
  )
}