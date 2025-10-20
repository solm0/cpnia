import { useUserNameStore } from "@/app/lib/state/userNameStore";
import { useEffect, useState } from "react";
import Button from "../../util/Button";
import { jersey15 } from "@/app/lib/fonts";

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
    <div
      tabIndex={0}
      className={`group w-auto focus-within:outline-none ${jersey15.className} flex gap-4 items-center justify-center pointer-events-auto`}
    >
      <div className="hidden group-focus:block bg-white h-3 w-3 rotate-45"/>
      <label htmlFor="form" className="text-2xl text-white text-center">NAME?</label>

      <div className="hidden group-focus-within:flex gap-2 items-center">
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
            className="w-auto focus-within:outline-none border-b-1 focus-within:border-b-4 h-10 text-center text-2xl text-white p-4 truncate"
            placeholder={userName ?? '베일에 싸인 이방인'}
          />
        </form>
        <Button
          onClick={() => onSubmit(input.trim())}
          label="OK"
          small={true}
        />
      </div>
    </div>
  )
}