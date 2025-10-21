import { jersey15 } from "@/app/lib/fonts";
import { useEffect, useRef } from "react";

export default function Button({
  onClick, label, worldKey, small, autoFocus, disabled = false, gpTabIndex = 0,
}: {
  onClick: (param?: number | string) => void;
  label: string;
  worldKey?: string;
  small?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  gpTabIndex?: number;
}) {
  const divRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (divRef.current && autoFocus === true) {
      divRef.current.focus();
    }
  }, []);

  switch (worldKey) {
    case 'time':
      return (
        <button
          ref={divRef}
          type="button"
          onClick={() => onClick?.()}
          className={`
            px-4
            ${small ? 'h-full' : 'py-1'}
            flex items-center border-1 border-[#ffffff70] pointer-events-auto hover:opacity-50 transition-opacity cursor-pointer
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
          `}
          tabIndex={autoFocus ? -1 : gpTabIndex}
          disabled={disabled ? true : false}
        >
          {label}
        </button>
      )
    case 'sacrifice':
      return (
        <button
          ref={divRef}
          onClick={() => onClick?.()}
          className={`
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
            "px-3 py-1 rounded-2xl bg-yellow-300 hover:opacity-50 transition-opacity text-gray-700 break-keep w-auto pointer-events-auto shrink-0"
          `}
          tabIndex={autoFocus ? -1 : gpTabIndex}
          disabled={disabled ? true : false}
        >
          {label}
        </button>
      )
    case 'entropy':
      return (
        <button
          ref={divRef}
          onClick={() => onClick?.()}
          className={`
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
            "px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 break-keep w-auto pointer-events-auto"
          `}
          tabIndex={autoFocus ? -1 : gpTabIndex}
          disabled={disabled ? true : false}
        >
          {label}
        </button>
      )
    default:
      return (
        <button
          ref={divRef}
          onClick={() => onClick?.()}
          className={`
            h-10
            ${small ? 'w-20' : 'w-auto min-w-40'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
            ${jersey15.className}
            relative flex gap-4 items-center justify-center pointer-events-auto
            group focus:outline-none
          `}
          tabIndex={autoFocus ? -1 : gpTabIndex}
          disabled={disabled ? true : false}
        >
          <div className={`
            hidden bg-white h-3 w-3 rotate-45
            ${small ? '' : 'group-focus:block'}
          `}/>
          <p className="text-white text-2xl h-10 flex items-center">{label}</p>
          <div className={`
            absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-50 active:opacity-40 transition-opacity duration-300 bg-gradient-to-r from-white to-transparent
            ${small ? 'group-focus:opacity-50' : ''}
          `} />
        </button>
      )
  }
}