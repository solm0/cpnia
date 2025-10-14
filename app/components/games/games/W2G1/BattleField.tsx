import { useEffect, useMemo, useRef, useState } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { AnimationMixer, Object3D, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { roundConfig, roundConfigProp } from "./roundConfig";
import { abnormIng, normIng } from "./ing";
import Model from "@/app/components/util/Model";
import { lerp } from "three/src/math/MathUtils.js";
import { useAnimGltf } from "@/app/lib/hooks/useAnimGltf";
import OnPizza from "./OnPizza";
import Player from "./CameraController";
import { Physics } from "@react-three/rapier";
import CameraController from "./CameraController";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from 'postprocessing'

interface BodyData {
  ingr: string;
  pos: [number, number, number];
}
// 조리대
const sizeX = 60;
const sizeY = 20;
const center = new Vector3(-1.7,0,-5.5);

// 피자
const pizzaRadius = 4.5;

function isInsidePizza(x: number, z: number): boolean {
  const dx = x - center.x;
  const dz = z - center.z;
  return dx * dx + dz * dz < pizzaRadius * pizzaRadius;
}

function randomPosition(): [number, number, number] {
  let x: number, z: number;

  do {
    x = center.x + (Math.random() - 0.5) * sizeX;
    z = center.z + (Math.random() - 0.5) * sizeY;
  } while (isInsidePizza(x, z));

  return [x, center.y, z];
}

function randomNearPosition(currentPos: Vector3, range: number = 2): [number, number, number] {
  let newX: number, newZ: number;
  
  const minX = center.x - sizeX / 2;
  const maxX = center.x + sizeX / 2;
  const minZ = center.z - sizeY / 2;
  const maxZ = center.z + sizeY / 2;

  do {
    const offsetX = (Math.random() * 2 - 1) * range;
    const offsetZ = (Math.random() * 2 - 1) * range;

    newX = Math.max(minX, Math.min(maxX, currentPos.x + offsetX));
    newZ = Math.max(minZ, Math.min(maxZ, currentPos.z + offsetZ));
  } while (isInsidePizza(newX, newZ));

  return [newX, currentPos.y, newZ];
}

function pickRandom(ing: string[], kind: number) {
  const shuffled = [...ing].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, kind);
}

function generateBodies(config: roundConfigProp, setPizzaIng: (pizzaIng: string[]) => void) {
  const newBodies: BodyData[] = [];

  const chosenNormKinds = pickRandom(normIng, config.normKind);
  setPizzaIng(chosenNormKinds);
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

export default function BattleField({
  score, setScore, onGameEnd
}: {
  score: number;
  setScore: (score: number) => void;
  onGameEnd: (success: boolean) => void;
}) {
  const [bodiesState, setBodiesState] = useState<BodyData[]>([])
  const bodiesRef = useRef<(Object3D | null)[]>([]);
  const animGltf = useAnimGltf()[1];

  const [pizzaIng, setPizzaIng] = useState<string[]>([]);

  const [round, setRound] = useState(1);

  const gltfMap: Record<string, Object3D> = {
    lime: useGLTF('/models/avatars/lime.gltf').scene,
    cherry: useGLTF('/models/avatars/cherry.gltf').scene,
    dango: useGLTF('/models/avatars/dango.gltf').scene,
    mushroom: useGLTF('/models/avatars/mushroom.gltf').scene,
    cheese: useGLTF('/models/avatars/cheese.gltf').scene,
    redpap: useGLTF('/models/avatars/redpap.gltf').scene,
    yellowpap: useGLTF('/models/avatars/yellowpap.gltf').scene,
    garlic: useGLTF('/models/avatars/garlic.gltf').scene,
    olive: useGLTF('/models/avatars/olive.gltf').scene,
  };

  // move bodies
  useFrame(({ clock }, delta) => {
    bodiesRef.current.forEach((obj) => {
      if (!obj) return;

      // update mixer
      if (obj.userData.mixer) {
        obj.userData.mixer.update(delta);
      }
  
      // initialize target, timer, duration, and speed if not set
      if (!obj.userData.target) {
        obj.userData.target = randomPosition();
        obj.userData.timer = clock.elapsedTime;
        obj.userData.duration = 3 + Math.random() * 5; // random 3–8s per move
        obj.userData.speed = 0.01 + Math.random() * 0.002; // lerp speed
      }
  
      const elapsed = clock.elapsedTime - obj.userData.timer;
      const t = elapsed / obj.userData.duration;
  
      // smooth move using the object's own speed
      const targetVec = new Vector3(...obj.userData.target);
      obj.position.lerp(targetVec, obj.userData.speed);
  
      // smooth rotate to face movement direction
      const dir = targetVec.clone().sub(obj.position); // vector toward target
      if (dir.length() > 0.01) {
        const targetY = Math.atan2(dir.x, dir.z); // desired rotation
        // lerpAngle smoothly interpolates angles, works across 0/2π wrap
        obj.rotation.y = lerp(obj.rotation.y, targetY, 0.05); 
      }
  
      // pick a new target if reached
      if (t > 1 || dir.length() < 0.1) {
        obj.userData.target = randomNearPosition(obj.position, 10);
        obj.userData.timer = clock.elapsedTime;
        obj.userData.duration = 3 + Math.random() * 5;
        obj.userData.speed = 0.002 + Math.random() * 0.002;
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
    const bodies: BodyData[] = generateBodies(config, setPizzaIng);
    setBodiesState(bodies);
  }
  
  return (
    <Physics>
      {bodiesState.map((body, i) => (
        <primitive
          key={i}
          object={gltfMap[body.ingr].clone()}
          position={body.pos}
          ref={(el: Object3D | null) => {
            if (!el || !animGltf || !animGltf.animations?.length) return;
            bodiesRef.current[i] = el;

            if (!el.userData.mixer) {
              const root = el.children[0] || el; // use first child if exists
              const mixer = new AnimationMixer(root);
              el.userData.mixer = mixer;

              const clip = animGltf.animations[0];
              const action = mixer.clipAction(clip);
              action.play();
            }
          }}
        />
      ))}

      {/* 조리대, 피자 헬퍼 */}
      {/* <mesh rotation-x={-Math.PI / 2} position={center} receiveShadow>
        <planeGeometry args={[sizeX, sizeY]} />
        <meshStandardMaterial color="white" />
      </mesh> */}
      {/* <mesh position={center}>
        <cylinderGeometry args={[pizzaRadius, pizzaRadius, 0.01, 30]} />
        <meshBasicMaterial color="red" wireframe />
      </mesh> */}

      <Model
        src="/models/shop.glb"
        scale={0.5}
        position={[60,-15.3,-17]}
        rotation={[0,0,0]}
      />

      {/* 피자, 피자 위 주민 */}
      <Model
        src="/models/pizza.gltf"
        scale={0.55}
        position={[center.x, center.y+2, center.z]}
      />
      <OnPizza
        pizzaRadius={pizzaRadius}
        center={[center.x, center.y, center.z]}
        ing={pizzaIng}
        gltfMap={gltfMap}
      />
      
      {/* 조명, 색 */}
      <directionalLight intensity={1} position={[20,10,30]} color={'white'} />
      <directionalLight intensity={2} position={[0,10,0]} color={'orange'} castShadow/>
      <color attach="background" args={["blue"]} />

      <CameraController />

      <EffectComposer>
        <Vignette eskil={false} offset={0.4} darkness={0.7} />
        <Noise opacity={0.1} />
      </EffectComposer>
    </Physics>
  )
}