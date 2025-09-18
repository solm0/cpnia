'use client'

import { useRouter } from "next/navigation";
import { Html } from "@react-three/drei";

export default function Title({
  scale, position, rotation, href, label
}: {
  scale?: number,
  position?: [number, number, number],
  rotation?: [number, number, number],
  href?: string;
  label?: string;
}) {
  const router = useRouter();

  return (
    <Html
      scale={scale ?? 1}
      position={position ?? [0, 0, 0]}
      rotation={rotation ?? [0, 0, 0]}
      onClick={() => router.push(href ?? '/')}
      distanceFactor={10}
    >
      <div className="translate-y-36 -translate-x-1/2 text-center text-black text-[15rem] w-[20em] break-keep font-mono select-none">{label ?? 'no label'}</div>
    </Html>
  )
}