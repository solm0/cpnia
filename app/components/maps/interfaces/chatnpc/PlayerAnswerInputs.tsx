import Button from "@/app/components/util/Button";
import Input from "@/app/components/util/Input";

export function TimePlayerAnswerInput({
  input, setInput, loading, npcName, handleSubmit
}: {
  input: string;
  setInput: (input: string) => void;
  loading: boolean;
  npcName: string;
  handleSubmit: () => void;
}) {
  return (
    <div className="h-10 w-full flex gap-4 items-center max-w-6/7 ml-auto">
      <Input
        id='3-3-2'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
        placeholder={`${npcName}에게 물어보기`}
        style="w-full h-full text-right text-lime-400 truncate"
      />
      <Button
        onClick={() => handleSubmit()}
        label="전송"
        worldKey="time"
        disabled={!input.trim()}
        id='3-3-3'
      />
    </div>
  )
}

export function SacrificePlayerAnswerInput({
  input, setInput, loading, npcName, handleSubmit
}: {
  input: string;
  setInput: (input: string) => void;
  loading: boolean;
  npcName: string;
  handleSubmit: () => void;
}) {
  return (
    <div className="h-10 w-full shrink-0 flex gap-4 pr-6 items-center max-w-6/7 ml-auto">
      <Input
        id='3-3-2'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={loading}
        placeholder={`${npcName}에게 물어보기`}
        style="w-full h-full text-right text-yellow-300 truncate focus:outline-none border-b"
      />
      <Button
        onClick={() => handleSubmit()}
        label="전송"
        worldKey="sacrifice"
        disabled={!input.trim()}
        id='3-3-3'
      />
    </div>
  )
}

export function EntropyPlayerAnswerInput({
  input, setInput, loading, npcName, handleSubmit
}: {
  input: string;
  setInput: (input: string) => void;
  loading: boolean;
  npcName: string;
  handleSubmit: () => void;
}) {
  return <div>dd</div>
}