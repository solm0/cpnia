import PlaceHolderGame from "./PlaceHolderGame";

export default function W1G2({
  onGameEnd,
}: {
  onGameEnd: (success: boolean) => void;
}) {
  return (
    <>
      <PlaceHolderGame onGameEnd={onGameEnd} />
    </>
  )
}