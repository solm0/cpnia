import { Html, useProgress } from "@react-three/drei";

export default function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="bg-black w-screen h-screen flex items-center justify-center">
        <p className="text-5xl font-mono text-white flex items-center whitespace-nowrap">
          {`${Math.floor(progress)}% loaded`}
        </p>
      </div>
    </Html>
  )
}