import PlaceHolder from "../models/PlaceHolder";
import Button from "../util/Button";
import { Html } from "@react-three/drei";
import { useRouter } from "next/navigation";

export default function CitizenshipScreen({
  worldKey
}: {
  worldKey: string;
}) {
  const router = useRouter();
  return (
    <>
      <PlaceHolder
        scale={1}
        position={[0, 3, 0]}
        rotation={[0, 0, 0]}
        label={`${worldKey} 사회에 성공적으로 동화되셨군요? 당신도 이제 ${worldKey}의 시민입니다. 시민권을 발급해 드리겠습니다. 축하합니다.`}
      />
      <Html>
        <Button
          onClick={() => router.push(`/`)}
          label="월드로 돌아가기"
        />
      </Html>
    </>
  )
}