import { useUserNameStore } from "@/app/lib/state/userNameStore";
import { useEffect, useState } from "react";
import Button from "../../util/Button";

export default function UserNameForm() {
  const userName = useUserNameStore(state => state.userName);
  const setUserName = useUserNameStore(state => state.setUserName);

  const [input, setInput] = useState(userName ?? '');

  useEffect(() => {
    if (!userName) setUserName('베일에 싸인 이방인');
  }, [])

  async function onSubmit(name: string) {
    if (!name) return;
    setUserName(name);
    setInput("");
  }

  return (
    <div className="flex flex-col gap-2 items-center">
      <label htmlFor="form" className="text-sm text-gray-700">당신의 이름은??</label>
      <form
        id="form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(input.trim());
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-96 h-10 text-center rounded-full bg-[#00000099] backdrop-blur-sm text-white border border-gray-700 p-4 truncate"
          placeholder={userName ?? '베일에 싸인 이방인'}
        />
      </form>
      <Button
        onClick={() => onSubmit(input.trim())}
        label="확인"
      />
    </div>
  )
}