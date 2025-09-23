import PlaceHolder from "../util/PlaceHolder";
import EntropyScreen from "./screens/EntropyScreen";
import TimeScreen from "./screens/TimeScreen";
import SacrificeScreen from "./screens/SacrificeScreen";

export default function WorldScreen({
  worldKey,
}: {
  worldKey: string;
}) {

  switch(worldKey) {
    case 'time':
      return <TimeScreen />;
    case 'sacrifice':
      return <SacrificeScreen />;
    case 'entropy':
      return <EntropyScreen />;
    default:
      <PlaceHolder label="no worldKey" />
  }
}