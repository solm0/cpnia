import { RefObject, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, Color, Mesh } from "three";
import { Core, PlayerData } from "../W3G2";
import { LineHelper } from "./LineHelper";
import { Box } from "@react-three/drei";

export default function MiniMap({
  coresRef,
  playerRef,
}: {
  coresRef: RefObject<Core[]>;
  playerRef: RefObject<PlayerData>;
}) {
  const relativeCorePos = useRef<Vector3[]>([]);
  const [, forceUpdate] = useState(0); // 강제 렌더용
  const color = new Color();
  const coreMapScale = 0.1;
  const mapRadius = 23;
  const borderRadius = 21;

  const arrowRef = useRef<Mesh>(null);

  useFrame(() => {
    if (!playerRef.current || !coresRef.current) return;
    const playerPos = playerRef.current.position;

    // 코어들의 상대적 위치 갱신
    relativeCorePos.current = coresRef.current.map((core) =>
      new Vector3().subVectors(core.position, playerPos).divideScalar(10)
    );

    // visible core 체크
    const visibleCore = relativeCorePos.current.find(
      (v) => Math.abs(v.x) < mapRadius && Math.abs(v.z) < mapRadius
    );

    if (!visibleCore && arrowRef.current && relativeCorePos.current.length > 0) {
      // 가장 가까운 코어 찾기
      const nearest = relativeCorePos.current.reduce((a, b) =>
        a.length() < b.length() ? a : b
      );
      const dir = nearest.clone().normalize();
      arrowRef.current.position.set(
        dir.x * borderRadius * coreMapScale,
        0.05,
        dir.z * borderRadius * coreMapScale
      );
      arrowRef.current.rotation.y = Math.atan2(dir.x, dir.z);
      arrowRef.current.visible = true;
    } else if (arrowRef.current) {
      arrowRef.current.visible = false;
    }

    // 강제 렌더 (leftClicks 변화 반영)
    forceUpdate((t) => t + 1);
  });

  // 코어 중 최대 클릭 수 계산 (색상 보정용)
  const maxClicks =
    coresRef.current?.reduce((max, c) => Math.max(max, c.leftClicks), 1) ?? 1;

  return (
    <group position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
      {/* 방향 */}
      <LineHelper middlePos={new Vector3(0, 0, 0)} playerRef={playerRef} />

      {/* 코어 */}
      {relativeCorePos.current.map((core, i) => {
        const coreData = coresRef.current?.[i];
        if (!coreData) return null;

        const ratio = Math.min(coreData.leftClicks / maxClicks, 1);
        const lerped = color
          .setHex(0xff3333)
          .lerp(new Color(0x33ff66), ratio)
          .getHex();

        return (
          <Box
            key={i}
            args={[0.3, 0.05, 0.3]}
            position={[
              core.x * coreMapScale,
              0.05,
              core.z * coreMapScale
            ]}
            scale={0.8}
          >
            <meshBasicMaterial color={lerped} />
          </Box>
        );
      })}

      {/*  */}
      <mesh ref={arrowRef} visible={false}>
        <coneGeometry args={[0.2, 0.4, 3]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  );
}