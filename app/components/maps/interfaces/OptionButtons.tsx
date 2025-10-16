import { motion } from "framer-motion";

export function TimeOptionButton({
  onClick, label
}: {
  onClick: (param?: number | string) => void;
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

function GainedScore({
  score, clickedScore
}: {
  score: number;
  clickedScore: number;
}) {
  if (score !== clickedScore) return null;

  const color =
    score === 5
      ? "text-pink-500"
      : score === 2
      ? "text-green-500"
      : score === -2
      ? "text-blue-500"
      : "text-black";

  console.log(score, color)

  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: -50, opacity: 0 }}
      transition={{ duration: 3, ease: "easeInOut" }}
      className={`absolute top-0 left-50 text-3xl font-bold ${color}`}
    >
      + {score}
    </motion.div>
  )
}

export function SacrificeOptionButton({
  onClick, label, gainedScore, isClicked, setIsClicked
}: {
  onClick: (param?: number | string) => void;
  label: string;
  gainedScore?: number;
  isClicked?: number | null;
  setIsClicked?: (isClicked: number | null) => void;
}) {
  return (
    <div
      tabIndex={0}
      onClick={() => {
        onClick?.();
        if (setIsClicked && gainedScore) {
          setIsClicked(gainedScore);
        }
      }}
      className="w-full bg-gradient-to-r px-3 py-1 rounded-2xl text-gray-700 from-yellow-300 to-transparent hover:opacity-50 transition-opacity flex items-center"
    >
      {label}
      {isClicked && gainedScore &&
        <GainedScore score={gainedScore} clickedScore={isClicked} />
      }
    </div>
  )
}

export function EntropyOptionButton({
  onClick, label
}: {
  onClick: (param?: number | string) => void;
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