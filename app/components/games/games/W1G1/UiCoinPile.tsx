import { Object3D } from "three";
import CoinPile from "./CoinPile";

export default function UiCoinPile({
  coin, count, tmpCount, x
}: {
  coin: Object3D;
  count: number;
  tmpCount?: number;
  x?: number;
}) {
  return (
    <div className="w-50 h-60 absolute bottom-27 left-0 -translate-x-65">
      <CoinPile
        coin={coin}
        count={tmpCount !== undefined ? tmpCount : count}
        x={x}
      />
    </div>
  )
}