import Scene from "../../util/Scene"
import PlaceHolder from "../../util/PlaceHolder"
import { OrbitControls } from "@react-three/drei"
import Button from "../../util/Button"

export default function DefaultFail({
  worldKey, gameKey, nextFunction
}: {
  worldKey: string;
  gameKey: string;
  nextFunction: {label: string, onClick: (param?: number | string) => void;}
}) {
  return (
    <main className="w-full h-full bg-sky-900">
      <Scene>
        <PlaceHolder
          scale={1}
          position={[0, 3, 0]}
          rotation={[0, 0, 0]}
          label={`${worldKey} ${gameKey} 실패! 아직 멀었다네 이방인이여...`}
        />
        <OrbitControls minDistance={30} maxDistance={100} />
      </Scene>
      <div className="absolute top-2/3 w-screen h-auto flex flex-col justify-center gap-4">
        <Button
          onClick={() => nextFunction.onClick?.()}
          label={nextFunction.label}
        />
        <Button
          onClick={() => window.location.reload()}
          label='다시 하기'
        />
      </div>
    </main>
  )
}