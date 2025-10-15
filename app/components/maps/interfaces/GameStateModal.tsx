import { gamePortals } from "@/app/lib/data/positions/gamePortals"
import { useGameStore } from "@/app/lib/state/gameState";
import SmallScene from "../../util/SmallScene";
import Model from "../../util/Model";
import { OrbitControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import PlaceHolder from "../../util/PlaceHolder";
import clsx from "clsx";

export function GameStateModal({
  worldKey
}: {
  worldKey: string;
}){
  // const reset = useGameStore(state => state.reset);
  // const isThereSomethingToDelete = useGameStore(state => Object.values(state.worlds[worldKey].games).some(Boolean));

  const gameState = useGameStore(state => state.worlds[worldKey].games);
  const gameIconUrls = gamePortals[worldKey];

  let width;
  let stage;
  if (gameState['game1'] === false) {
    width = 'w-6';
    stage = 0;
  } else if (gameState['game2'] === false) {
    width = 'w-1/3'
    stage = 1;
  } else if (gameState['game3'] === false) {
    width = 'w-2/3'
    stage = 2;
  } else {
    width = 'w-full'
    stage = 3;
  }
  console.log(width)
  if (!width) return;

  return (
    <div className="absolute w-screen h-auto bottom-8 left-8 flex items-center">
      <div className="absolute bottom-8 h-12 w-[calc(100%-20rem)]">
        <div className="absolute w-full border border-white rounded-full h-10 z-0 opacity-30"></div>
        <div className="absolute w-full border-2 border-white rounded-full h-10 z-0 blur-xs opacity-70"></div>
        <div className="absolute w-full p-2">
          <div className={`${width} bg-white rounded-full h-6 opacity-70`}></div>
        </div>

        <div className="absolute bottom-10 w-full h-30 flex items-center justify-center">
          {gameIconUrls.map((icon, index) => (
            <div
              key={index}
              className={clsx(
                'absolute',
                index === 0 && 'left-[31%]',
                index === 1 && 'left-[61%]',
                index === 2 && 'left-[95%]'
              )}
            >
              {stage >= index+1 ? (
                icon.gameIconUrl ? (
                  <SmallScene>
                    <Model
                      src={icon.gameIconUrl}
                    />
                    <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 2} maxPolarAngle={0} />
                  </SmallScene>
                ):(
                  <div className="h-30 w-30 -translate-x-1/2">
                    <SmallScene>
                      <PlaceHolder scale={0.7}/>
                      <directionalLight position={[10,-10,0]} />
                      <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 2} maxPolarAngle={0} />
                    </SmallScene>
                  </div>
                )
              ): (
                <div className="animate-pulse text-6xl font-serif text-shadow-2xl text-white">?</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute left-[calc(100%-20rem)] bottom-2 w-52 h-52">
        <SmallScene>
          <ambientLight />
          <Model
            src="/models/citizenship-card.glb"
            scale={1.3}
            position={[0,0,0]}
            rotation={[degToRad(90), degToRad(30), degToRad(60)]}
          />
          <OrbitControls
            enableZoom={false}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
          />
        </SmallScene>
      </div>
    </div>
  )
}