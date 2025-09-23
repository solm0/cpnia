import Button from "../util/Button";
import FindNpcLine from "./FindNpcLine";

export default function NpcLineModal({
  worldKey, name, setActiveNpc
}: {
  worldKey: string;
  name: string;
  setActiveNpc: (name: string | null) => void;
}) {
  return (
    <div className="flex flex-col gap-2 w-full items-start">
      <p>{name} says:</p>
      <FindNpcLine name={name} worldKey={worldKey} />
      <Button
        onClick={() => setActiveNpc(null)}
        label="닫기"
      />
    </div>
  )
}