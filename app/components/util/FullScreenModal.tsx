import { jersey15 } from "@/app/lib/fonts";
import Button from "./Button";
import { useEffect } from "react";
import { use2dFocusStore } from "@/app/lib/gamepad/inputManager";

export default function FullScreenModal({
  children, title, handleClose
}: {
  children: React.ReactNode;
  title?: string;
  handleClose?: (open: boolean) => void;
}) {
  const { focusables, setFocusIndex } = use2dFocusStore.getState();

  useEffect(() => {
    setFocusIndex(focusables.length)
    return () => {
      setFocusIndex(0)
    }
  }, [])

  return (
    <div className={`${jersey15.className} absolute top-0 left-0 w-screen h-screen flex flex-col items-center p-20 justify-between pointer-events-auto backdrop-blur-xl z-80`}>
      
      {title &&
        <h2 className="text-center text-white text-5xl w-[20em] break-keep font-mono select-none">
          {title ?? 'no title'}
        </h2>
      }
      
      {children}

      {handleClose &&
        <Button
          onClick={() => handleClose(false)}
          label="닫기"
          id='1-3-1'
        />
      }
    </div>
  )
}