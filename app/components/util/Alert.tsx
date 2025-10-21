import { RefObject, useEffect, useState } from "react";
import Button from "./Button";

export default function Alert({
  label, worldKey, ref
}: {
  label: string
  worldKey?: string;
  ref: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, [ref])

  if (isOpen) {
    return (
      <div className="relative w-auto h-auto text-red-600">
        {label}
        <Button
          worldKey={worldKey}
          autoFocus={true}
          label="닫기"
          onClick={() => setIsOpen(false)}
        />
      </div>
    )
  } else return null;
}