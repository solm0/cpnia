import PlaceHolder from "../../util/PlaceHolder";
import Button from "../../util/Button";
import { useRouter } from "next/navigation";
import Scene from "../../util/Scene";
import { OrbitControls } from "@react-three/drei";

export default function CitizenshipScreen({
  worldKey
}: {
  worldKey: string;
}) {
  const router = useRouter();
  return (
    <main className="w-full h-full bg-sky-900">
      <Scene>
        <PlaceHolder
          scale={1}
          position={[0, 3, 0]}
          rotation={[0, 0, 0]}
          label={`${worldKey} 사회에 성공적으로 동화되셨군요? 당신도 이제 ${worldKey}의 시민입니다. 시민권을 발급해 드리겠습니다. 축하합니다.`}
        />
        <OrbitControls minDistance={30} maxDistance={100} />
      </Scene>
      <div className="absolute top-2/3 w-screen h-auto flex justify-center">
        <Button
          onClick={() => router.push(`/`)}
          label="홈으로"
        />
      </div>
    </main>
  )
}