import PlaceHolderGame from "./PlaceHolderGame";

export default function W2G1({
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