import { useRef, useEffect, RefObject } from "react";
import { Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { createFragment } from "./Fragment";

interface DebrisObject {
  group: Group;
  target: Vector3;
  hasLogged?: boolean;
}

export default function DebrisPool({
  count = 50,
  playerRef,
  radius = 500,
  detectRadius = 5,
  collideDebris,
  timerRef,
}: {
  count?: number;
  playerRef: { current: { position: Vector3 } };
  radius?: number;
  detectRadius?: number;
  collideDebris: () => void;
  timerRef: RefObject<{
    startTime: number;
    elapsed: number;
    running: boolean;
  }>;
}) {
  const groupRef = useRef<Group>(null!);
  const objects = useRef<DebrisObject[]>([]);

  useEffect(() => {
    const group = groupRef.current;

    for (let i = 0; i < count; i++) {
      const debrisGroup = new Group();

      const frag = createFragment();
      debrisGroup.add(frag);

      debrisGroup.position.set(
        (Math.random() - 0.5) * radius * 2,
        (Math.random() - 0.5) * radius * 2,
        (Math.random() - 0.5) * radius * 2
      );

      group.add(debrisGroup);

      objects.current.push({
        group: debrisGroup,
        target: debrisGroup.position.clone(),
        hasLogged: false,
      });
    }
  }, [count, radius]);

  useFrame((_, delta) => {
    if (!timerRef.current.running) return;
    
    const playerPos = playerRef.current.position;

    for (const obj of objects.current) {
      const dist = obj.group.position.distanceTo(playerPos);
      obj.group.visible = dist < radius;

      // simple "collision" check
      if (dist < detectRadius && !obj.hasLogged) {
        // console.log("💥 player near debris!", obj.group.position.toArray());
        collideDebris()
        obj.hasLogged = true; // so it logs only once per debris
      } else if (dist >= detectRadius) {
        obj.hasLogged = false; // reset when player moves away
      }

      // move smoothly toward target
      obj.group.position.lerp(obj.target, delta * 0.5);
    }

    // every ~3 seconds: new random target
    if (performance.now() % 5000 < 16) {
      for (const obj of objects.current) {
        obj.target.set(
          playerPos.x + (Math.random() - 0.5) * radius * 2,
          playerPos.y + (Math.random() - 0.5) * radius * 2,
          playerPos.z + (Math.random() - 0.5) * radius * 2
        );
      }
    }
  });

  return <group ref={groupRef} />;
}