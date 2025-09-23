// 카메라 무빙... 맵... 모델.소품.오디오.조명.npc.아바타

import PlayerWithAvatar from "../games/PlayerWithAvatar";
import PlaceHolder from "../util/PlaceHolder";

export default function EntropyMap() {
  return (
    <>
      {/* 맵 */}
      <PlaceHolder label="엔트로피 체제의 맵" />

      {/* 아바타 */}
      <PlayerWithAvatar />
    </>
  )
}