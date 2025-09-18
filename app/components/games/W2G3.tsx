import PlaceHolder from "../models/PlaceHolder";

export default function W2G3({
  onGameEnd,
}: {
  onGameEnd: (success: boolean) => void;
}) {
  console.log(onGameEnd)
  return (
    <PlaceHolder
      scale={1}
      position={[0, 3, 0]}
      rotation={[0, 0, 0]}
    />
  )
}