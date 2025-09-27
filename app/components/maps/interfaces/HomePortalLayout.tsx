'use client'

import Label from "../../util/Label";
import { useRouter } from "next/navigation";

export default function HomePortalLayout({
  label,
  scale = 1,
  position = [15,0,-5],
  rotation = [0,0,0],
  children
}: {
  label: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  children: React.ReactNode;
}) {
  const router = useRouter();
  // 발광 애니메이션
  
  return (
    <group
      scale={scale}
      position={position}
      rotation={rotation}
      onClick={() => router.push('/')}
    >
      <Label text={label ?? null} position={[0, 2.5,0]}/>
      {children}
    </group>
  )
}