import { useEffect, useRef, useState } from "react";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { Object3D, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

const normIng = ['mushroom', 'cheese', 'redpap', 'yellowpap', 'garlic', 'olive'];
const abnormIng = ['lime', 'cherry', 'skewer', 'banana'];

interface roundConfigProp {
  normCount: number,
  abnormCount: number,
  normKind: number,
  abnormKind: number,
}

const roundConfig: Record<number, roundConfigProp> = {
  1: {
    normCount: 8,
    abnormCount: 2,
    normKind: 1,
    abnormKind: 1,
  },
  2: {
    normCount: 10,
    abnormCount: 4,
    normKind: 2,
    abnormKind: 1,
  },
  3: {
    normCount: 20,
    abnormCount: 6,
    normKind: 4,
    abnormKind: 2,
  }
}

export default function BattleField({
  score, setScore, onGameEnd
}: {
  score: number;
  setScore: (score: number) => void;
  onGameEnd: (success: boolean) => void;
}) {
  interface BodyData {
    ingr: string;
    pos: [number, number, number];
  }

  const [bodiesState, setBodiesState] = useState<BodyData[]>([])
  const bodiesRef = useRef<(Object3D | null)[]>([]);

  const gltfMap: Record<string, Object3D> = {
    lime: useGLTF('/models/avatars/lime.glb').scene,
    cherry: useGLTF('/models/avatars/cherry.glb').scene,
    skewer: useGLTF('/models/avatars/skewer.glb').scene,
    banana: useGLTF('/models/avatars/banana.glb').scene,
    mushroom: useGLTF('/models/avatars/mushroom.glb').scene,
    cheese: useGLTF('/models/avatars/cheese.glb').scene,
    redpap: useGLTF('/models/avatars/redpap.glb').scene,
    yellowpap: useGLTF('/models/avatars/yellowpap.glb').scene,
    garlic: useGLTF('/models/avatars/garlic.glb').scene,
    olive: useGLTF('/models/avatars/olive.glb').scene,
  }

  function randomPosition(): [number, number, number] {
    const sizeX = 10;
    const sizeY = 10;

    return [
      (Math.random() - 0.5) * sizeX,
      0,
      (Math.random() - 0.5) * sizeY,
    ];
  }
  
  function pickRandom(ing: string[], kind: number) {
    const shuffled = [...ing].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, kind);
  }

  function generateBodies(config: roundConfigProp) {
    const newBodies: BodyData[] = [];

    const chosenNormKinds = pickRandom(normIng, config.normKind);
    chosenNormKinds.forEach(kind => {
      for (let i = 0; i < config.normCount / config.normKind; i++) {
        newBodies.push({ ingr: kind, pos: randomPosition() });
      }
    });

    const chosenAbnormKinds = pickRandom(abnormIng, config.abnormKind);
    chosenAbnormKinds.forEach(kind => {
      for (let i = 0; i < config.abnormCount / config.abnormKind; i++) {
        newBodies.push({ ingr: kind, pos: randomPosition() });
      }
    });

    return newBodies;
  }

  // move bodies
  useFrame(({ clock }) => {
    bodiesRef.current.forEach((obj) => {
      if (!obj) return;
  
      if (!obj.userData.target) {
        obj.userData.target = randomPosition();
        obj.userData.timer = clock.elapsedTime;
      }
  
      const t = (clock.elapsedTime - obj.userData.timer) / 5; // 5 seconds cycle
      obj.position.lerp(new Vector3(...obj.userData.target), 0.01);
  
      // After ~5 seconds, choose a new random target
      if (t > 1) {
        obj.userData.target = randomPosition();
        obj.userData.timer = clock.elapsedTime;
      }
    });
  });

  // ✅ Start round only when all models exist
  useEffect(() => {
    const allLoaded = Object.values(gltfMap).every(Boolean);
    if (allLoaded) {
      startRound(1);
    }
  }, [Object.values(gltfMap).length]);

  function startRound(round: number) {
    // 1. clear old bodies
    bodiesRef.current = [];

    // 2. generate new config
    const config = roundConfig[round];
    const bodies: BodyData[] = generateBodies(config);
    setBodiesState(bodies);
  }

  return (
    <>
      {bodiesState.map((body, i) => (
        <primitive  
          key={i}
          object={gltfMap[body.ingr].clone()}
          position={body.pos}
          ref={(el: Object3D | null) => {
            if (el) bodiesRef.current[i] = el;
          }}
        />
      ))}

      <OrbitControls minDistance={30} maxDistance={100} />
    </>
  )
}