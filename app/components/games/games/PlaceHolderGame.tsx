
import PlaceHolder from "../../util/PlaceHolder";

export default function PlaceHolderGame({
  click, setClick, onGameEnd
}: {
  click: number;
  setClick: (click: number) => void;
  onGameEnd: (success: boolean) => void;
}) {
  return (
    <>
      <PlaceHolder
        onClick={() => {setClick(click + 1); console.log('clidk')}}
        position={[-2,0,0]}
        label="클릭!"
      />
      <PlaceHolder
        onClick={() => {
          const success = click >= 5;
          onGameEnd(success)
        }}
        position={[2,0,0]}
        label="게임 종료"
      />
    </>
  )
}