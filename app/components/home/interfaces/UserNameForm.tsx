import { useUserNameStore } from "@/app/lib/state/userNameStore";
import { useEffect, useState } from "react";
import Button from "../../util/Button";
import { jersey15 } from "@/app/lib/fonts";
import Input from "../../util/Input";

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
    <div className={`group w-auto focus-within:outline-none ${jersey15.className} flex gap-4 items-center justify-center pointer-events-auto pt-4 translate-x-3`}>
      <label htmlFor="form" className="text-2xl text-white text-center">NAME?</label>
      <div className="flex gap-2 items-center">
        <form
          id="form"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(input.trim());
          }}
        >
          <Input
            placeholder={userName ?? '베일에 싸인 이방인'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            id='1-1-3'
            style='w-auto h-10 text-center text-2xl text-white p-4 truncate border-white'
          />
        </form>
        <Button
          onClick={() => onSubmit(input.trim())}
          label="OK"
          small={true}
          id="1-1-4"
        />
      </div>
    </div>
  )
}