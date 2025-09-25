import PlaceHolder from "../../util/PlaceHolder";
import EntropyScreen from "./EntropyScreen";
import TimeScreen from "./TimeScreen";
import SacrificeScreen from "./SacrificeScreen";

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