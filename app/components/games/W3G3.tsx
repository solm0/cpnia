
import PlaceHolderGame from "./PlaceHolderGame";

export default function W3G3({
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