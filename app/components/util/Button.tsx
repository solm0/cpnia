export default function Button({
  onClick, label
}: {
  onClick: (param?: number | string) => void;
  label: string;
}) {
  return (
    <button
      onClick={() => onClick?.()}
      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 break-keep w-auto pointer-events-auto"
    >
      {label}
    </button>
  )
}