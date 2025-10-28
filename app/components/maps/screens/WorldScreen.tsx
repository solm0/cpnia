import PlaceHolder from "../../util/PlaceHolder";
import EntropyScreen from "./EntropyScreen";
import TimeScreen from "./TimeScreen";
import SacrificeScreen from "./SacrificeScreen";
import { Object3D } from "three";

export default function WorldScreen({
  worldKey, avatar,
}: {
  worldKey: string;
  avatar: Object3D;
}) {

  switch(worldKey) {
    case 'time':
      return <TimeScreen avatar={avatar} />;
    case 'sacrifice':
      return <SacrificeScreen avatar={avatar} />;
    case 'entropy':
      return <EntropyScreen avatar={avatar} />;
    default:
      <PlaceHolder label="no worldKey" />
  }
}