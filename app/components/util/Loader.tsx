import { Html, useProgress } from "@react-three/drei";

export default function Loader() {
  const { progress } = useProgress();
  return <Html center><p className="text-sm font-mono flex items-center whitespace-nowrap">{`${Math.floor(progress)}% loaded`}</p></Html>
}