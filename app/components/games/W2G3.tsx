import PlaceHolder from "../models/PlaceHolder";
import PlaceHolderGame from "./PlaceHolderGame";

export default function W2G3({
  onGameEnd,
}: {
  onGameEnd: (success: boolean) => void;
}) {
  return (
    <>
      <PlaceHolder
        scale={1}
        position={[0, 3, 0]}
        rotation={[0, 0, 0]}
      />
      <PlaceHolderGame onGameEnd={onGameEnd} />
    </>
  )
}