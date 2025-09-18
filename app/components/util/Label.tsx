import { Html } from "@react-three/drei";

export default function Label({
  text = 'no label',
}: {
  text: string | null;
}) {
  return (
    <Html distanceFactor={10}>
      <div className="absolute top-30 -translate-x-1/2 text-center text-gray-700 text-[2rem] w-[20rem] break-keep">
        {text}
      </div>
    </Html>
  )
}