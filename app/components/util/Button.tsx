export default function Button({
  onClick, label, worldKey, small
}: {
  onClick: (param?: number | string) => void;
  label: string;
  worldKey?: string;
  small?: boolean;
}) {
  switch (worldKey) {
    case 'time':
      return (
        <button
          type="button"
          onClick={() => onClick?.()}
          className={`px-4 ${small ? 'h-full' : 'py-1'} flex items-center border-1 border-[#ffffff70] pointer-events-auto hover:opacity-50 transition-opacity cursor-pointer`}
        >
          {label}
        </button>
      )
    case 'sacrifice':
      return (
        <button
          onClick={() => onClick?.()}
          className="px-3 py-1 rounded-2xl bg-yellow-300 hover:opacity-50 transition-opacity text-gray-700 break-keep w-auto pointer-events-auto"
        >
          {label}
        </button>
      )
    case 'sacrifice':
      return (
        <button
          onClick={() => onClick?.()}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 break-keep w-auto pointer-events-auto"
        >
          {label}
        </button>
      )
    default:
      return (
        <div
          className={`h-10 ${small ? 'w-10' : 'w-auto min-w-40'} relative flex flex-col items-center justify-center pointer-events-auto`}
          onClick={() => onClick?.()}
        >
          {!small && <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />}
          <p className="text-white text-sm h-10 flex items-center">{label}</p>
          {!small && <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />}
          <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-30 active:opacity-30 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white to-transparent"></div>
        </div>
      )
  }
}