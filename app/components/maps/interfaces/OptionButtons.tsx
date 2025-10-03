export function TimeOptionButton({
  onClick, label
}: {
  onClick: (param?: number | string) => void;
  label: string;
}) {
  return (
    <div
      tabIndex={0}
      onClick={() => onClick?.()}
      className="w-full text-lime-400 hover:opacity-50 transition-opacity flex items-center"
    >
      {label}
    </div>
  )
}

export function SacrificeOptionButton({
  onClick, label
}: {
  onClick: (param?: number | string) => void;
  label: string;
}) {
  return (
    <div
      tabIndex={0}
      onClick={() => onClick?.()}
      className="w-full text-lime-400 hover:opacity-50 transition-opacity flex items-center"
    >
      {label}
    </div>
  )
}

export function EntropyOptionButton({
  onClick, label
}: {
  onClick: (param?: number | string) => void;
  label: string;
}) {
  return (
    <div
      tabIndex={0}
      onClick={() => onClick?.()}
      className="w-full text-lime-400 hover:opacity-50 transition-opacity flex items-center"
    >
      {label}
    </div>
  )
}