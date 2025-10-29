import { useGameStore } from "@/app/lib/state/gameState";
import SmallScene from "../../util/SmallScene";
import Model from "../../util/Model";
import clsx from "clsx";
import CardModel from "../../home/interfaces/CardModel";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";

export function GameStateModal({
  worldKey
}: {
  worldKey: string;
}){
  const gameState = useGameStore(state => state.worlds[worldKey].games);

  const gameIcons = [
    useGLTF(`/models/world-icon/${worldKey}-1.gltf`).scene,
    useGLTF(`/models/world-icon/${worldKey}-2.gltf`).scene,
    useGLTF(`/models/world-icon/${worldKey}-3.gltf`).scene
  ];

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
            {gameIcons.map((icon, i) => (
              <div
                key={i}
                className={clsx(
                  'absolute w-35',
                  i === 0 && 'left-[31%]',
                  i === 1 && 'left-[61%]',
                  i === 2 && 'left-[95%]'
                )}
              >
                <SmallScene>
                  <Model
                    scene={icon}
                    scale={0.5}
                  />
                  <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 2} maxPolarAngle={0} />
                  {stage >= i+1 &&
                    <>
                      <directionalLight intensity={3} position={[10,-10,0]} />
                      <Environment files={'/hdri/sky.hdr'} />
                    </>
                  }
                </SmallScene>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute left-[calc(100%-18rem)] bottom-2 w-52 h-52">
          <CardModel
            worldKey={worldKey}
            isCompleted={stage === 3}
          />
        </div>
      </div>
    </>
  )
}