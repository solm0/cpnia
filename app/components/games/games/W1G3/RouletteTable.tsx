import Model from "@/app/components/util/Model";
import { useGamepadControls } from "@/app/lib/hooks/useGamepadControls";
import { useKeyboardControls } from "@/app/lib/hooks/useKeyboardControls";
import { OrbitControls, Text, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { RefObject, useEffect, useRef, useState } from "react";
import { Object3D } from "three";
import FullScreenModal from "@/app/components/util/FullScreenModal";
import Button from "@/app/components/util/Button";

export default function RouletteTable({
  n = 20,
  setBetNum,
}: {
  n?: number;
  setBetNum: (betNum: number | null) => void;
}) {
  const nums = Array.from({ length: n }, (_, i) => i + 1);
  const tableScale = 7;
  const gutter = 1.1;

  const coinIsOn = useRef<number>(1);
  const [pos, setPos] = useState({ row: 0, col: 0 });
  const gamepad = useGamepadControls();
  const deadzone = 0.5;

  const [selected, setSelected] = useState(false);
  const worldKey = "sacrifice";

  // 그리드로 만들기
  const cols = 7;
  const rows = Math.ceil(n / cols);
  const grid: number[][] = [];
  for (let i = 0; i < rows; i++) {
    grid.push(nums.slice(i * cols, i * cols + cols));
  }

  // 코인 움직이기
  const coinRef = useRef<Object3D>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPos(p => {
        let newRow = p.row;
        let newCol = p.col;
  
        if (e.code === 'KeyD' || e.key === 'ArrowRight')
          newCol = Math.min(p.col + 1, cols - 1);
        if (e.code === 'KeyA' || e.key === 'ArrowLeft')
          newCol = Math.max(p.col - 1, 0);
        if (e.code === 'KeyW' || e.key === 'ArrowUp')
          newRow = Math.max(p.row - 1, 0);
        if (e.code === 'KeyS' || e.key === 'ArrowDown')
          newRow = Math.min(p.row + 1, rows - 1);
        if (e.code === 'Enter') {
          setSelected(true);
        }
  
        const newNum = grid[newRow][newCol];
        coinIsOn.current = newNum;
        return { row: newRow, col: newCol };
      });
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 게임패드 (아직 확정은 구현안함.)
  const [moveCooldown, setMoveCooldown] = useState(0);

  useFrame((_, delta) => {
    if (moveCooldown > 0) setMoveCooldown(moveCooldown - delta);
    else if (Math.abs(gamepad.current.axes[0]) > deadzone || Math.abs(gamepad.current.axes[1]) > deadzone) {
      setPos(p => {
        let newRow = p.row;
        let newCol = p.col;
        if (gamepad.current.axes[0] > deadzone) newCol = Math.min(p.col + 1, cols - 1);
        if (gamepad.current.axes[0] < -deadzone) newCol = Math.max(p.col - 1, 0);
        if (gamepad.current.axes[1] > deadzone) newRow = Math.min(p.row + 1, rows - 1);
        if (gamepad.current.axes[1] < -deadzone) newRow = Math.max(p.row - 1, 0);
        const newNum = grid[newRow][newCol];
        coinIsOn.current = newNum;
        return { row: newRow, col: newCol };
      });
      setMoveCooldown(0.3); // prevent rapid movement (300ms delay)
    }
  });

  // 클릭하면 베팅하시겠습가? ok하면
  // setBetNum()

  return (
    <>
      {/* 테이블 */}
      <group
        scale={tableScale}
      >
        {grid.map((row, rowIndex) => {
          return row.map((num, colIndex) => (
            <group
              key={num}
              position={[colIndex * gutter, -rowIndex * gutter, 0]}
            >
              <mesh>
                <planeGeometry args={[1, 1]} />
                <meshBasicMaterial color={num % 2 === 0 ? 'red' : 'black'} />
              </mesh>
              <Text
                position={[0, 0, 0]}
                fontSize={0.4}
                color={num % 2 === 0 ? 'black' : 'white'}
                anchorX="center"
                anchorY="middle"
              >
                {num}
              </Text>
            </group>
          ))
        })}
      </group>

      {/* 동전 */}
      <primitive
        object={useGLTF("/models/coin.gltf").scene}
        ref={coinRef}
        position={[pos.col * tableScale * gutter, -pos.row * tableScale * gutter, 0.2]}
        rotation={[Math.PI/2, 0, 0]}
        scale={0.001}
      />

      {/* ui */}
      <Text
        position={[0, 15, 0]}
        fontSize={1}
        color={'black'}
        anchorX="center"
        anchorY="middle"
      >
        당신의선택은?? enter를 눌러 확정하십쇼..
      </Text>
      <group
        key={coinIsOn.current}
        position={[0,10,0]}
        scale={tableScale}
      >
        <mesh>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color={coinIsOn.current % 2 === 0 ? 'red' : 'black'} />
        </mesh>
        <Text
          position={[0, 0, 0]}
          fontSize={0.4}
          color={coinIsOn.current % 2 === 0 ? 'black' : 'white'}
          anchorX="center"
          anchorY="middle"
        >
          {coinIsOn.current}
        </Text>
      </group>

      {selected &&
        <Html>
          <div className="absolute top-0 left-0 w-96 h-52 -translate-x-1/2 -translate-y-1/2 backdrop-blur-2xl flex flex-col gap-8 items-center justify-center">
            <p>진짜베팅하겠습니까??</p>
            <div className="flex gap-2">
              <Button
                worldKey={worldKey}
                label="예"
                onClick={() => setBetNum(coinIsOn.current)}
              />
              <Button
                worldKey={worldKey}
                label="다시고를래요"
                onClick={() => setSelected(false)}
              />
            </div>
          </div>
        </Html>
      }

      <directionalLight intensity={3} position={[0,30,40]} />
      <OrbitControls minDistance={50} maxDistance={100} />
    </>
  )
}