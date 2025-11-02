import GainedScore from "../../games/games/W2G3/GainedScore";
import OptionButton from "../../util/OptionButton";

export function TimeOptionButton({
  onClick, label, id
}: {
  onClick: (param?: number | string | boolean | null) => void;
  label: string;
  id: string;
}) {
  return (
    <OptionButton
      id={id}
      onClick={onClick}
      style="w-full text-lime-400 hover:opacity-50 transition-opacity flex items-center"
      label={label}
    />
  )
}

export function SacrificeOptionButton({
  onClick, label, gainedScore, isClicked, setIsClicked, id
}: {
  onClick: (param?: number | string | boolean | null) => void;
  label: string;
  gainedScore?: number;
  isClicked?: number | null;
  setIsClicked?: (isClicked: number | null) => void;
  id: string;
}) {
  function handleClick() {
    onClick?.();
    if (setIsClicked && gainedScore) {
      setIsClicked(gainedScore);
    }
  }
  return (
    <OptionButton
      id={id}
      onClick={handleClick}
      style="w-full bg-gradient-to-r px-3 py-1 rounded-2xl text-gray-700 from-yellow-300 to-transparent hover:opacity-50 transition-opacity flex items-center"
      label={
        <>
          {label}
          {isClicked && gainedScore &&
            <GainedScore score={gainedScore} clickedScore={isClicked} />
          }
        </>
      }
    />
  )
}

export function EntropyOptionButton({
  onClick, label
}: {
  onClick: (param?: number | string | boolean | null) => void;
  label: string;
}) {
  return (
    <div
      tabIndex={0}
      onClick={() => onClick?.()}
      className="w-full text-lime-400 hover:opacity-50 transition-opacity flex items-center"
    >
      {label}
    </div>
  )
}