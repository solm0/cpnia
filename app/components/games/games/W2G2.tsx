import PlaceHolderGame from "./PlaceHolderGame";

export default function W2G2({
  onGameEnd
}: {
  onGameEnd: (success: boolean) => void;
}) {
  return (
    <>
      {/* Game */}
      <PlaceHolderGame onGameEnd={onGameEnd} />
    </>
  )
}