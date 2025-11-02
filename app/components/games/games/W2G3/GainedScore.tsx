import { motion } from "framer-motion";

export default function GainedScore({
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