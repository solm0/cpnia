import { gamePortals } from "@/app/lib/data/positions/gamePortals"
import { useGameStore } from "@/app/lib/state/gameState";
import SmallScene from "../../util/SmallScene";
import Model from "../../util/Model";
import { Environment, OrbitControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import clsx from "clsx";

export function GameStateModal({
  worldKey
}: {
  worldKey: string;
}){
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
  if (!width) return;

  return (
    <>
      <div className="absolute w-screen bottom-0 left-0 h-80 bg-gradient-to-b from-transparent to-[#ffffff20]"></div>
      <div className="absolute w-screen h-auto bottom-8 left-8 flex items-center">
        <div className="absolute bottom-8 h-12 w-[calc(100%-20rem)]">
          <div className="absolute w-full border border-white rounded-full h-10 z-0 opacity-50"></div>
          {/* <div className="absolute w-full border-2 border-white rounded-full h-10 z-0 blur-xs opacity-70"></div> */}
          <div className="absolute w-full p-2">
            <div className={`${width} bg-white rounded-full h-6 opacity-70`}></div>
          </div>

          <div className="absolute bottom-10 w-[calc(100%-4rem)] h-30 flex items-center justify-center">
            {gameIconUrls.map((_, index) => (
              <div
                key={index}
                className={clsx(
                  'absolute w-35',
                  index === 0 && 'left-[31%]',
                  index === 1 && 'left-[61%]',
                  index === 2 && 'left-[95%]'
                )}
              >
                <SmallScene>
                  <Model
                    src={`/models/world-icon/${worldKey}-${index+1}.gltf`}
                    scale={0.5}
                  />
                  <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 2} maxPolarAngle={0} />
                  {stage >= index+1 && <>
                    <directionalLight intensity={3} position={[10,-10,0]} />
                    <Environment files={'/hdri/sky.hdr'} />
                  </>}
                </SmallScene>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute left-[calc(100%-18rem)] bottom-2 w-52 h-52">
          <SmallScene>
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
    </>
  )
}