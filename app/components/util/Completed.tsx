import { Html } from "@react-three/drei";

export default function Completed({
  completed
}: {
  completed: boolean;
}) {
  return (
    <Html>
      <div className="absolute top-16 -translate-x-1/2 text-center text-gray-700 text-sm w-[20rem] break-keep">
        {completed ? 'completed!' : 'not completed'}
      </div>
    </Html>
  )
}