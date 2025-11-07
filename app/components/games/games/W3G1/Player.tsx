import { useAnimGltf } from "@/app/lib/hooks/useAnimGltf";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";
import { Billboard, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { AnimationMixer, Group, LoopRepeat, Object3D } from "three";

export default function Player({
  width, cubeMap, onGameEnd, timeRef, runningRef, avatar
}: {
  width: number;
  cubeMap: number[];
  onGameEnd: (success: boolean) => void;
  timeRef: React.RefObject<number>;
  runningRef: React.RefObject<boolean>;
  avatar: Object3D;
}) {
  const animGltf = useAnimGltf();
  const mixer = useRef<AnimationMixer | null>(null);
  const [pos, setPos] = useState(1);
  const [life, setLife] = useState(10);

  // 키보드 컨트롤
  const pressed = useKeyboardControls();
  const gamepad = useGamepadControls();

  const lastSecRef = useRef(-1);
  const groupRef = useRef<Group>(null);
  const jumpHeight = width * 1.2;

  useEffect(() => {
    const deadzone = 0.5;
    const handleKeyDown = () => {
      if (pressed.current.has("KeyD") || gamepad.current.axes[0] > deadzone) {
        setPos((p) => Math.min(3, p + 1));
      } else if (pressed.current.has("KeyA") || gamepad.current.axes[0] < -deadzone) {
        setPos((p) => Math.max(0, p - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pressed, gamepad]);

  useEffect(() => {
    mixer.current = new AnimationMixer(avatar);
    return () => {
      mixer.current?.stopAllAction();
    };
  }, [avatar]);

  useEffect(() => {
    if (!mixer.current) return;
    const anim = animGltf[2]?.animations?.[0];
    if (!anim) return;
  
    const action = mixer.current.clipAction(anim);
    action
      .reset()
      .fadeIn(0.2)
      .setLoop(LoopRepeat, Infinity)
      .play();
  
  }, [animGltf]);


  useFrame((_, delta) => {
    mixer.current?.update(delta);

    if (!runningRef.current) return;
    const elapsed = timeRef.current;
    const sec = Math.floor(elapsed);
    const t = elapsed - sec;

    // 🟣 Jump curve y = h * 4t(1-t)
    const jumpY = jumpHeight * 4 * t * (1 - t);

    // Update player group position
    if (groupRef.current) {
      groupRef.current.position.set(
        -width * 1.5 + pos * width,
        width * 0.5 + jumpY,
        width * 2
      );
    }

    if (sec !== lastSecRef.current) {
      lastSecRef.current = sec;

      if (sec >= cubeMap.length) {
        onGameEnd(true);
        return;
      }

      const expected = cubeMap[sec];
      if (expected !== pos) {
        setLife(life - 1)
        if (life - 1 <= 0) {
          onGameEnd(false);
        }
      }
    }
  });

  return (
    <group
      ref={groupRef}
      rotation={[0,-Math.PI,0]}
    >
      <Billboard position={[0,5,0]}>
        <Text>{life}</Text>
      </Billboard>
      <primitive
        object={avatar}
        scale={width * 1.3}
      />
    </group>
  )
}