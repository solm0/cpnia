'use client'

import Label from "../../util/Label";
import { useRouter } from "next/navigation";

export default function HomePortalLayout({
  label,
  scale = 1,
  children
}: {
  label: string;
  scale?: number;
  children: React.ReactNode;
}) {
  const router = useRouter();
  // 발광 애니메이션
  
  return (
    <group
      scale={scale}
      onClick={() => router.push('/')}
    >
      <Label text={label ?? null} position={[0, 2.5,0]}/>
      {children}
    </group>
  )
}