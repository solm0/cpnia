import PlaceHolderGame from "./PlaceHolderGame";

export default function W1G3({
  onGameEnd
}: {
  onGameEnd: (success: boolean) => void;
}) {
  return (
    <>
      <PlaceHolderGame onGameEnd={onGameEnd} />
    </>
  )
}