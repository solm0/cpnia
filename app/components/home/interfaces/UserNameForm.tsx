import { useUserNameStore } from "@/app/lib/state/userNameStore";
import { ChangeEvent, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Button from "../../util/Button";
import { jersey15 } from "@/app/lib/fonts";
import { use2dFocusStore } from "@/app/lib/gamepad/inputManager";

function Input({
  initValue, value, onChange, id
}: {
  initValue: string | null;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  id: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const { focusIndex, focusables } = use2dFocusStore();
  const index = focusables.findIndex((f) => f.id === id);
  const isFocused = focusIndex === index;

  useEffect(() => {
    if (isFocused) {
      ref.current?.focus();
    }
  }, [isFocused]);

  useEffect(() => {
    if (!ref.current) return;
  
    const updatePosition = () => {
      const rect = ref.current!.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      use2dFocusStore.getState().registerFocusable({ id, x, y, onClick: () => ref.current?.focus() });
    };
  
    const raf = requestAnimationFrame(updatePosition);
  
    return () => {
      cancelAnimationFrame(raf);
      use2dFocusStore.getState().unregisterFocusable(id);
    };
  }, [id]);

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={onChange}
      className={`
        w-auto border-b-1 h-10 text-center text-2xl text-white p-4 truncate
        ${isFocused ? 'border-b-4' : 'outline-none'}
      `}
      placeholder={initValue ?? '베일에 싸인 이방인'}
    />
  )
}

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
            initValue={userName ?? '베일에 싸인 이방인'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            id='1-1-3'
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