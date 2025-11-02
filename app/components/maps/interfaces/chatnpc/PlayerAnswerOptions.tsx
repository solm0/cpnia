import { chatPlayerLines } from "@/app/lib/data/lines/chatPlayerLines";
import { Dispatch, SetStateAction  } from "react";
import { TimeOptionButton, SacrificeOptionButton, EntropyOptionButton } from "../OptionButtons";

export function TimePlayerAnswerOptions({
  playerLines, setPlayerLines, formality, setInput
}: {
  playerLines: number[];
  setPlayerLines: Dispatch<SetStateAction<number[]>>;
  formality: string | null;
  setInput: (input: string) => void
}) {
  function handleClick (line:string, index: number) {
    setInput(line);
    setPlayerLines(prev => prev.filter(i => i !== index));
  }
  return (
    <div className="relative flex flex-col items-start w-auto h-auto border-2 border-[#ffffff70] bg-black p-4 gap-2">
      <div className="absolute top-0 left-0 w-full h-full -z-10" />
      
      {playerLines.map(index => {
        const line = chatPlayerLines[formality ?? '하십시오체'][index];

        return (
          <TimeOptionButton
            key={index}
            id={`3-3-4-${index}`}
            onClick={() => handleClick(line, index)}
            label={`> ${line}`}
          />
        )
      })}
    </div>
  )
}

export function SacrificePlayerAnswerOptions({
  playerLines, setPlayerLines, formality, setInput
}: {
  playerLines: number[];
  setPlayerLines: Dispatch<SetStateAction<number[]>>;
  formality: string | null;
  setInput: (input: string) => void
}) {
  function handleClick (line:string, index: number) {
    setInput(line);
    setPlayerLines(prev => prev.filter(i => i !== index));
  }

  return(
    <div className="relative -translate-x-4 flex flex-col items-start w-auto h-auto rounded-2xl p-4 gap-2">
      <div className="absolute top-0 left-0 w-full h-full -z-10" />
      
      {playerLines.map(index => {
        const line = chatPlayerLines[formality ?? '하십시오체'][index];

        return (
          <SacrificeOptionButton
            key={index}
            id={`3-3-4-${index}`}
            onClick={() => handleClick(line, index)}
            label={`> ${line}`}
          />
        )
      })}
    </div>
  )
}

export function EntropyPlayerAnswerOptions({
  playerLines, setPlayerLines, formality, setInput
}: {
  playerLines: number[];
  setPlayerLines: Dispatch<SetStateAction<number[]>>;
  formality: string | null;
  setInput: (input: string) => void
}) {
  return <div>dd</div>
}