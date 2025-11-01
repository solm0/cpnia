import Button from "@/app/components/util/Button";

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
    <div className="h-10 w-full shrink-0 flex gap-4 items-center">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-full text-right max-w-6/7 text-lime-400 truncate focus:outline-none border-b"
        disabled={loading}
        placeholder={`${npcName}에게 물어보기`}
      />
      <Button
        onClick={() => handleSubmit()}
        label="전송"
        worldKey="time"
        disabled={!input.trim()}
        id={'tempId'}
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
    <div className="h-10 w-full shrink-0 flex gap-4 pr-6 items-center">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full h-full text-right max-w-6/7 text-yellow-300 truncate focus:outline-none border-b"
        disabled={loading}
        placeholder={`${npcName}에게 물어보기`}
      />
      <Button
        onClick={() => handleSubmit()}
        label="전송"
        worldKey="sacrifice"
        disabled={!input.trim()}
        id={'tempId'}
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