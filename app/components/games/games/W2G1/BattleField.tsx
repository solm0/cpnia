import { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { Object3D, Raycaster, Vector2, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { W2G1roundConfig, W2G1roundConfigProp } from "../roundConfig";
import { abnormIng, normIng } from "./ing";
import Model from "@/app/components/util/Model";
import { lerp } from "three/src/math/MathUtils.js";
import OnPizza from "./OnPizza";
import CameraController from "./CameraController";
import { EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BodyData, center, isInsidePizza, pizzaRadius, randomPosition, sizeX, sizeY } from "../W2G1";
import Body from "./Body";
import { Physics } from "@react-three/rapier";

function generateBodies(config: W2G1roundConfigProp, setPizzaIng: (pizzaIng: string[]) => void) {
  const newBodies: BodyData[] = [];

  function pickRandom(ing: string[], kind: number) {
    const shuffled = [...ing].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, kind);
  }

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

export default function BattleField({
  round, onRoundReady, abnormalRef, spaceKeyRef
}: {
  round: number;
  onRoundReady: (round: number) => void;
  abnormalRef: React.RefObject<boolean | null>;
  spaceKeyRef: React.RefObject<boolean>;
}) {
  const bodiesRef = useRef<(Object3D | null)[]>([]);
  const [bodiesState, setBodiesState] = useState<BodyData[]>([])
  const [pizzaIng, setPizzaIng] = useState<string[]>([]);

  const raycasterRef = useRef(new Raycaster());
  const pointer = new Vector2(0,0);
  const { camera } = useThree();

  const gltfMap: Record<string, Object3D> = {
    lime: useGLTF('/models/avatars/lime.gltf').scene,
    cherry: useGLTF('/models/avatars/cherry.gltf').scene,
    dango: useGLTF('/models/avatars/dango.gltf').scene,
    pepperoni: useGLTF("/models/avatars/pepperoni.gltf").scene,
    mushroom: useGLTF('/models/avatars/mushroom.gltf').scene,
    cheese: useGLTF('/models/avatars/cheese.gltf').scene,
    redpap: useGLTF('/models/avatars/redpap.gltf').scene,
    yellowpap: useGLTF('/models/avatars/yellowpap.gltf').scene,
    onion: useGLTF('/models/avatars/onion.gltf').scene,
    olive: useGLTF('/models/avatars/olive.gltf').scene,
  };
  const kitchen = useGLTF("/models/shop-kitchen.gltf").scene;
  const pizza = useGLTF("/models/shop-kitchen.gltf").scene;

  useEffect(() => {
    const config = W2G1roundConfig[round];
    const newBodies = generateBodies(config, setPizzaIng);
    bodiesRef.current = [];
    setBodiesState(newBodies);
  }, [round]);

  // ✅ Start round only when all models exist
  useEffect(() => {
    const allLoaded = Object.values(gltfMap).every(Boolean);
    if (allLoaded) {
      onRoundReady(round);
    }
  }, [Object.values(gltfMap).length]);

  // move bodies
  useFrame(({ clock }, delta) => {

    // --- body movement ---

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
     
    // --- raycaster ---

    const raycaster = raycasterRef.current;
    raycaster.setFromCamera(pointer, camera);

    const validBodies = bodiesRef.current.filter((o): o is Object3D => o !== null);
    const intersects = raycaster.intersectObjects(validBodies, true);

    function findRootByUUID(hit: Object3D, bodies: (Object3D | null)[]) {
      for (const body of bodies) {
        if (!body) continue;
    
        if (body.uuid === hit.uuid) return body; // rare, if hit itself is root
    
        // recursive search
        const stack: Object3D[] = [body];
        while (stack.length > 0) {
          const obj = stack.pop()!;
          if (obj.uuid === hit.uuid) return body; // return the top-level body
          stack.push(...obj.children);
        }
      }
      return null;
    }

    let newTarget: Object3D | null = null;

    if (intersects.length > 0) {
      let minDist = Infinity;

      intersects.forEach(intersect => {
        const root = findRootByUUID(intersect.object, bodiesRef.current);
        if (!root) return;

        const dist = root.position.distanceTo(center);
        if (dist < minDist) {
          minDist = dist;
          newTarget = root;
        }
      });
    }

    bodiesRef.current.forEach(obj => {
      if (!obj) return;
      (obj as Object3D).userData.isTargeted = obj === newTarget;
    });
    
    if (newTarget) {
      const ingr = (newTarget as Object3D).userData?.ingr;
      abnormalRef.current = abnormIng.includes(ingr);
    } else {
      abnormalRef.current = null
    }

    // --- handle space key ---
    if (spaceKeyRef.current && abnormalRef.current !== null){
      console.log('슛!!')
      
      // Remove from bodies
      const index = bodiesRef.current.findIndex(obj => obj === newTarget);

      if(index !== -1){
        bodiesRef.current.splice(index, 1); // remove for raycasting
        setBodiesState(prev => prev.filter((_,i)=>i!==index)); // remove for React render
      }

      // Reset the key so we don't trigger again
      spaceKeyRef.current = false;
    }
    console.log('length', bodiesRef.current.length, bodiesState.length)
  });
  
  return (
    <Physics>
      {bodiesState.map((body, i) => (
        <Body
          key={i}
          body={body}
          bodiesRef={bodiesRef}
          gltfMap={gltfMap}
          i={i}
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

      {/* 지형 */}
      <Model
        scene={kitchen}
        scale={0.5}
        position={[60,-15.3,-17]}
        rotation={[0,0,0]}
      />

      {/* 피자, 피자 위 주민 */}
      <Model
        scene={pizza}
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

      {/* 카메라, 컨트롤 */}
      <CameraController position={[-1.5, 5, 5]}/>

      {/* 효과 */}
      <EffectComposer>
        <Vignette eskil={false} offset={0.4} darkness={0.7} />
        <Noise opacity={0.1} />
      </EffectComposer>
    </Physics>
  )
}